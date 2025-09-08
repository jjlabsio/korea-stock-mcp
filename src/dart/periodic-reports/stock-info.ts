import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 정기보고서 주요정보 - 주식 관련 정보
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

// 1. 증자(감자) 현황 API
export const getStockIncreaseDecreaseStatusSchema = commonPeriodicReportSchema;
export type GetStockIncreaseDecreaseStatusParams = z.infer<
  typeof getStockIncreaseDecreaseStatusSchema
>;

export const getStockIncreaseDecreaseStatusResponseDescription = JSON.stringify(
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
          isu_dcrs_de: "주식발행 감소일자",
          isu_dcrs_stle: "발행 감소 형태",
          isu_dcrs_stock_knd: "발행 감소 주식 종류",
          isu_dcrs_qy: "발행 감소 수량",
          isu_dcrs_mstvdv_fval_amount: "발행 감소 주당 액면 가액",
          isu_dcrs_mstvdv_amount: "발행 감소 주당 가액",
          stlm_dt: "결산기준일 (YYYY-MM-DD)",
        },
      ],
    },
  }
);

export async function getStockIncreaseDecreaseStatus(
  params: GetStockIncreaseDecreaseStatusParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/irdsSttus.json", params)
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

// 2. 자기주식 취득 및 처분 현황 API
export const getTreasuryStockStatusSchema = commonPeriodicReportSchema;
export type GetTreasuryStockStatusParams = z.infer<
  typeof getTreasuryStockStatusSchema
>;

export const getTreasuryStockStatusResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "법인명",
        acqs_mth1: "취득방법 대분류 (배당가능이익범위 이내 취득, 기타취득, 총계 등)",
        acqs_mth2: "취득방법 중분류 (직접취득, 신탁계약에 의한취득, 기타취득, 총계 등)",
        acqs_mth3: "취득방법 소분류 (장내직접취득, 장외직접취득, 공개매수, 주식매수청구권행사, 수탁자보유물량, 현물보유량, 기타취득, 소계, 총계 등)",
        stock_knd: "주식 종류 (보통주, 우선주 등)",
        bsis_qy: "기초 수량",
        change_qy_acqs: "변동 수량 취득",
        change_qy_dsps: "변동 수량 처분",
        change_qy_incnr: "변동 수량 소각",
        trmend_qy: "기말 수량",
        rm: "비고",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getTreasuryStockStatus(
  params: GetTreasuryStockStatusParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/tesstkAcqsDspsSttus.json", params)
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

// 3. 주식의 총수 현황 API
export const getStockTotalStatusSchema = commonPeriodicReportSchema;
export type GetStockTotalStatusParams = z.infer<
  typeof getStockTotalStatusSchema
>;

export const getStockTotalStatusResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        se: "구분",
        isu_stock_totqy: "발행할 주식의 총수",
        now_to_isu_stock_totqy: "현재까지 발행한 주식의 총수",
        now_to_dcrs_stock_totqy: "현재까지 감소한 주식의 총수",
        redc: "감자",
        profit_incnr: "이익소각",
        rdmstk_repy: "상환주식의 상환",
        etc: "기타",
        istc_totqy: "발행주식의 총수",
        tesstk_co: "자기주식수",
        distb_stock_co: "유통주식수",
        stlm_dt: "결산기준일 (YYYY-MM-DD)",
      },
    ],
  },
});

export async function getStockTotalStatus(params: GetStockTotalStatusParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/stockTotqySttus.json", params)
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
