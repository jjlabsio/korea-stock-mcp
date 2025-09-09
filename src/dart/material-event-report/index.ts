/**
 * 주요사항보고서 주요정보
 * OpenDART API DS003 그룹
 */

import z from "zod";

// 재무위기 관련 이벤트
export * from "./financial-distress.js";

// 자본구조 변경 이벤트
export * from "./capital-structure.js";

// 자기주식 관련 이벤트
export * from "./treasury-stock.js";

// 기업구조조정 관련 이벤트
export * from "./corporate-restructuring.js";

// 자산거래 관련 이벤트
export * from "./asset-transactions.js";

// 증권발행 관련 이벤트
export * from "./securities-issuance.js";

// 해외상장 관련 이벤트
export * from "./overseas-listings.js";

// 법적 절차 관련 이벤트
export * from "./legal-proceedings.js";

// 주권관련사채권 거래 이벤트
export * from "./stock-related-bonds.js";

// Import all functions for the unified tool
import {
  getBankruptcyOccurrence,
  getBankruptcyOccurrenceSchema,
  getBankruptcyOccurrenceResponseDescription,
  getBusinessSuspension,
  getBusinessSuspensionSchema,
  getBusinessSuspensionResponseDescription,
  getRehabilitationApplication,
  getRehabilitationApplicationSchema,
  getRehabilitationApplicationResponseDescription,
  getDissolutionReason,
  getDissolutionReasonSchema,
  getDissolutionReasonResponseDescription,
  getCreditorBankManagementStart,
  getCreditorBankManagementStartSchema,
  getCreditorBankManagementStartResponseDescription,
  getCreditorBankManagementEnd,
  getCreditorBankManagementEndSchema,
  getCreditorBankManagementEndResponseDescription,
} from "./financial-distress.js";

import {
  getPaidIncreaseDecision,
  getPaidIncreaseDecisionSchema,
  getPaidIncreaseDecisionResponseDescription,
  getFreeIncreaseDecision,
  getFreeIncreaseDecisionSchema,
  getFreeIncreaseDecisionResponseDescription,
  getPaidFreeIncreaseDecision,
  getPaidFreeIncreaseDecisionSchema,
  getPaidFreeIncreaseDecisionResponseDescription,
  getCapitalReductionDecision,
  getCapitalReductionDecisionSchema,
  getCapitalReductionDecisionResponseDescription,
} from "./capital-structure.js";

import {
  getTreasuryStockAcquisitionDecision,
  getTreasuryStockAcquisitionDecisionSchema,
  getTreasuryStockAcquisitionDecisionResponseDescription,
  getTreasuryStockDisposalDecision,
  getTreasuryStockDisposalDecisionSchema,
  getTreasuryStockDisposalDecisionResponseDescription,
  getTreasuryStockTrustContractDecision,
  getTreasuryStockTrustContractDecisionSchema,
  getTreasuryStockTrustContractDecisionResponseDescription,
  getTreasuryStockTrustTerminationDecision,
  getTreasuryStockTrustTerminationDecisionSchema,
  getTreasuryStockTrustTerminationDecisionResponseDescription,
} from "./treasury-stock.js";

import {
  getCompanyDivisionDecision,
  getCompanyDivisionDecisionSchema,
  getCompanyDivisionDecisionResponseDescription,
  getCompanyDivisionMergerDecision,
  getCompanyDivisionMergerDecisionSchema,
  getCompanyDivisionMergerDecisionResponseDescription,
  getCompanyMergerDecision,
  getCompanyMergerDecisionSchema,
  getCompanyMergerDecisionResponseDescription,
  getStockExchangeTransferDecision,
  getStockExchangeTransferDecisionSchema,
  getStockExchangeTransferDecisionResponseDescription,
} from "./corporate-restructuring.js";

import {
  getTangibleAssetAcquisitionDecision,
  getTangibleAssetAcquisitionDecisionSchema,
  getTangibleAssetAcquisitionDecisionResponseDescription,
  getTangibleAssetTransferDecision,
  getTangibleAssetTransferDecisionSchema,
  getTangibleAssetTransferDecisionResponseDescription,
  getAssetTransferEtcPutBackOption,
  getAssetTransferEtcPutBackOptionSchema,
  getAssetTransferEtcPutBackOptionResponseDescription,
  getBusinessAcquisitionDecision,
  getBusinessAcquisitionDecisionSchema,
  getBusinessAcquisitionDecisionResponseDescription,
  getOtherCorpStockAcquisitionDecision,
  getOtherCorpStockAcquisitionDecisionSchema,
  getOtherCorpStockAcquisitionDecisionResponseDescription,
  getOtherCorpStockTransferDecision,
  getOtherCorpStockTransferDecisionSchema,
  getOtherCorpStockTransferDecisionResponseDescription,
  getBusinessTransferDecision,
  getBusinessTransferDecisionSchema,
  getBusinessTransferDecisionResponseDescription,
} from "./asset-transactions.js";

import {
  getConvertibleBondIssuanceDecision,
  getConvertibleBondIssuanceDecisionSchema,
  getConvertibleBondIssuanceDecisionResponseDescription,
  getBondWithWarrantIssuanceDecision,
  getBondWithWarrantIssuanceDecisionSchema,
  getBondWithWarrantIssuanceDecisionResponseDescription,
  getExchangeBondIssuanceDecision,
  getExchangeBondIssuanceDecisionSchema,
  getExchangeBondIssuanceDecisionResponseDescription,
  getAmortizingConditionalCapitalSecuritiesIssuanceDecision,
  getAmortizingConditionalCapitalSecuritiesIssuanceDecisionSchema,
  getAmortizingConditionalCapitalSecuritiesIssuanceDecisionResponseDescription,
} from "./securities-issuance.js";

import {
  getOverseasListingDecision,
  getOverseasListingDecisionSchema,
  getOverseasListingDecisionResponseDescription,
  getOverseasDelistingDecision,
  getOverseasDelistingDecisionSchema,
  getOverseasDelistingDecisionResponseDescription,
  getOverseasListing,
  getOverseasListingSchema,
  getOverseasListingResponseDescription,
  getOverseasDelisting,
  getOverseasDelistingSchema,
  getOverseasDelistingResponseDescription,
} from "./overseas-listings.js";

import {
  getLegalProceedingsFiling,
  getLegalProceedingsFilingSchema,
  getLegalProceedingsFilingResponseDescription,
} from "./legal-proceedings.js";

import {
  getStockRelatedBondAcquisitionDecision,
  getStockRelatedBondAcquisitionDecisionSchema,
  getStockRelatedBondAcquisitionDecisionResponseDescription,
  getStockRelatedBondTransferDecision,
  getStockRelatedBondTransferDecisionSchema,
  getStockRelatedBondTransferDecisionResponseDescription,
} from "./stock-related-bonds.js";

// 통합 스키마
export const materialEventReportInfoSchema = z.object({
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
      // 재무위기 관련 이벤트
      "bankruptcy_occurrence",
      "business_suspension",
      "rehabilitation_application",
      "dissolution_reason",
      "creditor_bank_management_start",
      "creditor_bank_management_end",
      // 자본구조 변경 이벤트
      "paid_increase_decision",
      "free_increase_decision",
      "paid_free_increase_decision",
      "capital_reduction_decision",
      // 자기주식 관련 이벤트
      "treasury_stock_acquisition_decision",
      "treasury_stock_disposal_decision",
      "treasury_stock_trust_contract_decision",
      "treasury_stock_trust_termination_decision",
      // 기업구조조정 관련 이벤트
      "company_division_decision",
      "company_division_merger_decision",
      "company_merger_decision",
      "stock_exchange_transfer_decision",
      "business_transfer_decision",
      // 자산거래 관련 이벤트
      "tangible_asset_acquisition_decision",
      "tangible_asset_transfer_decision",
      "asset_transfer_etc_put_back_option",
      "business_acquisition_decision",
      "other_corp_stock_acquisition_decision",
      "other_corp_stock_transfer_decision",
      // 증권발행 관련 이벤트
      "convertible_bond_issuance_decision",
      "bond_with_warrant_issuance_decision",
      "exchange_bond_issuance_decision",
      "amortizing_conditional_capital_securities_issuance_decision",
      // 해외상장 관련 이벤트
      "overseas_listing_decision",
      "overseas_delisting_decision",
      "overseas_listing",
      "overseas_delisting",
      // 법적 절차 관련 이벤트
      "legal_proceedings_filing",
      // 주권관련사채권 거래 이벤트
      "stock_related_bond_acquisition_decision",
      "stock_related_bond_transfer_decision",
    ])
    .describe(
      "주요사항보고서 정보 유형 - 요청할 주요사항보고서 주요정보의 종류"
    ),
});
export type MaterialEventReportInfoParams = z.infer<
  typeof materialEventReportInfoSchema
>;

// 함수 매핑
export const materialEventReportFunctionMap = {
  // 재무위기 관련 이벤트
  bankruptcy_occurrence: {
    func: getBankruptcyOccurrence,
    schema: getBankruptcyOccurrenceSchema,
    description: getBankruptcyOccurrenceResponseDescription,
    name: "부도발생",
  },
  business_suspension: {
    func: getBusinessSuspension,
    schema: getBusinessSuspensionSchema,
    description: getBusinessSuspensionResponseDescription,
    name: "영업정지",
  },
  rehabilitation_application: {
    func: getRehabilitationApplication,
    schema: getRehabilitationApplicationSchema,
    description: getRehabilitationApplicationResponseDescription,
    name: "회생절차 개시신청",
  },
  dissolution_reason: {
    func: getDissolutionReason,
    schema: getDissolutionReasonSchema,
    description: getDissolutionReasonResponseDescription,
    name: "해산사유 발생",
  },
  creditor_bank_management_start: {
    func: getCreditorBankManagementStart,
    schema: getCreditorBankManagementStartSchema,
    description: getCreditorBankManagementStartResponseDescription,
    name: "채권은행 등의 관리절차 개시",
  },
  creditor_bank_management_end: {
    func: getCreditorBankManagementEnd,
    schema: getCreditorBankManagementEndSchema,
    description: getCreditorBankManagementEndResponseDescription,
    name: "채권은행 등의 관리절차 중단",
  },
  // 자본구조 변경 이벤트
  paid_increase_decision: {
    func: getPaidIncreaseDecision,
    schema: getPaidIncreaseDecisionSchema,
    description: getPaidIncreaseDecisionResponseDescription,
    name: "유상증자 결정",
  },
  free_increase_decision: {
    func: getFreeIncreaseDecision,
    schema: getFreeIncreaseDecisionSchema,
    description: getFreeIncreaseDecisionResponseDescription,
    name: "무상증자 결정",
  },
  paid_free_increase_decision: {
    func: getPaidFreeIncreaseDecision,
    schema: getPaidFreeIncreaseDecisionSchema,
    description: getPaidFreeIncreaseDecisionResponseDescription,
    name: "유무상증자 결정",
  },
  capital_reduction_decision: {
    func: getCapitalReductionDecision,
    schema: getCapitalReductionDecisionSchema,
    description: getCapitalReductionDecisionResponseDescription,
    name: "감자 결정",
  },
  // 자기주식 관련 이벤트
  treasury_stock_acquisition_decision: {
    func: getTreasuryStockAcquisitionDecision,
    schema: getTreasuryStockAcquisitionDecisionSchema,
    description: getTreasuryStockAcquisitionDecisionResponseDescription,
    name: "자기주식 취득 결정",
  },
  treasury_stock_disposal_decision: {
    func: getTreasuryStockDisposalDecision,
    schema: getTreasuryStockDisposalDecisionSchema,
    description: getTreasuryStockDisposalDecisionResponseDescription,
    name: "자기주식 처분 결정",
  },
  treasury_stock_trust_contract_decision: {
    func: getTreasuryStockTrustContractDecision,
    schema: getTreasuryStockTrustContractDecisionSchema,
    description: getTreasuryStockTrustContractDecisionResponseDescription,
    name: "자기주식취득 신탁계약 체결 결정",
  },
  treasury_stock_trust_termination_decision: {
    func: getTreasuryStockTrustTerminationDecision,
    schema: getTreasuryStockTrustTerminationDecisionSchema,
    description: getTreasuryStockTrustTerminationDecisionResponseDescription,
    name: "자기주식취득 신탁계약 해지 결정",
  },
  // 기업구조조정 관련 이벤트
  company_division_decision: {
    func: getCompanyDivisionDecision,
    schema: getCompanyDivisionDecisionSchema,
    description: getCompanyDivisionDecisionResponseDescription,
    name: "회사분할 결정",
  },
  company_division_merger_decision: {
    func: getCompanyDivisionMergerDecision,
    schema: getCompanyDivisionMergerDecisionSchema,
    description: getCompanyDivisionMergerDecisionResponseDescription,
    name: "회사분할합병 결정",
  },
  company_merger_decision: {
    func: getCompanyMergerDecision,
    schema: getCompanyMergerDecisionSchema,
    description: getCompanyMergerDecisionResponseDescription,
    name: "회사합병 결정",
  },
  stock_exchange_transfer_decision: {
    func: getStockExchangeTransferDecision,
    schema: getStockExchangeTransferDecisionSchema,
    description: getStockExchangeTransferDecisionResponseDescription,
    name: "주식교환·이전 결정",
  },
  business_transfer_decision: {
    func: getBusinessTransferDecision,
    schema: getBusinessTransferDecisionSchema,
    description: getBusinessTransferDecisionResponseDescription,
    name: "영업양도 결정",
  },
  // 자산거래 관련 이벤트
  tangible_asset_acquisition_decision: {
    func: getTangibleAssetAcquisitionDecision,
    schema: getTangibleAssetAcquisitionDecisionSchema,
    description: getTangibleAssetAcquisitionDecisionResponseDescription,
    name: "유형자산 양수 결정",
  },
  tangible_asset_transfer_decision: {
    func: getTangibleAssetTransferDecision,
    schema: getTangibleAssetTransferDecisionSchema,
    description: getTangibleAssetTransferDecisionResponseDescription,
    name: "유형자산 양도 결정",
  },
  asset_transfer_etc_put_back_option: {
    func: getAssetTransferEtcPutBackOption,
    schema: getAssetTransferEtcPutBackOptionSchema,
    description: getAssetTransferEtcPutBackOptionResponseDescription,
    name: "자산양수도(기타), 풋백옵션 결정",
  },
  business_acquisition_decision: {
    func: getBusinessAcquisitionDecision,
    schema: getBusinessAcquisitionDecisionSchema,
    description: getBusinessAcquisitionDecisionResponseDescription,
    name: "영업양수 결정",
  },
  other_corp_stock_acquisition_decision: {
    func: getOtherCorpStockAcquisitionDecision,
    schema: getOtherCorpStockAcquisitionDecisionSchema,
    description: getOtherCorpStockAcquisitionDecisionResponseDescription,
    name: "타법인 주식 및 출자증권 양수결정",
  },
  other_corp_stock_transfer_decision: {
    func: getOtherCorpStockTransferDecision,
    schema: getOtherCorpStockTransferDecisionSchema,
    description: getOtherCorpStockTransferDecisionResponseDescription,
    name: "타법인 주식 및 출자증권 양도결정",
  },
  // 증권발행 관련 이벤트
  convertible_bond_issuance_decision: {
    func: getConvertibleBondIssuanceDecision,
    schema: getConvertibleBondIssuanceDecisionSchema,
    description: getConvertibleBondIssuanceDecisionResponseDescription,
    name: "전환사채권 발행결정",
  },
  bond_with_warrant_issuance_decision: {
    func: getBondWithWarrantIssuanceDecision,
    schema: getBondWithWarrantIssuanceDecisionSchema,
    description: getBondWithWarrantIssuanceDecisionResponseDescription,
    name: "신주인수권부사채권 발행결정",
  },
  exchange_bond_issuance_decision: {
    func: getExchangeBondIssuanceDecision,
    schema: getExchangeBondIssuanceDecisionSchema,
    description: getExchangeBondIssuanceDecisionResponseDescription,
    name: "교환사채권 발행결정",
  },
  amortizing_conditional_capital_securities_issuance_decision: {
    func: getAmortizingConditionalCapitalSecuritiesIssuanceDecision,
    schema: getAmortizingConditionalCapitalSecuritiesIssuanceDecisionSchema,
    description:
      getAmortizingConditionalCapitalSecuritiesIssuanceDecisionResponseDescription,
    name: "상각형 조건부자본증권 발행결정",
  },
  // 해외상장 관련 이벤트
  overseas_listing_decision: {
    func: getOverseasListingDecision,
    schema: getOverseasListingDecisionSchema,
    description: getOverseasListingDecisionResponseDescription,
    name: "해외 증권시장 주권등 상장 결정",
  },
  overseas_delisting_decision: {
    func: getOverseasDelistingDecision,
    schema: getOverseasDelistingDecisionSchema,
    description: getOverseasDelistingDecisionResponseDescription,
    name: "해외 증권시장 주권등 상장폐지 결정",
  },
  overseas_listing: {
    func: getOverseasListing,
    schema: getOverseasListingSchema,
    description: getOverseasListingResponseDescription,
    name: "해외 증권시장 주권등 상장",
  },
  overseas_delisting: {
    func: getOverseasDelisting,
    schema: getOverseasDelistingSchema,
    description: getOverseasDelistingResponseDescription,
    name: "해외 증권시장 주권등 상장폐지",
  },
  // 법적 절차 관련 이벤트
  legal_proceedings_filing: {
    func: getLegalProceedingsFiling,
    schema: getLegalProceedingsFilingSchema,
    description: getLegalProceedingsFilingResponseDescription,
    name: "소송 등의 제기",
  },
  // 주권관련사채권 거래 이벤트
  stock_related_bond_acquisition_decision: {
    func: getStockRelatedBondAcquisitionDecision,
    schema: getStockRelatedBondAcquisitionDecisionSchema,
    description: getStockRelatedBondAcquisitionDecisionResponseDescription,
    name: "주권 관련 사채권 양수 결정",
  },
  stock_related_bond_transfer_decision: {
    func: getStockRelatedBondTransferDecision,
    schema: getStockRelatedBondTransferDecisionSchema,
    description: getStockRelatedBondTransferDecisionResponseDescription,
    name: "주권 관련 사채권 양도 결정",
  },
};
