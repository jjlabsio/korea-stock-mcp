import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 정기보고서 재무정보 - 주요 재무지표
 * 상장법인(유가증권, 코스닥) 및 주요 비상장법인(사업보고서 제출대상 & IFRS 적용)이 제출한 정기보고서 내에 XBRL재무제표의 주요 재무지표를 제공합니다.
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS003
 */

// 공통 재무지표 스키마
const baseFinancialIndicatorSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bsns_year: z
    .string()
    .length(4)
    .describe("사업연도(4자리) - 2023년 3분기 이후부터 정보제공"),
  reprt_code: z
    .enum(["11013", "11012", "11014", "11011"])
    .describe(
      "보고서 코드: 11013(1분기), 11012(반기), 11014(3분기), 11011(사업보고서)"
    ),
  idx_cl_code: z
    .enum(["M210000", "M220000", "M230000", "M240000"])
    .describe(
      "지표분류코드: M210000(수익성지표), M220000(안정성지표), M230000(성장성지표), M240000(활동성지표)"
    ),
});

// 1. 단일회사 주요 재무지표 API
export const getSingleCompanyFinancialIndicatorsSchema =
  baseFinancialIndicatorSchema;
export type GetSingleCompanyFinancialIndicatorsParams = z.infer<
  typeof getSingleCompanyFinancialIndicatorsSchema
>;

export const getSingleCompanyFinancialIndicatorsResponseDescription =
  JSON.stringify({
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          reprt_code: "보고서 코드",
          bsns_year: "사업 연도",
          corp_code: "공시대상회사의 고유번호(8자리)",
          stock_code: "상장회사의 종목코드(6자리)",
          stlm_dt: "결산기준일(YYYY-MM-DD)",
          idx_cl_code: "지표분류코드",
          idx_cl_nm: "지표분류명",
          idx_code: "지표코드",
          idx_nm: "지표명",
          idx_val: "지표값",
        },
      ],
    },
  });

export async function getSingleCompanyFinancialIndicators(
  params: GetSingleCompanyFinancialIndicatorsParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/fnlttSinglIndx.json", params)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("조회된 데이타가 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  return data;
}

// 2. 다중회사 주요 재무지표 API
export const getMultipleCompanyFinancialIndicatorsSchema =
  baseFinancialIndicatorSchema;
export type GetMultipleCompanyFinancialIndicatorsParams = z.infer<
  typeof getMultipleCompanyFinancialIndicatorsSchema
>;

export const getMultipleCompanyFinancialIndicatorsResponseDescription =
  JSON.stringify({
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          reprt_code: "보고서 코드",
          bsns_year: "사업 연도",
          corp_code: "공시대상회사의 고유번호(8자리)",
          stock_code: "상장회사의 종목코드(6자리)",
          stlm_dt: "결산기준일(YYYY-MM-DD)",
          idx_cl_code: "지표분류코드",
          idx_cl_nm: "지표분류명",
          idx_code: "지표코드",
          idx_nm: "지표명",
          idx_val: "지표값",
        },
      ],
    },
  });

export async function getMultipleCompanyFinancialIndicators(
  params: GetMultipleCompanyFinancialIndicatorsParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/fnlttCmpnyIndx.json", params)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("조회된 데이타가 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  return data;
}
