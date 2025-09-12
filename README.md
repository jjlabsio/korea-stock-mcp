# Korea Stock MCP Server

한국 주식 분석을 위한 MCP 서버입니다.  
DART(전자공시시스템)와 KRX(한국거래소) 공식 API를 통해 주가 정보와 공시 자료 기반의 AI분석이 가능합니다.

## 🎯 주요 기능

- 🔍 **공시검색** - 회사별, 기간별 공시 검색
- 📊 **공시 데이터** - 공시보고서 원본파일 파싱한 데이터 제공
- 💼 **재무제표 분석** - XBRL 기반 상세 재무 데이터
- 📈 **주식 데이터** - KRX(코스피/코스닥) 일별 주가정보, 종목 기본정보

## ⚡ 빠른 시작

### 1️⃣ API KEY 발급

먼저 DART와 KRX의 API KEY를 발급받아야 합니다.

#### 📝 DART API KEY 발급

1. **회원가입**: [OPEN DART](https://opendart.fss.or.kr) 회원가입
2. **키 신청**: [인증키 신청 페이지](https://opendart.fss.or.kr/uss/umt/EgovMberInsertView.do)에서 API KEY 신청
3. **키 확인**: [오픈API 이용현황](https://opendart.fss.or.kr/mng/apiUsageStatusView.do)에서 발급된 API KEY 확인

#### 📈 KRX API KEY 발급

1. **회원가입**: [KRX OPEN API](https://openapi.krx.co.kr/contents/OPP/MAIN/main/index.cmd)에서 회원가입 및 로그인
2. **키 신청**: 마이페이지 → API 인증키 신청에서 신청
3. **서비스 신청**: 승인 후 서비스이용 → 주식 메뉴로 이동
4. **API 이용신청**: 다음 6개 항목에서 각각 "API 이용신청" 클릭

   - 유가증권 일별매매정보
   - 코스닥 일별매매정보
   - 코넥스 일별매매정보
   - 유가증권 종목기본정보
   - 코스닥 종목기본정보
   - 코넥스 종목기본정보

   > ⏱️ **승인까지 약 1일 소요됩니다.**

5. **키 확인**: 승인 후 마이페이지 → API 인증키 발급내역에서 API KEY 확인

### 2️⃣ Claude Desktop 설정

1. **Claude Desktop** 실행
2. **설정** → **개발자** → **구성편집** 클릭
3. `claude_desktop_config.json` 파일에 다음 내용 추가:

```json
{
  "mcpServers": {
    "korea-stock-mcp": {
      "command": "npx",
      "args": ["-y", "korea-stock-mcp@latest"],
      "env": {
        "DART_API_KEY": "<YOUR_DART_API_KEY>",
        "KRX_API_KEY": "<YOUR_KRX_API_KEY>"
      }
    }
  }
}
```

4. **재시작**: Claude Desktop을 재시작하여 설정 적용

> 이제 Claude에서 한국 주식 데이터 분석을 시작할 수 있습니다.

## 사용 가능한 도구

### DART (전자공시시스템)

1. **get_disclosure_list** - 공시검색

   - 공시 유형별, 회사별, 날짜별 공시보고서 검색

2. **get_corp_code** - 고유번호 조회

   - DART 등록 공시대상회사의 고유번호, 회사명, 종목코드 제공

3. **get_disclosure** - 공시보고서 원문

   - DART API를 통한 공시보고서 원본파일 파싱

4. **get_financial_statement** - 재무제표
   - 상장법인 및 주요 비상장법인 XBRL 재무제표
   - 정기보고서 내 모든 계정과목 데이터 제공

### KRX (한국거래소)

1. **get_stock_base_info** - 종목 기본정보

   - 코스피, 코스닥, 코넥스 상장 종목 기본 정보
   - 종목명, 종목코드, 시장구분 등 기본 데이터

2. **get_stock_trade_info** - 일별 매매정보
   - 코스피, 코스닥, 코넥스 종목별 일별 거래 데이터
   - 주가, 거래량, 시가총액 등 상세 거래 정보

### 기타 도구

1. **get_today_date** - 오늘 날짜 조회
   - 현재 날짜를 YYYYMMDD 형식으로 제공
   - AI의 정확한 날짜 조회를 위한 도구

## 실제 사용 예시

### 📊 재무 분석 예제

**프롬프트**: "2023년, 2024년 1~4분기, 2025년 1,2분기 매출, 영업이익 조사해주고 성장률도 조사해줘"  
→ [삼양식품 분석 결과 보기](./example/삼양식품.md)

**프롬프트**: "에이피알의 23년 1분기부터 25년 2분기까지의 매출, 영업이익 성장과 주가, 시가총액 흐름을 조사해줘"  
→ [에이피알 분석 결과 보기](./example/에이피알.md)

### 🏢 기업 분석 예제

**프롬프트**: "HJ중공업은 뭘 해서 돈을 버는 회사인지랑 사업부문별 매출까지 같이 알려줘"  
→ [HJ중공업 분석 결과 보기](./example/HJ중공업.md)

## API 데이터 소스

- **DART (전자공시시스템)**: 상장기업 공시 정보 및 재무제표
- **KRX (한국거래소)**: 종목 기본정보 및 일별 매매정보

## 기여하기

기여를 환영합니다! Pull Request를 보내주세요.

1. 이 저장소를 포크하세요
2. 기능 브랜치를 만드세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 열어주세요

## 라이선스

ISC 라이선스

## 지원

- 🐛 이슈가 있다면 GitHub Issues에 등록해주세요
- ⭐ 유용하다면 스타를 눌러주세요!

## 면책 조항

본 도구는 정보 제공 목적이며, 투자 조언이 아닙니다. 모든 투자 결정은 본인 책임입니다.
