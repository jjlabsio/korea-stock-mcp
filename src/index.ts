import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as disclosureInfo from "./dart/disclosure-info/index.js";
import * as periodicReports from "./dart/periodic-reports/index.js";

// Create server instance
const server = new McpServer({
  name: "korea-dart-mcp",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

/**
 * 공시정보
 */

server.tool(
  "get_disclosure_list",
  `공시검색: 공시 유형별, 회사별, 날짜별 등 여러가지 조건으로 공시보고서 검색기능을 제공합니다.

Response Format: ${disclosureInfo.getDisclosureListResponseDescription}`,
  disclosureInfo.getDisclosureListSchema.shape,
  async (params) => {
    const args = disclosureInfo.getDisclosureListSchema.parse(params);
    const response = await disclosureInfo.getDisclosureList(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_company_outline",
  `기업개황: DART에 등록되어있는 기업의 개황정보를 제공합니다.

Response Format: ${disclosureInfo.getCompanyOutlineResponseDescription}`,
  disclosureInfo.getCompanyOutlineSchema.shape,
  async (params) => {
    const args = disclosureInfo.getCompanyOutlineSchema.parse(params);
    const response = await disclosureInfo.getCompanyOutline(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_corp_code",
  `고유번호: DART에 등록되어있는 공시대상회사의 고유번호, 회사명, 종목코드, 최근변경일자 제공합니다.

Response Format: ${disclosureInfo.getCorpCodeResponseDescription}`,
  disclosureInfo.getCorpCodeSchema.shape,
  async (params) => {
    const args = disclosureInfo.getCorpCodeSchema.parse(params);
    const response = await disclosureInfo.getCorpCode(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

/**
 * 정기보고서 주요정보
 */

server.tool(
  "get_stock_increase_decrease_status",
  `증자(감자) 현황: 정기보고서 내에 증자(감자) 현황을 제공합니다.

Response Format: ${periodicReports.getStockIncreaseDecreaseStatusResponseDescription}`,
  periodicReports.getStockIncreaseDecreaseStatusSchema.shape,
  async (params) => {
    const args = periodicReports.getStockIncreaseDecreaseStatusSchema.parse(params);
    const response = await periodicReports.getStockIncreaseDecreaseStatus(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_dividend_info",
  `배당에 관한 사항: 정기보고서 내에 배당에 관한 사항을 제공합니다.

Response Format: ${periodicReports.getDividendInfoResponseDescription}`,
  periodicReports.getDividendInfoSchema.shape,
  async (params) => {
    const args = periodicReports.getDividendInfoSchema.parse(params);
    const response = await periodicReports.getDividendInfo(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_major_shareholder_status",
  `최대주주 현황: 정기보고서 내에 최대주주 현황을 제공합니다.

Response Format: ${periodicReports.getMajorShareholderStatusResponseDescription}`,
  periodicReports.getMajorShareholderStatusSchema.shape,
  async (params) => {
    const args = periodicReports.getMajorShareholderStatusSchema.parse(params);
    const response = await periodicReports.getMajorShareholderStatus(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_executive_status",
  `임원 현황: 정기보고서 내에 임원 현황을 제공합니다.

Response Format: ${periodicReports.getExecutiveStatusResponseDescription}`,
  periodicReports.getExecutiveStatusSchema.shape,
  async (params) => {
    const args = periodicReports.getExecutiveStatusSchema.parse(params);
    const response = await periodicReports.getExecutiveStatus(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_employee_status",
  `직원 현황: 정기보고서 내에 직원 현황을 제공합니다.

Response Format: ${periodicReports.getEmployeeStatusResponseDescription}`,
  periodicReports.getEmployeeStatusSchema.shape,
  async (params) => {
    const args = periodicReports.getEmployeeStatusSchema.parse(params);
    const response = await periodicReports.getEmployeeStatus(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_bond_issuance_status",
  `채무증권 발행실적: 정기보고서 내에 채무증권 발행실적을 제공합니다.

Response Format: ${periodicReports.getBondIssuanceStatusResponseDescription}`,
  periodicReports.getBondIssuanceStatusSchema.shape,
  async (params) => {
    const args = periodicReports.getBondIssuanceStatusSchema.parse(params);
    const response = await periodicReports.getBondIssuanceStatus(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_auditor_opinion",
  `회계감사인의 명칭 및 감사의견: 정기보고서 내에 회계감사인의 명칭 및 감사의견을 제공합니다.

Response Format: ${periodicReports.getAuditorOpinionResponseDescription}`,
  periodicReports.getAuditorOpinionSchema.shape,
  async (params) => {
    const args = periodicReports.getAuditorOpinionSchema.parse(params);
    const response = await periodicReports.getAuditorOpinion(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_other_corporation_investment",
  `타법인 출자현황: 정기보고서 내에 타법인 출자현황을 제공합니다.

Response Format: ${periodicReports.getOtherCorporationInvestmentResponseDescription}`,
  periodicReports.getOtherCorporationInvestmentSchema.shape,
  async (params) => {
    const args = periodicReports.getOtherCorporationInvestmentSchema.parse(params);
    const response = await periodicReports.getOtherCorporationInvestment(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Korea Dart MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
