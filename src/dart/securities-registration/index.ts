/**
 * 증권신고서 주요정보
 * OpenDART API DS006 그룹
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS006
 */

import z from "zod";

// 지분증권 및 채무증권
export {
  getEquitySecurities,
  getEquitySecuritiesSchema,
  getEquitySecuritiesResponseDescription,
  getDebtSecurities,
  getDebtSecuritiesSchema,
  getDebtSecuritiesResponseDescription,
  type GetEquitySecuritiesParams,
  type GetDebtSecuritiesParams,
} from "./equity-debt-securities.js";

// 증권예탁증권 및 합병
export {
  getDepositaryReceipts,
  getDepositaryReceiptsSchema,
  getDepositaryReceiptsResponseDescription,
  getMerger,
  getMergerSchema,
  getMergerResponseDescription,
  type GetDepositaryReceiptsParams,
  type GetMergerParams,
} from "./depositary-merger.js";

// 주식의포괄적교환·이전 및 분할
export {
  getComprehensiveStockExchangeTransfer,
  getComprehensiveStockExchangeTransferSchema,
  getComprehensiveStockExchangeTransferResponseDescription,
  getDivision,
  getDivisionSchema,
  getDivisionResponseDescription,
  type GetComprehensiveStockExchangeTransferParams,
  type GetDivisionParams,
} from "./stock-exchange-division.js";

// Import all functions for the unified tool
import {
  getEquitySecurities,
  getEquitySecuritiesSchema,
  getEquitySecuritiesResponseDescription,
  getDebtSecurities,
  getDebtSecuritiesSchema,
  getDebtSecuritiesResponseDescription,
} from "./equity-debt-securities.js";

import {
  getDepositaryReceipts,
  getDepositaryReceiptsSchema,
  getDepositaryReceiptsResponseDescription,
  getMerger,
  getMergerSchema,
  getMergerResponseDescription,
} from "./depositary-merger.js";

import {
  getComprehensiveStockExchangeTransfer,
  getComprehensiveStockExchangeTransferSchema,
  getComprehensiveStockExchangeTransferResponseDescription,
  getDivision,
  getDivisionSchema,
  getDivisionResponseDescription,
} from "./stock-exchange-division.js";

// 통합 스키마
export const securitiesRegistrationInfoSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bsns_year: z
    .string()
    .length(4)
    .describe("사업연도(4자리) - 2015년 이후부터 정보제공"),
  reprt_code: z
    .string()
    .length(5)
    .describe(
      "보고서 코드 - 1분기보고서: 11013, 반기보고서: 11012, 3분기보고서: 11014, 사업보고서: 11011"
    ),
  report_type: z
    .enum([
      "equity_securities",
      "debt_securities",
      "depositary_receipts",
      "merger",
      "comprehensive_stock_exchange_transfer",
      "division",
    ])
    .describe("증권신고서 정보 유형 - 요청할 증권신고서 주요정보의 종류"),
});
export type SecuritiesRegistrationInfoParams = z.infer<typeof securitiesRegistrationInfoSchema>;

// 함수 매핑
export const securitiesRegistrationFunctionMap = {
  equity_securities: {
    func: getEquitySecurities,
    schema: getEquitySecuritiesSchema,
    description: getEquitySecuritiesResponseDescription,
    name: "지분증권",
  },
  debt_securities: {
    func: getDebtSecurities,
    schema: getDebtSecuritiesSchema,
    description: getDebtSecuritiesResponseDescription,
    name: "채무증권",
  },
  depositary_receipts: {
    func: getDepositaryReceipts,
    schema: getDepositaryReceiptsSchema,
    description: getDepositaryReceiptsResponseDescription,
    name: "증권예탁증권",
  },
  merger: {
    func: getMerger,
    schema: getMergerSchema,
    description: getMergerResponseDescription,
    name: "합병",
  },
  comprehensive_stock_exchange_transfer: {
    func: getComprehensiveStockExchangeTransfer,
    schema: getComprehensiveStockExchangeTransferSchema,
    description: getComprehensiveStockExchangeTransferResponseDescription,
    name: "주식의포괄적교환·이전",
  },
  division: {
    func: getDivision,
    schema: getDivisionSchema,
    description: getDivisionResponseDescription,
    name: "분할",
  },
};
