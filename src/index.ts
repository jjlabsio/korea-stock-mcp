import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  getFinancialStatement,
  getFinancialStatementSchema,
} from "./dart/get-financial-statement.js";
import { getDisclosure, getDisclosureSchema } from "./dart/get-disclosure.js";
import {
  getDisclosureList,
  getDisclosureListSchema,
} from "./dart/get-disclosure-list.js";
import { getCorpCode, getCorpCodeSchema } from "./dart/get-corp-code.js";

const server = new McpServer({
  name: "korea-dart-mcp",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

server.tool(
  "get_disclosure_list",
  `
  공시검색: 공시 유형별, 회사별, 날짜별 등 여러가지 조건으로 공시보고서 검색기능을 제공합니다.
  최근 공시를 검색할때는 bgn_de를 반드시 지정하세요.
  `,
  getDisclosureListSchema.shape,
  async (params) => {
    const args = getDisclosureListSchema.parse(params);
    const response = await getDisclosureList(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_corp_code",
  "고유번호: DART에 등록되어있는 공시대상회사의 고유번호, 회사명, 종목코드, 최근변경일자 제공합니다. 이름이 일치하는 경우 모든 항목을 반환합니다.",
  getCorpCodeSchema.shape,
  async (params) => {
    const args = getCorpCodeSchema.parse(params);
    const response = await getCorpCode(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_disclosure",
  "DART API를 통해 공시보고서 원본파일을 파싱해 가져옵니다.",
  getDisclosureSchema.shape,
  async (params) => {
    const args = getDisclosureSchema.parse(params);
    const response = await getDisclosure(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_financial_statement",
  "재무제표: 상장법인(유가증권, 코스닥) 및 주요 비상장법인(사업보고서 제출대상 & IFRS 적용)이 제출한 정기보고서 내에 XBRL재무제표의 모든계정과목을 제공합니다.",
  getFinancialStatementSchema.shape,
  async (params) => {
    const args = getFinancialStatementSchema.parse(params);
    const response = await getFinancialStatement(args);

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
