import z from "zod";
import { krxRequest } from "../utils/request.js";
import { buildUrl } from "../utils/url.js";
import { koreaMarket } from "../utils/const.js";

const krxTradeInfoUrl: Record<(typeof koreaMarket)[number], string> = {
  KOSPI: "http://data-dbg.krx.co.kr/svc/apis/sto/stk_bydd_trd",
  KOSDAQ: "http://data-dbg.krx.co.kr/svc/apis/sto/ksq_bydd_trd",
  KONEX: "http://data-dbg.krx.co.kr/svc/apis/sto/knx_bydd_trd",
};

export const getTradeInfoSchema = z.object({
  basDd: z.string().length(8).describe("기준일자(YYYYMMDD)"),
  market: z.enum(koreaMarket).describe("상장된 주식시장 종류"),
  codeList: z
    .array(z.string())
    .nonempty()
    .describe("데이터를 가져올 종목들의 종목코드의 배열"),
});
export type GetTradeInfoParams = z.infer<typeof getTradeInfoSchema>;

export interface TradeInfo {
  OutBlock_1: {
    /** 기준일자 (BAS_DD) */
    BAS_DD: string;
    /** 종목코드 (ISU_CD) */
    ISU_CD: string;
    /** 종목명 (ISU_NM) */
    ISU_NM: string;
    /** 시장구분 (MKT_NM) */
    MKT_NM: string;
    /** 소속부 (SECT_TP_NM) */
    SECT_TP_NM: string;
    /** 종가 (TDD_CLSPRC) */
    TDD_CLSPRC: string;
    /** 대비 (CMPPREVDD_PRC) */
    CMPPREVDD_PRC: string;
    /** 등락률 (FLUC_RT) */
    FLUC_RT: string;
    /** 시가 (TDD_OPNPRC) */
    TDD_OPNPRC: string;
    /** 고가 (TDD_HGPRC) */
    TDD_HGPRC: string;
    /** 저가 (TDD_LWPRC) */
    TDD_LWPRC: string;
    /** 거래량 (ACC_TRDVOL) */
    ACC_TRDVOL: string;
    /** 거래대금 (ACC_TRDVAL) */
    ACC_TRDVAL: string;
    /** 시가총액 (MKTCAP) */
    MKTCAP: string;
    /** 상장주식수 (LIST_SHRS) */
    LIST_SHRS: string;
  }[];
}

export async function getTradeInfo(params: GetTradeInfoParams) {
  const { basDd, market, codeList } = params;

  const url = krxTradeInfoUrl[market];
  const response = await krxRequest(buildUrl(url, { basDd }));

  const data = (await response.json()) as TradeInfo;

  const filtered = data.OutBlock_1.filter((stock) =>
    codeList.includes(stock.ISU_CD)
  );

  return filtered;
}
