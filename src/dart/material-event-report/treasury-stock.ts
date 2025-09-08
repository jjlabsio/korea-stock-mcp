import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 주요사항보고서 주요정보 - 자기주식 관련 이벤트
 * 아래 링크들의 API를 사용
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS005
 */

// 공통 스키마 - 모든 주요사항보고서 API에서 사용
const commonMaterialEventSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bgn_de: z
    .string()
    .length(8)
    .describe("검색시작 접수일자(YYYYMMDD) - 2015년 이후부터 정보제공"),
  end_de: z
    .string()
    .length(8)
    .describe("검색종료 접수일자(YYYYMMDD) - 2015년 이후부터 정보제공"),
});

// 1. 자기주식 취득 결정 API
export const getTreasuryStockAcquisitionDecisionSchema =
  commonMaterialEventSchema;
export type GetTreasuryStockAcquisitionDecisionParams = z.infer<
  typeof getTreasuryStockAcquisitionDecisionSchema
>;

export const getTreasuryStockAcquisitionDecisionResponseDescription =
  JSON.stringify({
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          rcept_no: "접수번호(14자리)",
          corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
          corp_code: "공시대상회사의 고유번호(8자리)",
          corp_name: "회사명",
          aqpln_stk_ostk: "취득예정주식(보통주식)",
          aqpln_stk_estk: "취득예정주식(기타주식)",
          aqpln_prc_ostk: "취득예정금액(보통주식)",
          aqpln_prc_estk: "취득예정금액(기타주식)",
          aqexpd_bgd: "취득예상기간(시작일)",
          aqexpd_edd: "취득예상기간(종료일)",
          hdexpd_bgd: "보유예상기간(시작일)",
          hdexpd_edd: "보유예상기간(종료일)",
          aq_pp: "취득목적",
          aq_mth: "취득방법",
          cs_iv_bk: "위탁투자중개업자",
          aq_wtn_div_ostk: "취득 전 자기주식 보유현황(보통주식)",
          aq_wtn_div_estk: "취득 전 자기주식 보유현황(기타주식)",
          aq_af_div_ostk: "취득 후 자기주식 보유현황(보통주식)",
          aq_af_div_estk: "취득 후 자기주식 보유현황(기타주식)",
          bddd: "이사회결의일(결정일)",
          od_a_at_t: "사외이사 참석여부(참석(명))",
          od_a_at_b: "사외이사 참석여부(불참(명))",
          adt_a_atn: "감사(감사위원) 참석여부",
        },
      ],
    },
  });

export async function getTreasuryStockAcquisitionDecision(
  params: GetTreasuryStockAcquisitionDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/tsstkAqDecsn.json", params)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("해당 기업의 정보를 찾을 수 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  return data;
}

// 2. 자기주식 처분 결정 API
export const getTreasuryStockDisposalDecisionSchema = commonMaterialEventSchema;
export type GetTreasuryStockDisposalDecisionParams = z.infer<
  typeof getTreasuryStockDisposalDecisionSchema
>;

export const getTreasuryStockDisposalDecisionResponseDescription =
  JSON.stringify({
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          rcept_no: "접수번호(14자리)",
          corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
          corp_code: "공시대상회사의 고유번호(8자리)",
          corp_name: "회사명",
          dppln_stk_ostk: "처분예정주식(보통주식)",
          dppln_stk_estk: "처분예정주식(기타주식)",
          dpstk_prc_ostk: "처분 대상 주식가격(보통주식)",
          dpstk_prc_estk: "처분 대상 주식가격(기타주식)",
          dppln_prc_ostk: "처분예정금액(보통주식)",
          dppln_prc_estk: "처분예정금액(기타주식)",
          dpprpd_bgd: "처분예정기간(시작일)",
          dpprpd_edd: "처분예정기간(종료일)",
          dp_pp: "처분목적",
          dp_m_mkt: "처분방법(시장을 통한 매도)",
          dp_m_ovtm: "처분방법(시간외대량매매)",
          dp_m_otc: "처분방법(장외처분)",
          dp_m_etc: "처분방법(기타)",
          cs_iv_bk: "위탁투자중개업자",
          aq_wtn_div_ostk:
            "처분 전 자기주식 보유현황(배당가능이익 범위 내 취득(보통주식))",
          aq_wtn_div_ostk_rt:
            "처분 전 자기주식 보유현황(배당가능이익 범위 내 취득(비율(%)))",
          aq_wtn_div_estk:
            "처분 전 자기주식 보유현황(배당가능이익 범위 내 취득(기타주식))",
          aq_wtn_div_estk_rt:
            "처분 전 자기주식 보유현황(배당가능이익 범위 내 취득(비율(%)))",
          eaq_ostk: "처분 전 자기주식 보유현황(기타취득(보통주식))",
          eaq_ostk_rt: "처분 전 자기주식 보유현황(기타취득(비율(%)))",
          eaq_estk: "처분 전 자기주식 보유현황(기타취득(기타주식))",
          eaq_estk_rt: "처분 전 자기주식 보유현황(기타취득(비율(%)))",
          dp_dd: "처분결정일",
          od_a_at_t: "사외이사 참석여부(참석(명))",
          od_a_at_b: "사외이사 참석여부(불참(명))",
          adt_a_atn: "감사(감사위원) 참석여부",
          d1_slodlm_ostk: "1일 매도 주문수량 한도(보통주식)",
          d1_slodlm_estk: "1일 매도 주문수량 한도(기타주식)",
        },
      ],
    },
  });

export async function getTreasuryStockDisposalDecision(
  params: GetTreasuryStockDisposalDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/tsstkDpDecsn.json", params)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("해당 기업의 정보를 찾을 수 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  return data;
}

// 3. 자기주식취득 신탁계약 체결 결정 API
export const getTreasuryStockTrustContractDecisionSchema =
  commonMaterialEventSchema;
export type GetTreasuryStockTrustContractDecisionParams = z.infer<
  typeof getTreasuryStockTrustContractDecisionSchema
>;

export const getTreasuryStockTrustContractDecisionResponseDescription =
  JSON.stringify({
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          rcept_no: "접수번호(14자리)",
          corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
          corp_code: "공시대상회사의 고유번호(8자리)",
          corp_name: "회사명",
          ctr_prc: "계약금액",
          ctr_pd_bgd: "계약기간(개시일)",
          ctr_pd_edd: "계약기간(종료일)",
          ctr_pp: "계약목적",
          ctr_cns_int: "계약기관",
          ctr_cns_prd: "계약예정일",
          aq_wtn_div_ostk: "계약 전 자기주식(보통주식)",
          aq_wtn_div_ostk_rt: "계약 전 자기주식 비율(보통주식)",
          aq_wtn_div_estk: "계약 전 자기주식(기타주식)",
          aq_wtn_div_estk_rt: "계약 전 자기주식 비율(기타주식)",
          eaq_ostk: "계약 전 기타 자기주식(보통주식)",
          eaq_ostk_rt: "계약 전 기타 자기주식 비율(보통주식)",
          eaq_estk: "계약 전 기타 자기주식(기타주식)",
          eaq_estk_rt: "계약 전 기타 자기주식 비율(기타주식)",
          bddd: "이사회결의일",
          od_a_at_t: "사외이사 참석수",
          od_a_at_b: "사외이사 불참수",
          adt_a_atn: "감사 참석여부",
          cs_iv_bk: "위탁투자중개업자",
        },
      ],
    },
  });

export async function getTreasuryStockTrustContractDecision(
  params: GetTreasuryStockTrustContractDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/tsstkAqTrctrCnsDecsn.json", params)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("해당 기업의 정보를 찾을 수 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  return data;
}

// 4. 자기주식취득 신탁계약 해지 결정 API
export const getTreasuryStockTrustTerminationDecisionSchema =
  commonMaterialEventSchema;
export type GetTreasuryStockTrustTerminationDecisionParams = z.infer<
  typeof getTreasuryStockTrustTerminationDecisionSchema
>;

export const getTreasuryStockTrustTerminationDecisionResponseDescription =
  JSON.stringify({
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          rcept_no: "접수번호(14자리)",
          corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
          corp_code: "공시대상회사의 고유번호(8자리)",
          corp_name: "회사명",
          ctr_prc_bfcc: "해지 전 계약금액",
          ctr_prc_atcc: "해지 후 계약금액",
          ctr_pd_bfcc_bgd: "해지 전 계약기간(시작일)",
          ctr_pd_bfcc_edd: "해지 전 계약기간(종료일)",
          cc_pp: "해지목적",
          cc_int: "해지기관",
          cc_prd: "해지예정일",
          tp_rm_atcc: "해지 후 신탁재산 반환방법",
          aq_wtn_div_ostk: "자기주식 보유현황(보통주식)",
          aq_wtn_div_ostk_rt: "자기주식 보유현황 비율(보통주식)",
          aq_wtn_div_estk: "자기주식 보유현황(기타주식)",
          aq_wtn_div_estk_rt: "자기주식 보유현황 비율(기타주식)",
          eaq_ostk: "기타취득 현황(보통주식)",
          eaq_ostk_rt: "기타취득 현황 비율(보통주식)",
          eaq_estk: "기타취득 현황(기타주식)",
          eaq_estk_rt: "기타취득 현황 비율(기타주식)",
          bddd: "이사회결의일",
          od_a_at_t: "사외이사 참석수",
          od_a_at_b: "사외이사 불참수",
          adt_a_atn: "감사 참석여부",
        },
      ],
    },
  });

export async function getTreasuryStockTrustTerminationDecision(
  params: GetTreasuryStockTrustTerminationDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/tsstkAqTrctrCcDecsn.json", params)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("해당 기업의 정보를 찾을 수 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  return data;
}
