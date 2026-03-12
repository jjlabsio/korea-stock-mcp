# Large Disclosure Handling Design

## Problem

DART 공시 중 IPO 증권신고서 등 대형 문서는 XML 압축 해제 후 7MB 이상이 될 수 있다. MCP tool result의 최대 크기는 1MB이므로, 이런 문서는 `get_disclosure`로 조회할 수 없다.

### 실측 데이터 (rcept_no: 20260310002977)

- ZIP 응답: 0.77MB
- XML 압축 해제: 6.98MB
- 전체 65개 섹션 중 1MB 초과: 2개
  - `CORRECTION` 정정신고(보고): 2.14MB
  - `D-1-4-0-0` 인수인의 의견: 1.17MB

## Solution: Size-Adaptive Response with Section Navigation

문서 크기에 따라 자동 분기하는 방식.

### XMLParser 설정 변경

`fast-xml-parser`의 기본 설정은 `ignoreAttributes: true`이므로, `AASSOCNOTE`, `ATOC` 등 속성이 모두 무시된다. 섹션 식별을 위해 반드시 변경 필요:

```ts
new XMLParser({ ignoreAttributes: false })
```

이 변경으로 기존 `get_disclosure`의 JSON 출력 형태가 달라진다 (속성이 `@_` 접두사로 포함됨). 단, 기존에도 속성이 누락되고 있었으므로 이는 버그 수정에 해당하며, breaking change로 보지 않는다.

### `get_disclosure` 수정

1. DART API에서 ZIP 다운로드
2. ZIP magic bytes(`0x50 0x4B`) 체크 → 아니면 에러 XML 파싱 반환
3. XML 추출 → 파싱 → `Buffer.byteLength(JSON.stringify(parsed))` 크기 측정 (바이트 단위, 한글 UTF-8 3바이트 고려)
4. **< 1MB**: 전체 문서 반환 (기존 동작 유지)
5. **>= 1MB**: 목차만 반환

목차 응답 형태:

```json
{
  "type": "toc",
  "document_name": "증권신고서(지분증권)",
  "company_name": "코스모로보틱스 주식회사",
  "total_size_bytes": 7322230,
  "sections": [
    { "id": "CORRECTION", "title": "정정신고(보고)", "size_bytes": 2245632 },
    { "id": "D-1-1-1-0", "title": "1. 공모개요", "size_bytes": 17305 }
  ]
}
```

- 섹션 ID: TITLE 태그의 `AASSOCNOTE` 속성값
- `type: "toc"`: LLM이 응답 유형을 판별하는 discriminator
- `size_bytes`: LLM이 섹션 크기를 사전에 파악하여 요청 계획 수립 가능

### `get_disclosure_section` 새 tool

**입력:**

- `rcept_no`: 접수번호 (14자리)
- `section_id`: 목차에서 받은 섹션 ID

**동작:**

1. 캐시에서 XML 조회 (없으면 DART API fetch → ZIP → XML, 캐시 저장)
2. XML 문자열에서 `AASSOCNOTE` 값이 일치하는 TITLE을 포함하는 **직접 부모 컨테이너** 추출
3. 해당 섹션만 파싱 → `Buffer.byteLength` 크기 측정
4. **< 1MB**: 해당 섹션 반환 (`type: "section"`)
5. **>= 1MB**: 하위 섹션 목차 반환 (`type: "toc"`)

**섹션 추출 전략:** XML 문자열 레벨에서 정규식/문자열 검색으로 해당 TITLE을 찾은 뒤, 그 TITLE을 감싸는 가장 가까운 컨테이너 태그(`SECTION-2`, `SECTION-1`, `PART`, `CORRECTION`, `LIBRARY`)의 열림~닫힘 범위를 추출한다. `fast-xml-parser`의 파싱된 JSON 트리를 역탐색하는 것보다, 원본 XML 문자열에서 직접 범위를 추출하는 것이 간단하고 정확하다.

**섹션을 찾을 수 없는 경우:** 에러 메시지 + 유효한 섹션 ID 목록 반환.

### In-Memory Cache

동일 문서의 여러 섹션을 연속 조회하는 패턴이 일반적이므로, 불필요한 DART API 중복 호출을 방지하기 위해 간단한 인메모리 캐시를 적용한다.

- Key: `rcept_no`
- Value: XML 문자열
- TTL: 5분
- 최대 엔트리: 3개 (LRU)

### Fallback: 하위 섹션도 없이 1MB 초과

발생 시 `get_disclosure_section`에 optional `page` 파라미터를 추가한다.

- `page`: 페이지 번호 (기본값 1)
- 파싱된 JSON 문자열을 800KB 단위로 분할
- 응답에 `total_pages`, `current_page` 포함
- 분할은 JSON 문자열이 아닌 텍스트 콘텐츠(TABLE, P 등의 내용) 단위로 수행

## XML Structure

DART document.xml의 XML 구조:

```
DOCUMENT
  DOCUMENT-NAME (ACODE)
  COMPANY-NAME (AREGCIK)
  BODY (ATOCID)
    LIBRARY
      CORRECTION
        TITLE (ATOC="Y", AASSOCNOTE="CORRECTION")
        SECTION-1 / SECTION-2 ...
    PART
      TITLE (ATOC="Y", AASSOCNOTE="D-1-0-0-0")
      SECTION-1
        TITLE (ATOC="Y", AASSOCNOTE="L-2-1-0-0")
        SECTION-2
          TITLE (ATOC="Y", AASSOCNOTE="L-2-1-1-0")
          ... content (TABLE, P, etc.)
```

- `TITLE[ATOC="Y"]` → 목차 항목
- `TITLE[AASSOCNOTE]` → 섹션 식별자
- 컨테이너 계층: `LIBRARY/CORRECTION`, `PART`, `SECTION-1`, `SECTION-2`

## Error Handling

1. **ZIP이 아닌 응답**: magic bytes 체크 → XML 에러 메시지 파싱 반환
2. **잘못된 section_id**: 에러 메시지 + 유효 섹션 목록
3. **단일 노드 1MB 초과 (하위 섹션 없음)**: 텍스트 청크 분할 + page 파라미터

## Scope

### In Scope

- `get_disclosure` 크기 기반 분기 로직
- `get_disclosure_section` 새 tool 등록
- XMLParser `ignoreAttributes: false` 설정
- ZIP magic bytes 체크 (에러 응답 처리)
- 재귀적 하위 목차 반환
- 인메모리 캐시 (TTL 5분, LRU 3개)
- `get_disclosure` tool description 업데이트
- `console.error` 디버그 로그 제거

### Out of Scope

- DART API 외 다른 tool 변경
- 테스트 인프라 구축
