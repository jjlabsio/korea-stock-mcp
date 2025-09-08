import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 주요사항보고서 주요정보 - 자본구조 변경 이벤트
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

// 1. 유상증자 결정 API
export const getPaidIncreaseDecisionSchema = commonMaterialEventSchema;
export type GetPaidIncreaseDecisionParams = z.infer<
  typeof getPaidIncreaseDecisionSchema
>;

export const getPaidIncreaseDecisionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        nstk_ostk_cnt: "신주의 종류와 수(보통주식 (주))",
        nstk_estk_cnt: "신주의 종류와 수(기타주식 (주))",
        fv_ps: "1주당 액면가액 (원)",
        bfic_tisstk_ostk: "증자전 발행주식총수 (주)(보통주식 (주))",
        bfic_tisstk_estk: "증자전 발행주식총수 (주)(기타주식 (주))",
        fdpp_fclt: "자금조달의 목적(시설자금 (원))",
        fdpp_bsninh: "자금조달의 목적(영업양수자금 (원))",
        fdpp_op: "자금조달의 목적(운영자금 (원))",
        fdpp_dtrp: "자금조달의 목적(채무상환자금 (원))",
        fdpp_ocsa: "자금조달의 목적(타법인 증권 취득자금 (원))",
        fdpp_etc: "자금조달의 목적(기타자금 (원))",
        ic_mthn: "증자방식",
        ssl_at: "공매도 해당여부",
        ssl_bgd: "공매도 시작일",
        ssl_edd: "공매도 종료일",
      },
    ],
  },
});

export async function getPaidIncreaseDecision(
  params: GetPaidIncreaseDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/piicDecsn.json", params)
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

// 2. 무상증자 결정 API
export const getFreeIncreaseDecisionSchema = commonMaterialEventSchema;
export type GetFreeIncreaseDecisionParams = z.infer<
  typeof getFreeIncreaseDecisionSchema
>;

export const getFreeIncreaseDecisionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        nstk_ostk_cnt: "신주의 종류와 수(보통주식 (주))",
        nstk_estk_cnt: "신주의 종류와 수(기타주식 (주))",
        fv_ps: "1주당 액면가액 (원)",
        bfic_tisstk_ostk: "증자전 발행주식총수 (주)(보통주식 (주))",
        bfic_tisstk_estk: "증자전 발행주식총수 (주)(기타주식 (주))",
        nstk_asstd: "신주배정기준일",
        nstk_ascnt_ps_ostk: "1주당 신주배정 주식수(보통주식 (주))",
        nstk_ascnt_ps_estk: "1주당 신주배정 주식수(기타주식 (주))",
        nstk_dividrk: "신주의 배당기산일",
        nstk_dlprd: "신주권교부예정일",
        nstk_lstprd: "신주의 상장 예정일",
        bddd: "이사회결의일(결정일)",
        od_a_at_t: "사외이사 참석여부(참석(명))",
        od_a_at_b: "사외이사 참석여부(불참(명))",
        adt_a_atn: "감사(감사위원)참석 여부",
      },
    ],
  },
});

export async function getFreeIncreaseDecision(
  params: GetFreeIncreaseDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/fricDecsn.json", params)
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

// 3. 유무상증자 결정 API
export const getPaidFreeIncreaseDecisionSchema = commonMaterialEventSchema;
export type GetPaidFreeIncreaseDecisionParams = z.infer<
  typeof getPaidFreeIncreaseDecisionSchema
>;

export const getPaidFreeIncreaseDecisionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        piic_nstk_ostk_cnt: "유상증자(신주의 종류와 수(보통주식 (주)))",
        piic_nstk_estk_cnt: "유상증자(신주의 종류와 수(기타주식 (주)))",
        piic_fv_ps: "유상증자(1주당 액면가액 (원))",
        piic_bfic_tisstk_ostk: "유상증자(증자전 발행주식총수 (주)(보통주식 (주)))",
        piic_bfic_tisstk_estk: "유상증자(증자전 발행주식총수 (주)(기타주식 (주)))",
        piic_fdpp_fclt: "유상증자(자금조달의 목적(시설자금 (원)))",
        piic_fdpp_bsninh: "유상증자(자금조달의 목적(영업양수자금 (원)))",
        piic_fdpp_op: "유상증자(자금조달의 목적(운영자금 (원)))",
        piic_fdpp_dtrp: "유상증자(자금조달의 목적(채무상환자금 (원)))",
        piic_fdpp_ocsa: "유상증자(자금조달의 목적(타법인 증권 취득자금 (원)))",
        piic_fdpp_etc: "유상증자(자금조달의 목적(기타자금 (원)))",
        piic_ic_mthn: "유상증자(증자방식)",
        fric_nstk_ostk_cnt: "무상증자(신주의 종류와 수(보통주식 (주)))",
        fric_nstk_estk_cnt: "무상증자(신주의 종류와 수(기타주식 (주)))",
        fric_fv_ps: "무상증자(1주당 액면가액 (원))",
        fric_bfic_tisstk_ostk: "무상증자(증자전 발행주식총수(보통주식 (주)))",
        fric_bfic_tisstk_estk: "무상증자(증자전 발행주식총수(기타주식 (주)))",
        fric_nstk_asstd: "무상증자(신주배정기준일)",
        fric_nstk_ascnt_ps_ostk: "무상증자(1주당 신주배정 주식수(보통주식 (주)))",
        fric_nstk_ascnt_ps_estk: "무상증자(1주당 신주배정 주식수(기타주식 (주)))",
        fric_nstk_dividrk: "무상증자(신주의 배당기산일)",
        fric_nstk_dlprd: "무상증자(신주권교부예정일)",
        fric_nstk_lstprd: "무상증자(신주의 상장 예정일)",
        fric_bddd: "무상증자(이사회결의일(결정일))",
        fric_od_a_at_t: "무상증자(사외이사 참석여부(참석(명)))",
        fric_od_a_at_b: "무상증자(사외이사 참석여부(불참(명)))",
        fric_adt_a_atn: "무상증자(감사(감사위원)참석 여부)",
        ssl_at: "공매도 해당여부",
        ssl_bgd: "공매도 시작일",
        ssl_edd: "공매도 종료일",
      },
    ],
  },
});

export async function getPaidFreeIncreaseDecision(
  params: GetPaidFreeIncreaseDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/pifricDecsn.json", params)
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

// 4. 감자 결정 API
export const getCapitalReductionDecisionSchema = commonMaterialEventSchema;
export type GetCapitalReductionDecisionParams = z.infer<
  typeof getCapitalReductionDecisionSchema
>;

export const getCapitalReductionDecisionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        crstk_ostk_cnt: "감자주식의 종류와 수(보통주식 (주))",
        crstk_estk_cnt: "감자주식의 종류와 수(기타주식 (주))",
        fv_ps: "1주당 액면가액 (원)",
        bfcr_cpt: "감자전후 자본금(감자전 (원))",
        atcr_cpt: "감자전후 자본금(감자후 (원))",
        bfcr_tisstk_ostk: "감자전후 발행주식수(보통주식 (주)(감자전 (원)))",
        atcr_tisstk_ostk: "감자전후 발행주식수(보통주식 (주)(감자후 (원)))",
        bfcr_tisstk_estk: "감자전후 발행주식수(기타주식 (주)(감자전 (원)))",
        atcr_tisstk_estk: "감자전후 발행주식수(기타주식 (주)(감자후 (원)))",
        cr_rt_ostk: "감자비율(보통주식 (%))",
        cr_rt_estk: "감자비율(기타주식 (%))",
        cr_std: "감자기준일",
        cr_mth: "감자방법",
        cr_rs: "감자사유",
        crsc_gmtsck_prd: "감자일정(주주총회 예정일)",
        crsc_trnmsppd: "감자일정(명의개서정지기간)",
        crsc_osprpd: "감자일정(구주권 제출기간)",
        crsc_trspprpd: "감자일정(매매거래 정지예정기간)",
        crsc_osprpd_bgd: "감자일정(구주권 제출기간(시작일))",
        crsc_osprpd_edd: "감자일정(구주권 제출기간(종료일))",
        crsc_trspprpd_bgd: "감자일정(매매거래 정지예정기간(시작일))",
        crsc_trspprpd_edd: "감자일정(매매거래 정지예정기간(종료일))",
        crsc_nstkdlprd: "감자일정(신주권교부예정일)",
        crsc_nstklstprd: "감자일정(신주상장예정일)",
        cdobprpd_bgd: "채권자 이의제출기간(시작일)",
        cdobprpd_edd: "채권자 이의제출기간(종료일)",
        ospr_nstkdl_pl: "구주권제출 및 신주권교부장소",
        bddd: "이사회결의일(결정일)",
        od_a_at_t: "사외이사 참석여부(참석(명))",
        od_a_at_b: "사외이사 참석여부(불참(명))",
        adt_a_atn: "감사(감사위원) 참석여부",
        ftc_stt_atn: "공정거래위원회 신고대상 여부",
      },
    ],
  },
});

export async function getCapitalReductionDecision(
  params: GetCapitalReductionDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/crDecsn.json", params)
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
