/**
 * 정기보고서 주요정보
 * OpenDART API DS002 그룹
 */

import z from "zod";
import {
  getAuditorOpinion,
  getAuditorOpinionSchema,
  getAuditorOpinionResponseDescription,
  getAuditServiceContract,
  getAuditServiceContractSchema,
  getAuditServiceContractResponseDescription,
  getNonAuditServiceContract,
  getNonAuditServiceContractSchema,
  getNonAuditServiceContractResponseDescription,
} from "./audit-accounting.js";
import {
  getBondIssuanceStatus,
  getBondIssuanceStatusSchema,
  getBondIssuanceStatusResponseDescription,
  getCommercialPaperBalance,
  getCommercialPaperBalanceSchema,
  getCommercialPaperBalanceResponseDescription,
  getShortTermBondBalance,
  getShortTermBondBalanceSchema,
  getShortTermBondBalanceResponseDescription,
  getCorporateBondBalance,
  getCorporateBondBalanceSchema,
  getCorporateBondBalanceResponseDescription,
  getHybridBondBalance,
  getHybridBondBalanceSchema,
  getHybridBondBalanceResponseDescription,
  getConditionalBondBalance,
  getConditionalBondBalanceSchema,
  getConditionalBondBalanceResponseDescription,
} from "./bonds-securities.js";
import {
  getDividendInfo,
  getDividendInfoSchema,
  getDividendInfoResponseDescription,
  getMajorShareholderStatus,
  getMajorShareholderStatusSchema,
  getMajorShareholderStatusResponseDescription,
  getMajorShareholderChange,
  getMajorShareholderChangeSchema,
  getMajorShareholderChangeResponseDescription,
  getMinorShareholderStatus,
  getMinorShareholderStatusSchema,
  getMinorShareholderStatusResponseDescription,
} from "./dividend-shareholder.js";
import {
  getExecutiveStatus,
  getExecutiveStatusSchema,
  getExecutiveStatusResponseDescription,
  getEmployeeStatus,
  getEmployeeStatusSchema,
  getEmployeeStatusResponseDescription,
  getDirectorAuditorRemuneration,
  getDirectorAuditorRemunerationSchema,
  getDirectorAuditorRemunerationResponseDescription,
  getAllDirectorAuditorRemuneration,
  getAllDirectorAuditorRemunerationSchema,
  getAllDirectorAuditorRemunerationResponseDescription,
  getTopRemuneration,
  getTopRemunerationSchema,
  getTopRemunerationResponseDescription,
  getOutsideDirectorChangeStatus,
  getOutsideDirectorChangeStatusSchema,
  getOutsideDirectorChangeStatusResponseDescription,
  getUnregisteredExecutiveCompensation,
  getUnregisteredExecutiveCompensationSchema,
  getUnregisteredExecutiveCompensationResponseDescription,
  getDirectorAuditorTotalCompensationApproved,
  getDirectorAuditorTotalCompensationApprovedSchema,
  getDirectorAuditorTotalCompensationApprovedResponseDescription,
  getDirectorAuditorTotalCompensationByType,
  getDirectorAuditorTotalCompensationByTypeSchema,
  getDirectorAuditorTotalCompensationByTypeResponseDescription,
} from "./employee-executive.js";
import {
  getOtherCorporationInvestment,
  getOtherCorporationInvestmentSchema,
  getOtherCorporationInvestmentResponseDescription,
  getPublicOfferingFunds,
  getPublicOfferingFundsSchema,
  getPublicOfferingFundsResponseDescription,
  getPrivateOfferingFunds,
  getPrivateOfferingFundsSchema,
  getPrivateOfferingFundsResponseDescription,
} from "./investment-funds.js";
import {
  getStockIncreaseDecreaseStatus,
  getStockIncreaseDecreaseStatusSchema,
  getStockIncreaseDecreaseStatusResponseDescription,
  getTreasuryStockStatus,
  getTreasuryStockStatusSchema,
  getTreasuryStockStatusResponseDescription,
  getStockTotalStatus,
  getStockTotalStatusSchema,
  getStockTotalStatusResponseDescription,
} from "./stock-info.js";

// 통합 스키마
export const periodicReportInfoSchema = z.object({
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
      "stock_increase_decrease_status",
      "dividend_info",
      "major_shareholder_status",
      "executive_status",
      "employee_status",
      "bond_issuance_status",
      "auditor_opinion",
      "other_corporation_investment",
      "treasury_stock_status",
      "stock_total_status",
      "major_shareholder_change",
      "minor_shareholder_status",
      "director_auditor_remuneration",
      "all_director_auditor_remuneration",
      "top_remuneration",
      "commercial_paper_balance",
      "short_term_bond_balance",
      "corporate_bond_balance",
      "hybrid_bond_balance",
      "conditional_bond_balance",
      "audit_service_contract",
      "non_audit_service_contract",
      "public_offering_funds",
      "private_offering_funds",
      "outside_director_change_status",
      "unregistered_executive_compensation",
      "director_auditor_total_compensation_approved",
      "director_auditor_total_compensation_by_type",
    ])
    .describe("정기보고서 정보 유형 - 요청할 정기보고서 주요정보의 종류"),
});
export type PeriodicReportInfoParams = z.infer<typeof periodicReportInfoSchema>;

// 함수 매핑
export const periodicReportFunctionMap = {
  stock_increase_decrease_status: {
    func: getStockIncreaseDecreaseStatus,
    schema: getStockIncreaseDecreaseStatusSchema,
    description: getStockIncreaseDecreaseStatusResponseDescription,
    name: "증자(감자) 현황",
  },
  dividend_info: {
    func: getDividendInfo,
    schema: getDividendInfoSchema,
    description: getDividendInfoResponseDescription,
    name: "배당에 관한 사항",
  },
  major_shareholder_status: {
    func: getMajorShareholderStatus,
    schema: getMajorShareholderStatusSchema,
    description: getMajorShareholderStatusResponseDescription,
    name: "최대주주 현황",
  },
  executive_status: {
    func: getExecutiveStatus,
    schema: getExecutiveStatusSchema,
    description: getExecutiveStatusResponseDescription,
    name: "임원 현황",
  },
  employee_status: {
    func: getEmployeeStatus,
    schema: getEmployeeStatusSchema,
    description: getEmployeeStatusResponseDescription,
    name: "직원 현황",
  },
  bond_issuance_status: {
    func: getBondIssuanceStatus,
    schema: getBondIssuanceStatusSchema,
    description: getBondIssuanceStatusResponseDescription,
    name: "채무증권 발행실적",
  },
  auditor_opinion: {
    func: getAuditorOpinion,
    schema: getAuditorOpinionSchema,
    description: getAuditorOpinionResponseDescription,
    name: "회계감사인의 명칭 및 감사의견",
  },
  other_corporation_investment: {
    func: getOtherCorporationInvestment,
    schema: getOtherCorporationInvestmentSchema,
    description: getOtherCorporationInvestmentResponseDescription,
    name: "타법인 출자현황",
  },
  treasury_stock_status: {
    func: getTreasuryStockStatus,
    schema: getTreasuryStockStatusSchema,
    description: getTreasuryStockStatusResponseDescription,
    name: "자기주식 취득 및 처분 현황",
  },
  stock_total_status: {
    func: getStockTotalStatus,
    schema: getStockTotalStatusSchema,
    description: getStockTotalStatusResponseDescription,
    name: "주식의 총수 현황",
  },
  major_shareholder_change: {
    func: getMajorShareholderChange,
    schema: getMajorShareholderChangeSchema,
    description: getMajorShareholderChangeResponseDescription,
    name: "최대주주 변동현황",
  },
  minor_shareholder_status: {
    func: getMinorShareholderStatus,
    schema: getMinorShareholderStatusSchema,
    description: getMinorShareholderStatusResponseDescription,
    name: "소액주주현황",
  },
  director_auditor_remuneration: {
    func: getDirectorAuditorRemuneration,
    schema: getDirectorAuditorRemunerationSchema,
    description: getDirectorAuditorRemunerationResponseDescription,
    name: "이사·감사의 개인별 보수현황(5억원 이상)",
  },
  all_director_auditor_remuneration: {
    func: getAllDirectorAuditorRemuneration,
    schema: getAllDirectorAuditorRemunerationSchema,
    description: getAllDirectorAuditorRemunerationResponseDescription,
    name: "이사·감사 전체의 보수현황(보수지급금액 - 이사·감사 전체)",
  },
  top_remuneration: {
    func: getTopRemuneration,
    schema: getTopRemunerationSchema,
    description: getTopRemunerationResponseDescription,
    name: "개인별 보수지급 금액(5억이상 상위5인)",
  },
  commercial_paper_balance: {
    func: getCommercialPaperBalance,
    schema: getCommercialPaperBalanceSchema,
    description: getCommercialPaperBalanceResponseDescription,
    name: "기업어음증권 미상환 잔액",
  },
  short_term_bond_balance: {
    func: getShortTermBondBalance,
    schema: getShortTermBondBalanceSchema,
    description: getShortTermBondBalanceResponseDescription,
    name: "단기사채 미상환 잔액",
  },
  corporate_bond_balance: {
    func: getCorporateBondBalance,
    schema: getCorporateBondBalanceSchema,
    description: getCorporateBondBalanceResponseDescription,
    name: "회사채 미상환 잔액",
  },
  hybrid_bond_balance: {
    func: getHybridBondBalance,
    schema: getHybridBondBalanceSchema,
    description: getHybridBondBalanceResponseDescription,
    name: "신종자본증권 미상환 잔액",
  },
  conditional_bond_balance: {
    func: getConditionalBondBalance,
    schema: getConditionalBondBalanceSchema,
    description: getConditionalBondBalanceResponseDescription,
    name: "조건부자본증권 미상환 잔액",
  },
  audit_service_contract: {
    func: getAuditServiceContract,
    schema: getAuditServiceContractSchema,
    description: getAuditServiceContractResponseDescription,
    name: "감사용역체결현황",
  },
  non_audit_service_contract: {
    func: getNonAuditServiceContract,
    schema: getNonAuditServiceContractSchema,
    description: getNonAuditServiceContractResponseDescription,
    name: "비감사용역 체결현황",
  },
  public_offering_funds: {
    func: getPublicOfferingFunds,
    schema: getPublicOfferingFundsSchema,
    description: getPublicOfferingFundsResponseDescription,
    name: "공모자금 사용실적",
  },
  private_offering_funds: {
    func: getPrivateOfferingFunds,
    schema: getPrivateOfferingFundsSchema,
    description: getPrivateOfferingFundsResponseDescription,
    name: "사모자금 사용실적",
  },
  outside_director_change_status: {
    func: getOutsideDirectorChangeStatus,
    schema: getOutsideDirectorChangeStatusSchema,
    description: getOutsideDirectorChangeStatusResponseDescription,
    name: "사외이사 및 그 변동현황",
  },
  unregistered_executive_compensation: {
    func: getUnregisteredExecutiveCompensation,
    schema: getUnregisteredExecutiveCompensationSchema,
    description: getUnregisteredExecutiveCompensationResponseDescription,
    name: "미등기임원 보수현황",
  },
  director_auditor_total_compensation_approved: {
    func: getDirectorAuditorTotalCompensationApproved,
    schema: getDirectorAuditorTotalCompensationApprovedSchema,
    description: getDirectorAuditorTotalCompensationApprovedResponseDescription,
    name: "이사·감사 전체의 보수현황(주주총회 승인금액)",
  },
  director_auditor_total_compensation_by_type: {
    func: getDirectorAuditorTotalCompensationByType,
    schema: getDirectorAuditorTotalCompensationByTypeSchema,
    description: getDirectorAuditorTotalCompensationByTypeResponseDescription,
    name: "이사·감사 전체의 보수현황(보수지급금액 - 유형별)",
  },
};
