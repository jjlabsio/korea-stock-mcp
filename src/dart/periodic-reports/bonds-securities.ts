import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 정기보고서 주요정보 - 채무증권 관련 정보
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

// 1. 채무증권 발행실적 API
export const getBondIssuanceStatusSchema = commonPeriodicReportSchema;
export type GetBondIssuanceStatusParams = z.infer<
  typeof getBondIssuanceStatusSchema
>;

export const getBondIssuanceStatusResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        isu_cmpny: "발행회사",
        scrits_knd_nm: "증권종류",
        isu_mth_nm: "발행방법",
        isu_de: "발행일자 (YYYYMMDD)",
        facvalu_totamt: "권면(전자등록)총액",
        intrt: "이자율",
        evl_grad_instt: "평가등급(평가기관)",
        mtd: "만기일 (YYYYMMDD)",
        repy_at: "상환여부",
        mngt_cmpny: "주관회사",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getBondIssuanceStatus(
  params: GetBondIssuanceStatusParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/detScritsIsuAcmslt.json", params)
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

// 2. 기업어음증권 미상환 잔액 API
export const getCommercialPaperBalanceSchema = commonPeriodicReportSchema;
export type GetCommercialPaperBalanceParams = z.infer<
  typeof getCommercialPaperBalanceSchema
>;

export const getCommercialPaperBalanceResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        remndr_exprtn1: "잔여만기",
        remndr_exprtn2: "잔여만기",
        de10_below: "10일 이하",
        de10_excess_de30_below: "10일초과 30일이하",
        de30_excess_de90_below: "30일초과 90일이하",
        de90_excess_de180_below: "90일초과 180일이하",
        de180_excess_yy1_below: "180일초과 1년이하",
        yy1_excess_yy2_below: "1년초과 2년이하",
        yy2_excess_yy3_below: "2년초과 3년이하",
        yy3_excess: "3년 초과",
        sm: "합계",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getCommercialPaperBalance(
  params: GetCommercialPaperBalanceParams
) {
  const response = await dartRequest(
    buildUrl(
      "https://opendart.fss.or.kr/api/entrprsBilScritsNrdmpBlce.json",
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

// 3. 단기사채 미상환 잔액 API
export const getShortTermBondBalanceSchema = commonPeriodicReportSchema;
export type GetShortTermBondBalanceParams = z.infer<
  typeof getShortTermBondBalanceSchema
>;

export const getShortTermBondBalanceResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        remndr_exprtn1: "잔여만기",
        remndr_exprtn2: "잔여만기",
        de10_below: "10일 이하",
        de10_excess_de30_below: "10일초과 30일이하",
        de30_excess_de90_below: "30일초과 90일이하",
        de90_excess_de180_below: "90일초과 180일이하",
        de180_excess_yy1_below: "180일초과 1년이하",
        sm: "합계",
        isu_lmt: "발행 한도",
        remndr_lmt: "잔여 한도",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getShortTermBondBalance(
  params: GetShortTermBondBalanceParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/srtpdPsndbtNrdmpBlce.json", params)
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

// 4. 회사채 미상환 잔액 API
export const getCorporateBondBalanceSchema = commonPeriodicReportSchema;
export type GetCorporateBondBalanceParams = z.infer<
  typeof getCorporateBondBalanceSchema
>;

export const getCorporateBondBalanceResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        remndr_exprtn1: "잔여만기",
        remndr_exprtn2: "잔여만기",
        yy1_below: "1년 이하",
        yy1_excess_yy2_below: "1년초과 2년이하",
        yy2_excess_yy3_below: "2년초과 3년이하",
        yy3_excess_yy4_below: "3년초과 4년이하",
        yy4_excess_yy5_below: "4년초과 5년이하",
        yy5_excess_yy10_below: "5년초과 10년이하",
        yy10_excess: "10년초과",
        sm: "합계",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getCorporateBondBalance(
  params: GetCorporateBondBalanceParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/cprndNrdmpBlce.json", params)
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

// 5. 신종자본증권 미상환 잔액 API
export const getHybridBondBalanceSchema = commonPeriodicReportSchema;
export type GetHybridBondBalanceParams = z.infer<
  typeof getHybridBondBalanceSchema
>;

export const getHybridBondBalanceResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        remndr_exprtn1: "잔여만기",
        remndr_exprtn2: "잔여만기",
        yy1_below: "1년 이하",
        yy1_excess_yy5_below: "1년초과 5년이하",
        yy5_excess_yy10_below: "5년초과 10년이하",
        yy10_excess_yy15_below: "10년초과 15년이하",
        yy15_excess_yy20_below: "15년초과 20년이하",
        yy20_excess_yy30_below: "20년초과 30년이하",
        yy30_excess: "30년초과",
        sm: "합계",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getHybridBondBalance(params: GetHybridBondBalanceParams) {
  const response = await dartRequest(
    buildUrl(
      "https://opendart.fss.or.kr/api/newCaplScritsNrdmpBlce.json",
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

// 6. 조건부 자본증권 미상환 잔액 API
export const getConditionalBondBalanceSchema = commonPeriodicReportSchema;
export type GetConditionalBondBalanceParams = z.infer<
  typeof getConditionalBondBalanceSchema
>;

export const getConditionalBondBalanceResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        remndr_exprtn1: "잔여만기",
        remndr_exprtn2: "잔여만기",
        yy1_below: "1년 이하",
        yy1_excess_yy2_below: "1년초과 2년이하",
        yy2_excess_yy3_below: "2년초과 3년이하",
        yy3_excess_yy4_below: "3년초과 4년이하",
        yy4_excess_yy5_below: "4년초과 5년이하",
        yy5_excess_yy10_below: "5년초과 10년이하",
        yy10_excess_yy20_below: "10년초과 20년이하",
        yy20_excess_yy30_below: "20년초과 30년이하",
        yy30_excess: "30년초과",
        sm: "합계",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getConditionalBondBalance(
  params: GetConditionalBondBalanceParams
) {
  const response = await dartRequest(
    buildUrl(
      "https://opendart.fss.or.kr/api/cndlCaplScritsNrdmpBlce.json",
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
