import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 정기보고서 주요정보 - 투자 및 자금 관련 정보
 * 아래 링크들의 API를 사용
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS002
 */

// 공통 스키마 - 모든 정기보고서 API에서 사용
const commonPeriodicReportSchema = z.object({
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
});

// 1. 타법인 출자현황 API
export const getOtherCorporationInvestmentSchema = commonPeriodicReportSchema;
export type GetOtherCorporationInvestmentParams = z.infer<
  typeof getOtherCorporationInvestmentSchema
>;

export const getOtherCorporationInvestmentResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        inv_prm: "법인명",
        frst_acqs_de: "최초취득일자",
        invstmnt_purps: "출자목적",
        frst_acqs_amount: "최초취득금액",
        bsis_blce_qy: "기초잔액수량",
        bsis_blce_qota_rt: "기초잔액지분율(%)",
        bsis_blce_acntbk_amount: "기초잔액장부가액",
        incrs_dcrs_acqs_dsps_qy: "증가감소취득처분수량",
        incrs_dcrs_acqs_dsps_amount: "증가감소취득처분금액",
        incrs_dcrs_evl_lstmn: "증가감소평가손액",
        trmend_blce_qy: "기말잔액수량",
        trmend_blce_qota_rt: "기말잔액지분율(%)",
        trmend_blce_acntbk_amount: "기말잔액장부가액",
        recent_bsns_year_fnnr_sttus_tot_assets: "최근사업연도 재무 현황 총자산",
        recent_bsns_year_fnnr_sttus_thstrm_ntpf:
          "최근사업연도 재무현황 당기순이익",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getOtherCorporationInvestment(
  params: GetOtherCorporationInvestmentParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/otrCprInvstmntSttus.json", params)
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

// 2. 공모자금의 사용내역 API
export const getPublicOfferingFundsSchema = commonPeriodicReportSchema;
export type GetPublicOfferingFundsParams = z.infer<
  typeof getPublicOfferingFundsSchema
>;

export const getPublicOfferingFundsResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        se_nm: "구분",
        tm: "회차",
        pay_de: "납입일",
        pay_amount: "납입금액",
        on_dclrt_cptal_use_plan: "신고서상 자금사용 계획",
        real_cptal_use_sttus: "실제 자금사용 현황",
        rs_cptal_use_plan_useprps: "증권신고서 등의 자금사용 계획(사용용도)",
        rs_cptal_use_plan_prcure_amount:
          "증권신고서 등의 자금사용 계획(조달금액)",
        real_cptal_use_dtls_cn: "실제 자금사용 내역(내용)",
        real_cptal_use_dtls_amount: "실제 자금사용 내역(금액)",
        dffrnc_occrrnc_resn: "차이발생 사유 등",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getPublicOfferingFunds(
  params: GetPublicOfferingFundsParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/pssrpCptalUseDtls.json", params)
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

// 3. 사모자금의 사용내역 API
export const getPrivateOfferingFundsSchema = commonPeriodicReportSchema;
export type GetPrivateOfferingFundsParams = z.infer<
  typeof getPrivateOfferingFundsSchema
>;

export const getPrivateOfferingFundsResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        se_nm: "구분",
        tm: "회차",
        pay_de: "납입일",
        pay_amount: "납입금액",
        cptal_use_plan: "자금사용 계획",
        real_cptal_use_sttus: "실제 자금사용 현황",
        mtrpt_cptal_use_plan_useprps:
          "주요사항보고서의 자금사용 계획(사용용도)",
        mtrpt_cptal_use_plan_prcure_amount:
          "주요사항보고서의 자금사용 계획(조달금액)",
        real_cptal_use_dtls_cn: "실제 자금사용 내역(내용)",
        real_cptal_use_dtls_amount: "실제 자금사용 내역(금액)",
        dffrnc_occrrnc_resn: "차이발생 사유 등",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getPrivateOfferingFunds(
  params: GetPrivateOfferingFundsParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/prvsrpCptalUseDtls.json", params)
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
