import z from "zod";
import { krxRequest } from "../utils/request.js";
import { buildUrl } from "../utils/url.js";
import { koreaMarket } from "../utils/const.js";

const krxBaseInfoUrl: Record<(typeof koreaMarket)[number], string> = {
  KOSPI: "http://data-dbg.krx.co.kr/svc/apis/sto/stk_isu_base_info",
  KOSDAQ: "http://data-dbg.krx.co.kr/svc/apis/sto/ksq_isu_base_info",
  KONEX: "http://data-dbg.krx.co.kr/svc/apis/sto/knx_isu_base_info",
};

export const getBaseInfoSchema = z.object({
  basDd: z.string().length(8).describe("기준일자(YYYYMMDD)"),
  market: z.enum(koreaMarket).describe("상장된 주식시장 종류"),
});
export type GetBaseInfoParams = z.infer<typeof getBaseInfoSchema>;

export interface BaseInfo {
  OutBlock_1: {
    /** 표준코드 (ISU_CD) */
    ISU_CD: string;
    /** 단축코드 (ISU_SRT_CD) */
    ISU_SRT_CD: string;
    /** 한글 종목명 (ISU_NM) */
    ISU_NM: string;
    /** 한글 종목약명 (ISU_ABBRV) */
    ISU_ABBRV: string;
    /** 영문 종목명 (ISU_ENG_NM) */
    ISU_ENG_NM: string;
    /** 상장일 (LIST_DD) - YYYYMMDD 형식 */
    LIST_DD: string;
    /** 시장구분 (MKT_TP_NM) */
    MKT_TP_NM: string;
    /** 증권구분 (SECUGRP_NM) */
    SECUGRP_NM: string;
    /** 소속부 (SECT_TP_NM) */
    SECT_TP_NM: string;
    /** 주식종류 (KIND_STKCERT_TP_NM) */
    KIND_STKCERT_TP_NM: string;
    /** 액면가 (PARVAL) */
    PARVAL: string;
    /** 상장주식수 (LIST_SHRS) */
    LIST_SHRS: string;
  }[];
}

export async function getBaseInfo(params: GetBaseInfoParams) {
  const { basDd, market } = params;

  const url = krxBaseInfoUrl[market];
  const response = await krxRequest(buildUrl(url, { basDd }));

  const data = (await response.json()) as BaseInfo;

  return data;
}
