---
"korea-stock-mcp": patch
---

get_disclosure에서 감사보고서 등 첨부서류가 ZIP의 첫 항목인 공시(주로 사업보고서)를 조회하면 본문 대신 첨부 문서가 반환되던 문제를 수정했습니다. 이제 ZIP 안에서 본문({rcept_no}.xml)을 우선 선택합니다.
