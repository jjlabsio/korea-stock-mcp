#!/usr/bin/env node --max-old-space-size=4096

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as dart from "./dart/index.js";
import * as krx from "./krx/index.js";
import * as common from "./common/index.js";

const server = new McpServer({
  name: "korea-stock-mcp",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

/**
 * DART
 */

server.tool(
  "get_corp_code",
  `
  고유번호: DART에 등록되어있는 공시대상회사의 고유번호, 회사명, 종목코드, 최근변경일자 제공합니다.
  이름이 일치하는 경우 모든 항목을 반환합니다.
  `,
  dart.getCorpCodeSchema.shape,
  async (params) => {
    const args = dart.getCorpCodeSchema.parse(params);
    const response = await dart.getCorpCode(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_disclosure_list",
  `
  공시검색: 공시 유형별, 회사별, 날짜별 등 여러가지 조건으로 공시보고서 검색기능을 제공합니다.
  최근 공시를 검색할때는 bgn_de를 반드시 지정하세요.
  `,
  dart.getDisclosureListSchema.shape,
  async (params) => {
    const args = dart.getDisclosureListSchema.parse(params);
    const response = await dart.getDisclosureList(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_disclosure",
  "DART API를 통해 공시보고서 원본파일을 파싱해 가져옵니다.",
  dart.getDisclosureSchema.shape,
  async (params) => {
    const args = dart.getDisclosureSchema.parse(params);
    const response = await dart.getDisclosure(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_financial_statement",
  "재무제표: 상장법인(유가증권, 코스닥) 및 주요 비상장법인(사업보고서 제출대상 & IFRS 적용)이 제출한 정기보고서 내에 XBRL재무제표의 모든계정과목을 제공합니다.",
  dart.getFinancialStatementSchema.shape,
  async (params) => {
    const args = dart.getFinancialStatementSchema.parse(params);
    const response = await dart.getFinancialStatement(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

/**
 * KRX
 */

server.tool(
  "get_stock_base_info",
  `
  코스피, 코스닥, 코넥스에 상장되어있는 종목의 종목기본정보를 제공합니다.
  basDd를 기준으로 codeList에 종목코드가 포함된 종목들의의 정보만 추출됩니다.
  `,
  krx.getBaseInfoSchema.shape,
  async (params) => {
    const args = krx.getBaseInfoSchema.parse(params);
    const response = await krx.getBaseInfo(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_stock_trade_info",
  `
  코스피, 코스닥, 코넥스에 상장되어있는 종목의 일별매매정보를 제공합니다.
  basDd를 기준으로 codeList에 종목코드가 포함된 종목들의의 정보만 추출됩니다.
  `,
  krx.getTradeInfoSchema.shape,
  async (params) => {
    const args = krx.getTradeInfoSchema.parse(params);
    const response = await krx.getTradeInfo(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

/**
 * Common
 */

server.tool(
  "get_today_date",
  "오늘 날짜를 KST, UTC 기준 YYYYMMDD 형식으로 제공합니다.",
  {},
  () => {
    const response = common.getToday();

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
