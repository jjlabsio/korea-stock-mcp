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

### `get_disclosure` 수정

1. DART API에서 ZIP 다운로드
2. ZIP magic bytes(`0x50 0x4B`) 체크 → 아니면 에러 XML 파싱 반환
3. XML 추출 → 파싱 → `JSON.stringify` 크기 측정
4. **< 1MB**: 전체 문서 반환 (기존 동작 유지)
5. **>= 1MB**: 목차만 반환

목차 응답 형태:

```json
{
  "_notice": "문서가 커서 목차만 반환합니다. get_disclosure_section으로 원하는 섹션을 조회하세요.",
  "document_name": "증권신고서(지분증권)",
  "company_name": "코스모로보틱스 주식회사",
  "sections": [
    { "id": "CORRECTION", "title": "정정신고(보고)" },
    { "id": "D-1-1-1-0", "title": "1. 공모개요" }
  ]
}
```

섹션 ID는 TITLE 태그의 `AASSOCNOTE` 속성값을 사용한다.

### `get_disclosure_section` 새 tool

**입력:**

- `rcept_no`: 접수번호 (14자리)
- `section_id`: 목차에서 받은 섹션 ID

**동작:**

1. DART API에서 동일 문서 fetch (ZIP → XML)
2. `AASSOCNOTE` 값이 일치하는 TITLE의 부모 섹션 추출
3. 해당 섹션만 파싱 → `JSON.stringify` 크기 측정
4. **< 1MB**: 해당 섹션 반환
5. **>= 1MB**: 하위 섹션 목차 반환 (재귀적으로 동일한 패턴)

**섹션을 찾을 수 없는 경우:** 에러 메시지 + 유효한 섹션 ID 목록 반환.

### Fallback: 하위 섹션도 없이 1MB 초과

현실적으로 가능성이 매우 낮지만, 발생 시 텍스트를 1MB 단위로 잘라서 `page` 파라미터로 조회하는 fallback 적용.

## XML Structure

DART document.xml의 XML 구조:

```
DOCUMENT
  DOCUMENT-NAME
  COMPANY-NAME
  BODY
    LIBRARY
      CORRECTION (정정신고)
    PART (제N부)
      SECTION-1
        SECTION-2
          TITLE (ATOC="Y", AASSOCNOTE="section-id")
          ... content (TABLE, P, etc.)
```

- `TITLE` 태그의 `ATOC="Y"` → 목차 항목
- `TITLE` 태그의 `AASSOCNOTE` → 섹션 식별자
- 계층: `PART` > `SECTION-1` > `SECTION-2`

## Error Handling

1. **ZIP이 아닌 응답**: magic bytes 체크 → XML 에러 메시지 파싱 반환
2. **잘못된 section_id**: 에러 메시지 + 유효 섹션 목록
3. **단일 노드 1MB 초과 (하위 섹션 없음)**: 텍스트 청크 분할 + page 파라미터

## Scope

### In Scope

- `get_disclosure` 크기 기반 분기 로직
- `get_disclosure_section` 새 tool
- ZIP magic bytes 체크 (에러 응답 처리)
- 재귀적 하위 목차 반환

### Out of Scope

- 응답 캐싱 (stateless 유지)
- DART API 외 다른 tool 변경
