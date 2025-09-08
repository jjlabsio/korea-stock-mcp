import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 정기보고서 주요정보 - 배당 및 주주 관련 정보
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

// 1. 배당에 관한 사항 API
export const getDividendInfoSchema = commonPeriodicReportSchema;
export type GetDividendInfoParams = z.infer<typeof getDividendInfoSchema>;

export const getDividendInfoResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "법인명",
        se: "구분 (유상증자(주주배정), 전환권행사 등)",
        stock_knd: "주식 종류 (보통주 등)",
        thstrm: "당기",
        frmtrm: "전기",
        lwfr: "전전기",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getDividendInfo(params: GetDividendInfoParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/alotMatter.json", params)
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

// 2. 최대주주 현황 API
export const getMajorShareholderStatusSchema = commonPeriodicReportSchema;
export type GetMajorShareholderStatusParams = z.infer<
  typeof getMajorShareholderStatusSchema
>;

export const getMajorShareholderStatusResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "법인명",
        nm: "성명(명칭)",
        relate: "관계",
        stock_knd: "주식종류",
        bsis_posesn_stock_co: "기초 소유주식수",
        bsis_posesn_stock_qota_rt: "기초 지분율(%)",
        trmend_posesn_stock_co: "기말 소유주식수",
        trmend_posesn_stock_qota_rt: "기말 지분율(%)",
        rm: "비고",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getMajorShareholderStatus(
  params: GetMajorShareholderStatusParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/hyslrSttus.json", params)
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

// 3. 최대주주 변동현황 API
export const getMajorShareholderChangeSchema = commonPeriodicReportSchema;
export type GetMajorShareholderChangeParams = z.infer<
  typeof getMajorShareholderChangeSchema
>;

export const getMajorShareholderChangeResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "법인명",
        change_on: "변동일",
        mxmm_shrholdr_nm: "최대주주명",
        posesn_stock_co: "소유주식수",
        qota_rt: "지분율(%)",
        change_cause: "변동원인",
        rm: "비고",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getMajorShareholderChange(
  params: GetMajorShareholderChangeParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/hyslrChgSttus.json", params)
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

// 4. 소액주주 현황 API
export const getMinorShareholderStatusSchema = commonPeriodicReportSchema;
export type GetMinorShareholderStatusParams = z.infer<
  typeof getMinorShareholderStatusSchema
>;

export const getMinorShareholderStatusResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        se: "구분 (소액주주)",
        shrholdr_co: "주주수",
        shrholdr_tot_co: "전체 주주수",
        shrholdr_rate: "주주 비율",
        hold_stock_co: "보유 주식수",
        stock_tot_co: "총발행 주식수",
        hold_stock_rate: "보유 주식 비율",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getMinorShareholderStatus(
  params: GetMinorShareholderStatusParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/mrhlSttus.json", params)
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
