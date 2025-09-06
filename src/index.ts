import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as disclosureInfo from "./dart/disclosure-info/index.js";

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Korea Dart MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
