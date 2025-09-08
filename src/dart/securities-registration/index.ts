/**
 * 증권신고서 주요정보
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS006
 */

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
