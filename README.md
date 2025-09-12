# Korea Stock MCP Server

[🇰🇷 한국어](#korea-stock-mcp-server) | [🇺🇸 English](#english-version)

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

**프롬프트**: "삼양식품의 2023년, 2024년 1~4분기, 2025년 1,2분기 매출, 영업이익 조사해주고 성장률도 조사해줘"  
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

---

# English Version

MCP Server for Korean stock analysis.  
Enables AI-powered analysis of stock prices and disclosure data through official APIs from DART (Data Analysis, Retrieval and Transfer System) and KRX (Korea Exchange).

## 🎯 Key Features

- 🔍 **Disclosure Search** - Search corporate disclosures by company and date
- 📊 **Disclosure Data** - Provides parsed data from original disclosure reports
- 💼 **Financial Statement Analysis** - Detailed financial data based on XBRL
- 📈 **Stock Data** - KRX (KOSPI/KOSDAQ) daily stock prices and basic stock information

## ⚡ Quick Start

### 1️⃣ API KEY Registration

You need to obtain API KEYs from both DART and KRX.

#### 📝 DART API KEY Registration

1. **Sign Up**: Register at [OPEN DART](https://opendart.fss.or.kr)
2. **Request Key**: Apply for API KEY at [Authentication Key Application Page](https://opendart.fss.or.kr/uss/umt/EgovMberInsertView.do)
3. **Check Key**: Verify issued API KEY at [Open API Usage Status](https://opendart.fss.or.kr/mng/apiUsageStatusView.do)

#### 📈 KRX API KEY Registration

1. **Sign Up**: Register and login at [KRX OPEN API](https://openapi.krx.co.kr/contents/OPP/MAIN/main/index.cmd)
2. **Request Key**: Apply for API authentication key in My Page → API Authentication Key Application
3. **Service Application**: After approval, go to Service Use → Stock menu
4. **API Usage Application**: Click "API Usage Application" for each of the following 6 items

   - Securities Daily Trading Information
   - KOSDAQ Daily Trading Information
   - KONEX Daily Trading Information
   - Securities Basic Information
   - KOSDAQ Basic Information
   - KONEX Basic Information

   > ⏱️ **Approval takes approximately 1 day.**

5. **Key Verification**: After approval, check API KEY in My Page → API Authentication Key Issuance History

### 2️⃣ Claude Desktop Setup

1. Launch **Claude Desktop**
2. Go to **Settings** → **Developer** → **Edit Configuration**
3. Add the following content to `claude_desktop_config.json`:

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

4. **Restart**: Restart Claude Desktop to apply settings

> You can now start analyzing Korean stock data with Claude.

## Available Tools

### DART (Data Analysis, Retrieval and Transfer System)

1. **get_disclosure_list** - Disclosure Search

   - Search disclosure reports by type, company, and date

2. **get_corp_code** - Corporate Code Inquiry

   - Provides unique codes, company names, and stock codes of DART-registered disclosure companies

3. **get_disclosure** - Disclosure Report Content

   - Parse original disclosure report files through DART API

4. **get_financial_statement** - Financial Statements
   - XBRL financial statements for listed and major unlisted companies
   - Provides all account data from periodic reports

### KRX (Korea Exchange)

1. **get_stock_base_info** - Basic Stock Information

   - Basic information for KOSPI, KOSDAQ, and KONEX listed stocks
   - Basic data including stock names, codes, and market classifications

2. **get_stock_trade_info** - Daily Trading Information
   - Daily trading data for KOSPI, KOSDAQ, and KONEX stocks
   - Detailed trading information including stock prices, trading volume, and market capitalization

### Other Tools

1. **get_today_date** - Today's Date Inquiry
   - Provides current date in YYYYMMDD format
   - Tool for AI's accurate date inquiry

## Real Usage Examples

### 📊 Financial Analysis Examples

**Prompt**: "Investigate Samyang Foods's sales and operating profit for Q1-Q4 2023, Q1-Q4 2024, and Q1-Q2 2025, and also check growth rates"  
→ [See Samyang Foods Analysis Results](./example/삼양식품.md)

**Prompt**: "Investigate APR's sales and operating profit growth from Q1 2023 to Q2 2025, along with stock price and market cap trends"  
→ [See APR Analysis Results](./example/에이피알.md)

### 🏢 Corporate Analysis Examples

**Prompt**: "Tell me what HJ SHIPBUILDING & CONSTRUCTION does to make money and include sales by business segment"  
→ [See HJ SHIPBUILDING & CONSTRUCTION Analysis Results](./example/HJ중공업.md)

## API Data Sources

- **DART (Data Analysis, Retrieval and Transfer System)**: Listed company disclosure information and financial statements
- **KRX (Korea Exchange)**: Basic stock information and daily trading information

## Contributing

Contributions are welcome! Please send us a Pull Request.

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC License

## Support

- 🐛 If you have issues, please register them in GitHub Issues
- ⭐ If you find it useful, please give it a star!

## Disclaimer

This tool is for informational purposes only and is not investment advice. All investment decisions are your own responsibility.
