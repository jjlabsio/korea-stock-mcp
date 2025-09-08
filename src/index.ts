import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as disclosureInfo from "./dart/disclosure-info/index.js";
import * as periodicReportFinancials from "./dart/periodic-report-financials/index.js";
import * as ownershipDisclosure from "./dart/ownership-disclosure/index.js";
import * as materialEventReport from "./dart/material-event-report/index.js";
import * as securitiesRegistration from "./dart/securities-registration/index.js";
import {
  periodicReportFunctionMap,
  periodicReportInfoSchema,
} from "./dart/periodic-reports/index.js";

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
  "get_periodic_report_info",
  `정기보고서 주요정보: 정기보고서 내의 다양한 주요 정보를 통합적으로 제공합니다.

사용 가능한 정기보고서 정보 유형:
1. stock_increase_decrease_status: 증자(감자) 현황
2. dividend_info: 배당에 관한 사항  
3. treasury_stock_status: 자기주식 취득 및 처분 현황
4. major_shareholder_status: 최대주주 현황
5. major_shareholder_change: 최대주주 변동현황
6. minor_shareholder_status: 소액주주현황
7. executive_status: 임원 현황
8. employee_status: 직원 현황
9. director_auditor_remuneration: 이사·감사의 개인별 보수현황(5억원 이상)
10. all_director_auditor_remuneration: 이사·감사 전체의 보수현황(보수지급금액 - 이사·감사 전체)
11. top_remuneration: 개인별 보수지급 금액(5억이상 상위5인)
12. other_corporation_investment: 타법인 출자현황
13. stock_total_status: 주식의 총수 현황
14. bond_issuance_status: 채무증권 발행실적
15. commercial_paper_balance: 기업어음증권 미상환 잔액
16. short_term_bond_balance: 단기사채 미상환 잔액
17. corporate_bond_balance: 회사채 미상환 잔액
18. hybrid_bond_balance: 신종자본증권 미상환 잔액
19. conditional_bond_balance: 조건부자본증권 미상환 잔액
20. auditor_opinion: 회계감사인의 명칭 및 감사의견
21. audit_service_contract: 감사용역체결현황
22. non_audit_service_contract: 회계감사인과의 비감사용역 계약체결 현황
23. outside_director_change_status: 사외이사 및 그 변동현황
24. unregistered_executive_compensation: 미등기임원 보수현황
25. director_auditor_total_compensation_approved: 이사·감사 전체의 보수현황(주주총회 승인금액)
26. director_auditor_total_compensation_by_type: 이사·감사 전체의 보수현황(보수지급금액 - 유형별)
27. public_offering_funds: 공모자금 사용실적
28. private_offering_funds: 사모자금 사용실적

Response Format은 선택한 report_type에 따라 결정됩니다.`,
  periodicReportInfoSchema.shape,
  async (params) => {
    const args = periodicReportInfoSchema.parse(params);
    const { report_type, ...reportParams } = args;

    const reportConfig = periodicReportFunctionMap[report_type];
    if (!reportConfig) {
      throw new Error(`Unsupported report type: ${report_type}`);
    }

    // 각 함수의 스키마로 파라미터 검증
    const validatedParams = reportConfig.schema.parse(reportParams);

    // 해당 함수 호출
    const response = await reportConfig.func(validatedParams);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              report_type,
              report_name: reportConfig.name,
              data: response,
              description: reportConfig.description,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

/**
 * 정기보고서 재무정보
 */

server.tool(
  "get_single_company_key_accounts",
  `단일회사 주요계정: 상장법인 및 주요 비상장법인이 제출한 정기보고서 내 XBRL재무제표의 주요계정과목을 제공합니다.

Response Format: ${periodicReportFinancials.getSingleCompanyKeyAccountsResponseDescription}`,
  periodicReportFinancials.getSingleCompanyKeyAccountsSchema.shape,
  async (params) => {
    const args =
      periodicReportFinancials.getSingleCompanyKeyAccountsSchema.parse(params);
    const response = await periodicReportFinancials.getSingleCompanyKeyAccounts(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_single_company_full_financial_statements",
  `단일회사 전체 재무제표: 상장법인 및 주요 비상장법인의 XBRL재무제표 모든 계정과목을 제공합니다.

Response Format: ${periodicReportFinancials.getSingleCompanyFullFinancialStatementsResponseDescription}`,
  periodicReportFinancials.getSingleCompanyFullFinancialStatementsSchema.shape,
  async (params) => {
    const args =
      periodicReportFinancials.getSingleCompanyFullFinancialStatementsSchema.parse(
        params
      );
    const response =
      await periodicReportFinancials.getSingleCompanyFullFinancialStatements(
        args
      );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_xbrl_taxonomy",
  `XBRL택사노미재무제표양식: IFRS 기반 XBRL 재무제표 공시용 표준계정과목체계를 제공합니다.

Response Format: ${periodicReportFinancials.getXBRLTaxonomyResponseDescription}`,
  periodicReportFinancials.getXBRLTaxonomySchema.shape,
  async (params) => {
    const args = periodicReportFinancials.getXBRLTaxonomySchema.parse(params);
    const response = await periodicReportFinancials.getXBRLTaxonomy(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

/**
 * 지분공시 종합정보
 */

server.tool(
  "get_major_shareholding",
  `대량보유 상황보고: 주식등의 대량보유상황보고서 내에 대량보유 상황보고 정보를 제공합니다.

Response Format: ${ownershipDisclosure.getMajorShareholdingResponseDescription}`,
  ownershipDisclosure.getMajorShareholdingSchema.shape,
  async (params) => {
    const args = ownershipDisclosure.getMajorShareholdingSchema.parse(params);
    const response = await ownershipDisclosure.getMajorShareholding(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_executive_ownership",
  `임원ㆍ주요주주 소유보고: 임원ㆍ주요주주특정증권등 소유상황보고서 내에 임원ㆍ주요주주 소유보고 정보를 제공합니다.

Response Format: ${ownershipDisclosure.getExecutiveOwnershipResponseDescription}`,
  ownershipDisclosure.getExecutiveOwnershipSchema.shape,
  async (params) => {
    const args = ownershipDisclosure.getExecutiveOwnershipSchema.parse(params);
    const response = await ownershipDisclosure.getExecutiveOwnership(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

/**
 * 주요사항보고서 주요정보
 */

// 재무위기 관련 이벤트
server.tool(
  "get_bankruptcy_occurrence",
  `부도발생: 주요사항보고서(부도발생) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getBankruptcyOccurrenceResponseDescription}`,
  materialEventReport.getBankruptcyOccurrenceSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getBankruptcyOccurrenceSchema.parse(params);
    const response = await materialEventReport.getBankruptcyOccurrence(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_business_suspension",
  `영업정지: 주요사항보고서(영업정지) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getBusinessSuspensionResponseDescription}`,
  materialEventReport.getBusinessSuspensionSchema.shape,
  async (params) => {
    const args = materialEventReport.getBusinessSuspensionSchema.parse(params);
    const response = await materialEventReport.getBusinessSuspension(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_rehabilitation_application",
  `회생절차 개시신청: 주요사항보고서(회생절차 개시신청) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getRehabilitationApplicationResponseDescription}`,
  materialEventReport.getRehabilitationApplicationSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getRehabilitationApplicationSchema.parse(params);
    const response = await materialEventReport.getRehabilitationApplication(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_dissolution_reason",
  `해산사유 발생: 주요사항보고서(해산사유 발생) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getDissolutionReasonResponseDescription}`,
  materialEventReport.getDissolutionReasonSchema.shape,
  async (params) => {
    const args = materialEventReport.getDissolutionReasonSchema.parse(params);
    const response = await materialEventReport.getDissolutionReason(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_creditor_bank_management_start",
  `채권은행 등의 관리절차 개시: 주요사항보고서(채권은행 등의 관리절차 개시) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getCreditorBankManagementStartResponseDescription}`,
  materialEventReport.getCreditorBankManagementStartSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getCreditorBankManagementStartSchema.parse(params);
    const response = await materialEventReport.getCreditorBankManagementStart(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_creditor_bank_management_end",
  `채권은행 등의 관리절차 중단: 주요사항보고서(채권은행 등의 관리절차 중단) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getCreditorBankManagementEndResponseDescription}`,
  materialEventReport.getCreditorBankManagementEndSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getCreditorBankManagementEndSchema.parse(params);
    const response = await materialEventReport.getCreditorBankManagementEnd(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

// 자본구조 변경 이벤트
server.tool(
  "get_paid_increase_decision",
  `유상증자 결정: 주요사항보고서(유상증자 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getPaidIncreaseDecisionResponseDescription}`,
  materialEventReport.getPaidIncreaseDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getPaidIncreaseDecisionSchema.parse(params);
    const response = await materialEventReport.getPaidIncreaseDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_free_increase_decision",
  `무상증자 결정: 주요사항보고서(무상증자 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getFreeIncreaseDecisionResponseDescription}`,
  materialEventReport.getFreeIncreaseDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getFreeIncreaseDecisionSchema.parse(params);
    const response = await materialEventReport.getFreeIncreaseDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_paid_free_increase_decision",
  `유무상증자 결정: 주요사항보고서(유무상증자 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getPaidFreeIncreaseDecisionResponseDescription}`,
  materialEventReport.getPaidFreeIncreaseDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getPaidFreeIncreaseDecisionSchema.parse(params);
    const response = await materialEventReport.getPaidFreeIncreaseDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_capital_reduction_decision",
  `자본금 감소 결정: 주요사항보고서(자본금 감소 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getCapitalReductionDecisionResponseDescription}`,
  materialEventReport.getCapitalReductionDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getCapitalReductionDecisionSchema.parse(params);
    const response = await materialEventReport.getCapitalReductionDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

// 자기주식 관련 이벤트
server.tool(
  "get_treasury_stock_acquisition_decision",
  `자기주식 취득 결정: 주요사항보고서(자기주식 취득 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getTreasuryStockAcquisitionDecisionResponseDescription}`,
  materialEventReport.getTreasuryStockAcquisitionDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getTreasuryStockAcquisitionDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getTreasuryStockAcquisitionDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_treasury_stock_disposal_decision",
  `자기주식 처분 결정: 주요사항보고서(자기주식 처분 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getTreasuryStockDisposalDecisionResponseDescription}`,
  materialEventReport.getTreasuryStockDisposalDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getTreasuryStockDisposalDecisionSchema.parse(params);
    const response = await materialEventReport.getTreasuryStockDisposalDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_treasury_stock_trust_contract_decision",
  `자기주식취득 신탁계약 체결 결정: 주요사항보고서(자기주식취득 신탁계약 체결 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getTreasuryStockTrustContractDecisionResponseDescription}`,
  materialEventReport.getTreasuryStockTrustContractDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getTreasuryStockTrustContractDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getTreasuryStockTrustContractDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_treasury_stock_trust_termination_decision",
  `자기주식취득 신탁계약 해지 결정: 주요사항보고서(자기주식취득 신탁계약 해지 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getTreasuryStockTrustTerminationDecisionResponseDescription}`,
  materialEventReport.getTreasuryStockTrustTerminationDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getTreasuryStockTrustTerminationDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getTreasuryStockTrustTerminationDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

// 기업구조조정 관련 이벤트
server.tool(
  "get_company_division_decision",
  `회사분할 결정: 주요사항보고서(회사분할 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getCompanyDivisionDecisionResponseDescription}`,
  materialEventReport.getCompanyDivisionDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getCompanyDivisionDecisionSchema.parse(params);
    const response = await materialEventReport.getCompanyDivisionDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_company_division_merger_decision",
  `분할합병 결정: 주요사항보고서(분할합병 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getCompanyDivisionMergerDecisionResponseDescription}`,
  materialEventReport.getCompanyDivisionMergerDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getCompanyDivisionMergerDecisionSchema.parse(params);
    const response = await materialEventReport.getCompanyDivisionMergerDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_company_merger_decision",
  `회사합병 결정: 주요사항보고서(회사합병 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getCompanyMergerDecisionResponseDescription}`,
  materialEventReport.getCompanyMergerDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getCompanyMergerDecisionSchema.parse(params);
    const response = await materialEventReport.getCompanyMergerDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_stock_exchange_transfer_decision",
  `주식교환·이전 결정: 주요사항보고서(주식교환·이전 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getStockExchangeTransferDecisionResponseDescription}`,
  materialEventReport.getStockExchangeTransferDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getStockExchangeTransferDecisionSchema.parse(params);
    const response = await materialEventReport.getStockExchangeTransferDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_business_transfer_decision",
  `영업양수도 결정: 주요사항보고서(영업양수도 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getBusinessTransferDecisionResponseDescription}`,
  materialEventReport.getBusinessTransferDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getBusinessTransferDecisionSchema.parse(params);
    const response = await materialEventReport.getBusinessTransferDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

// 자산거래 관련 이벤트
server.tool(
  "get_tangible_asset_acquisition_decision",
  `유형자산 양수 결정: 주요사항보고서(유형자산 양수 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getTangibleAssetAcquisitionDecisionResponseDescription}`,
  materialEventReport.getTangibleAssetAcquisitionDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getTangibleAssetAcquisitionDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getTangibleAssetAcquisitionDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_tangible_asset_transfer_decision",
  `유형자산 양도 결정: 주요사항보고서(유형자산 양도 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getTangibleAssetTransferDecisionResponseDescription}`,
  materialEventReport.getTangibleAssetTransferDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getTangibleAssetTransferDecisionSchema.parse(params);
    const response = await materialEventReport.getTangibleAssetTransferDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_asset_transfer_etc_put_back_option",
  `자산양수도(기타), 풋백옵션 결정: 주요사항보고서(자산양수도(기타), 풋백옵션) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getAssetTransferEtcPutBackOptionResponseDescription}`,
  materialEventReport.getAssetTransferEtcPutBackOptionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getAssetTransferEtcPutBackOptionSchema.parse(params);
    const response = await materialEventReport.getAssetTransferEtcPutBackOption(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_business_acquisition_decision",
  `영업양수 결정: 주요사항보고서(영업양수 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getBusinessAcquisitionDecisionResponseDescription}`,
  materialEventReport.getBusinessAcquisitionDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getBusinessAcquisitionDecisionSchema.parse(params);
    const response = await materialEventReport.getBusinessAcquisitionDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_other_corp_stock_acquisition_decision",
  `타법인 주식 및 출자증권 양수결정: 주요사항보고서(타법인 주식 및 출자증권 양수결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getOtherCorpStockAcquisitionDecisionResponseDescription}`,
  materialEventReport.getOtherCorpStockAcquisitionDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getOtherCorpStockAcquisitionDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getOtherCorpStockAcquisitionDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_other_corp_stock_transfer_decision",
  `타법인 주식 및 출자증권 양도결정: 주요사항보고서(타법인 주식 및 출자증권 양도결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getOtherCorpStockTransferDecisionResponseDescription}`,
  materialEventReport.getOtherCorpStockTransferDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getOtherCorpStockTransferDecisionSchema.parse(params);
    const response =
      await materialEventReport.getOtherCorpStockTransferDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

// 증권발행 관련 이벤트
server.tool(
  "get_convertible_bond_issuance_decision",
  `전환사채권 발행결정: 주요사항보고서(전환사채권 발행결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getConvertibleBondIssuanceDecisionResponseDescription}`,
  materialEventReport.getConvertibleBondIssuanceDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getConvertibleBondIssuanceDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getConvertibleBondIssuanceDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_bond_with_warrant_issuance_decision",
  `신주인수권부사채권 발행결정: 주요사항보고서(신주인수권부사채권 발행결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getBondWithWarrantIssuanceDecisionResponseDescription}`,
  materialEventReport.getBondWithWarrantIssuanceDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getBondWithWarrantIssuanceDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getBondWithWarrantIssuanceDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_exchange_bond_issuance_decision",
  `교환사채권 발행결정: 주요사항보고서(교환사채권 발행결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getExchangeBondIssuanceDecisionResponseDescription}`,
  materialEventReport.getExchangeBondIssuanceDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getExchangeBondIssuanceDecisionSchema.parse(params);
    const response = await materialEventReport.getExchangeBondIssuanceDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_amortizing_conditional_capital_securities_issuance_decision",
  `상환전환우선주등 발행결정: 주요사항보고서(상환전환우선주등 발행결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getAmortizingConditionalCapitalSecuritiesIssuanceDecisionResponseDescription}`,
  materialEventReport
    .getAmortizingConditionalCapitalSecuritiesIssuanceDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getAmortizingConditionalCapitalSecuritiesIssuanceDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getAmortizingConditionalCapitalSecuritiesIssuanceDecision(
        args
      );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

// 해외상장 관련 이벤트
server.tool(
  "get_overseas_listing_decision",
  `해외 증권시장 주권등 상장 결정: 주요사항보고서(해외 증권시장 주권등 상장 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getOverseasListingDecisionResponseDescription}`,
  materialEventReport.getOverseasListingDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getOverseasListingDecisionSchema.parse(params);
    const response = await materialEventReport.getOverseasListingDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_overseas_delisting_decision",
  `해외 증권시장 주권등 상장폐지 결정: 주요사항보고서(해외 증권시장 주권등 상장폐지 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getOverseasDelistingDecisionResponseDescription}`,
  materialEventReport.getOverseasDelistingDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getOverseasDelistingDecisionSchema.parse(params);
    const response = await materialEventReport.getOverseasDelistingDecision(
      args
    );

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_overseas_listing",
  `해외 증권시장 주권등 상장: 주요사항보고서(해외 증권시장 주권등 상장) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getOverseasListingResponseDescription}`,
  materialEventReport.getOverseasListingSchema.shape,
  async (params) => {
    const args = materialEventReport.getOverseasListingSchema.parse(params);
    const response = await materialEventReport.getOverseasListing(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_overseas_delisting",
  `해외 증권시장 주권등 상장폐지: 주요사항보고서(해외 증권시장 주권등 상장폐지) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getOverseasDelistingResponseDescription}`,
  materialEventReport.getOverseasDelistingSchema.shape,
  async (params) => {
    const args = materialEventReport.getOverseasDelistingSchema.parse(params);
    const response = await materialEventReport.getOverseasDelisting(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

// 법적 절차 관련 이벤트
server.tool(
  "get_legal_proceedings_filing",
  `소송 등의 제기: 주요사항보고서(소송 등의 제기) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getLegalProceedingsFilingResponseDescription}`,
  materialEventReport.getLegalProceedingsFilingSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getLegalProceedingsFilingSchema.parse(params);
    const response = await materialEventReport.getLegalProceedingsFiling(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

// 주권관련사채권 거래 이벤트
server.tool(
  "get_stock_related_bond_acquisition_decision",
  `주권 관련 사채권 양수 결정: 주요사항보고서(주권 관련 사채권 양수 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getStockRelatedBondAcquisitionDecisionResponseDescription}`,
  materialEventReport.getStockRelatedBondAcquisitionDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getStockRelatedBondAcquisitionDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getStockRelatedBondAcquisitionDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_stock_related_bond_transfer_decision",
  `주권 관련 사채권 양도 결정: 주요사항보고서(주권 관련 사채권 양도 결정) 내에 주요 정보를 제공합니다.

Response Format: ${materialEventReport.getStockRelatedBondTransferDecisionResponseDescription}`,
  materialEventReport.getStockRelatedBondTransferDecisionSchema.shape,
  async (params) => {
    const args =
      materialEventReport.getStockRelatedBondTransferDecisionSchema.parse(
        params
      );
    const response =
      await materialEventReport.getStockRelatedBondTransferDecision(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

/**
 * 증권신고서 주요정보
 */

server.tool(
  "get_equity_securities",
  `지분증권: 증권신고서(지분증권) 내에 요약 정보를 제공합니다.

Response Format: ${securitiesRegistration.getEquitySecuritiesResponseDescription}`,
  securitiesRegistration.getEquitySecuritiesSchema.shape,
  async (params) => {
    const args = securitiesRegistration.getEquitySecuritiesSchema.parse(params);
    const response = await securitiesRegistration.getEquitySecurities(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_debt_securities",
  `채무증권: 증권신고서(채무증권) 내에 요약 정보를 제공합니다.

Response Format: ${securitiesRegistration.getDebtSecuritiesResponseDescription}`,
  securitiesRegistration.getDebtSecuritiesSchema.shape,
  async (params) => {
    const args = securitiesRegistration.getDebtSecuritiesSchema.parse(params);
    const response = await securitiesRegistration.getDebtSecurities(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_depositary_receipts",
  `증권예탁증권: 증권신고서(증권예탁증권) 내에 요약 정보를 제공합니다.

Response Format: ${securitiesRegistration.getDepositaryReceiptsResponseDescription}`,
  securitiesRegistration.getDepositaryReceiptsSchema.shape,
  async (params) => {
    const args =
      securitiesRegistration.getDepositaryReceiptsSchema.parse(params);
    const response = await securitiesRegistration.getDepositaryReceipts(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_merger",
  `합병: 증권신고서(합병) 내에 요약 정보를 제공합니다.

Response Format: ${securitiesRegistration.getMergerResponseDescription}`,
  securitiesRegistration.getMergerSchema.shape,
  async (params) => {
    const args = securitiesRegistration.getMergerSchema.parse(params);
    const response = await securitiesRegistration.getMerger(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_comprehensive_stock_exchange_transfer",
  `주식의포괄적교환·이전: 증권신고서(주식의포괄적교환·이전) 내에 요약 정보를 제공합니다.

Response Format: ${securitiesRegistration.getComprehensiveStockExchangeTransferResponseDescription}`,
  securitiesRegistration.getComprehensiveStockExchangeTransferSchema.shape,
  async (params) => {
    const args =
      securitiesRegistration.getComprehensiveStockExchangeTransferSchema.parse(
        params
      );
    const response =
      await securitiesRegistration.getComprehensiveStockExchangeTransfer(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  }
);

server.tool(
  "get_division",
  `분할: 증권신고서(분할) 내에 요약 정보를 제공합니다.

Response Format: ${securitiesRegistration.getDivisionResponseDescription}`,
  securitiesRegistration.getDivisionSchema.shape,
  async (params) => {
    const args = securitiesRegistration.getDivisionSchema.parse(params);
    const response = await securitiesRegistration.getDivision(args);

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
