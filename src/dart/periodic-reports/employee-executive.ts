import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 정기보고서 주요정보 - 임직원 및 보수 관련 정보
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

// 1. 임원 현황 API
export const getExecutiveStatusSchema = commonPeriodicReportSchema;
export type GetExecutiveStatusParams = z.infer<typeof getExecutiveStatusSchema>;

export const getExecutiveStatusResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        nm: "성명",
        sexdstn: "성별",
        birth_ym: "출생년월",
        ofcps: "직책",
        rgist_exctv_at: "등기임원여부",
        fte_at: "상근여부",
        chrg_job: "담당업무",
        main_career: "주요경력",
        mxmm_shrholdr_relate: "최대주주와의 관계",
        hffc_pd: "재직기간",
        tenure_end_on: "임기만료일 (YYYY-MM-DD)",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getExecutiveStatus(params: GetExecutiveStatusParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/exctvSttus.json", params)
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

// 2. 직원 현황 API
export const getEmployeeStatusSchema = commonPeriodicReportSchema;
export type GetEmployeeStatusParams = z.infer<typeof getEmployeeStatusSchema>;

export const getEmployeeStatusResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        fo_bbm: "사업부문",
        sexdstn: "성별",
        reform_bfe_emp_co_rgllbr: "개정 전 직원 수 정규직",
        reform_bfe_emp_co_cnttk: "개정 전 직원 수 계약직",
        reform_bfe_emp_co_etc: "개정 전 직원 수 기타",
        rgllbr_co: "정규직 수",
        rgllbr_abacpt_labrr_co:
          "정규직 중 단시간 근로자 수(대표이사, 이사, 사외이사 등)",
        cnttk_co: "계약직 수",
        cnttk_abacpt_labrr_co: "계약직 중 단시간 근로자 수",
        sm: "합계",
        avrg_cnwk_sdytrn: "평균근속연수",
        fyer_salary_totamt: "연간 급여 총액",
        jan_salary_am: "1인평균 급여 액",
        rm: "비고",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getEmployeeStatus(params: GetEmployeeStatusParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/empSttus.json", params)
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

// 3. 이사·감사의 개인별 보수현황(5억원 이상) API
export const getDirectorAuditorRemunerationSchema = commonPeriodicReportSchema;
export type GetDirectorAuditorRemunerationParams = z.infer<
  typeof getDirectorAuditorRemunerationSchema
>;

export const getDirectorAuditorRemunerationResponseDescription = JSON.stringify(
  {
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          rcept_no: "접수번호(14자리)",
          corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
          corp_code: "공시대상회사의 고유번호(8자리)",
          corp_name: "회사명",
          nm: "성명",
          ofcps: "직위",
          mendng_totamt: "보수총액",
          mendng_totamt_ct_incls_mendng: "보수총액 비 포함 보수",
          stlm_dt: "결산기준일 (YYYY-MM-DD)",
        },
      ],
    },
  }
);

export async function getDirectorAuditorRemuneration(
  params: GetDirectorAuditorRemunerationParams
) {
  const response = await dartRequest(
    buildUrl(
      "https://opendart.fss.or.kr/api/hmvAuditIndvdlBySttus.json",
      params
    )
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

// 4. 이사·감사 전체의 보수현황(보수지급금액 - 이사·감사 전체) API
export const getAllDirectorAuditorRemunerationSchema =
  commonPeriodicReportSchema;
export type GetAllDirectorAuditorRemunerationParams = z.infer<
  typeof getAllDirectorAuditorRemunerationSchema
>;

export const getAllDirectorAuditorRemunerationResponseDescription =
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
          nmpr: "인원수",
          mendng_totamt: "보수 총액",
          jan_avrg_mendng_am: "1인 평균 보수 액",
          rm: "비고",
          stlm_dt: "결산기준일 (YYYY-MM-DD)",
        },
      ],
    },
  });

export async function getAllDirectorAuditorRemuneration(
  params: GetAllDirectorAuditorRemunerationParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/hmvAuditAllSttus.json", params)
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

// 5. 개인별 보수지급 금액(5억이상 상위5인) API
export const getTopRemunerationSchema = commonPeriodicReportSchema;
export type GetTopRemunerationParams = z.infer<typeof getTopRemunerationSchema>;

export const getTopRemunerationResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        nm: "성명",
        ofcps: "직책",
        mendng_totamt: "보수총액",
        mendng_totamt_ct_incls_mendng: "보수 총액 비 포함 보수",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getTopRemuneration(params: GetTopRemunerationParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/indvdlByPay.json", params)
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
