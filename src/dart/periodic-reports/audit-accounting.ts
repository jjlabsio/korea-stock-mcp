import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 정기보고서 주요정보 - 감사 및 회계 관련 정보
 * 아래 링크들의 API를 사용
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS002
 */

// 공통 스키마 - 모든 정기보고서 API에서 사용
const commonPeriodicReportSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bsns_year: z.string().length(4).describe("사업연도(4자리) - 2015년 이후부터 정보제공"),
  reprt_code: z.string().length(5).describe("보고서 코드 - 1분기보고서: 11013, 반기보고서: 11012, 3분기보고서: 11014, 사업보고서: 11011"),
});

// 1. 회계감사인의 명칭 및 감사의견 API
export const getAuditorOpinionSchema = commonPeriodicReportSchema;
export type GetAuditorOpinionParams = z.infer<typeof getAuditorOpinionSchema>;

export const getAuditorOpinionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        bsns_year: "사업연도",
        adtor: "감사인",
        adt_opinion: "감사의견",
        adt_reprt_spcmnt_matter: "감사보고서 특기사항 (2019년 12월 8일까지 사용됨)",
        emphs_matter: "강조사항 등 (2019년 12월 9일부터 추가됨)",
        core_adt_matter: "핵심감사사항 (2019년 12월 9일부터 추가됨)",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getAuditorOpinion(params: GetAuditorOpinionParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/accnutAdtorNmNdAdtOpinion.json", params)
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

// 2. 감사용역체결현황 API
export const getAuditServiceContractSchema = commonPeriodicReportSchema;
export type GetAuditServiceContractParams = z.infer<typeof getAuditServiceContractSchema>;

export const getAuditServiceContractResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        bsns_year: "사업연도",
        adtor: "감사인",
        cn: "내용",
        mendng: "보수 (2020년 7월 5일까지 사용됨)",
        tot_reqre_time: "총소요시간 (2020년 7월 5일까지 사용됨)",
        adt_cntrct_dtls_mendng: "감사계약내역(보수) (2020년 7월 6일부터 추가됨)",
        adt_cntrct_dtls_time: "감사계약내역(시간) (2020년 7월 6일부터 추가됨)",
        real_exc_dtls_mendng: "실제수행내역(보수) (2020년 7월 6일부터 추가됨)",
        real_exc_dtls_time: "실제수행내역(시간) (2020년 7월 6일부터 추가됨)",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getAuditServiceContract(params: GetAuditServiceContractParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/adtServcCnclsSttus.json", params)
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

// 3. 회계감사인과의 비감사용역 계약체결 현황 API
export const getNonAuditServiceContractSchema = commonPeriodicReportSchema;
export type GetNonAuditServiceContractParams = z.infer<typeof getNonAuditServiceContractSchema>;

export const getNonAuditServiceContractResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        bsns_year: "사업연도",
        cntrct_cncls_de: "계약체결일",
        servc_cn: "용역내용",
        servc_exc_pd: "용역수행기간",
        servc_mendng: "용역보수",
        rm: "비고",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getNonAuditServiceContract(params: GetNonAuditServiceContractParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/accnutAdtorNonAdtServcCnclsSttus.json", params)
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