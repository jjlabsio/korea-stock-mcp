import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 주요사항보고서 주요정보 - 해외상장 관련 이벤트
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

// 1. 해외 증권시장 주권등 상장 결정 API
export const getOverseasListingDecisionSchema = commonMaterialEventSchema;
export type GetOverseasListingDecisionParams = z.infer<
  typeof getOverseasListingDecisionSchema
>;

export const getOverseasListingDecisionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        lstprstk_ostk_cnt: "상장예정주식 종류ㆍ수(주)(보통주식)",
        lstprstk_estk_cnt: "상장예정주식 종류ㆍ수(주)(기타주식)",
        tisstk_ostk: "발행주식 총수(주)(보통주식)",
        tisstk_estk: "발행주식 총수(주)(기타주식)",
        psmth_nstk_sl: "공모방법(신주발행 (주))",
        psmth_ostk_sl: "공모방법(구주매출 (주))",
        fdpp: "자금조달(신주발행) 목적",
        lststk_orlst: "상장증권(원주상장 (주))",
        lststk_drlst: "상장증권(DR상장 (주))",
        lstex_nt: "상장거래소(소재국가)",
        lstpp: "해외상장목적",
        lstprd: "상장예정일자",
        bddd: "이사회결의일(결정일)",
        od_a_at_t: "사외이사 참석여부(참석(명))",
        od_a_at_b: "사외이사 참석여부(불참(명))",
        adt_a_atn: "감사(감사위원)참석여부",
      },
    ],
  },
});

export async function getOverseasListingDecision(
  params: GetOverseasListingDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/ovLstDecsn.json", params)
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

// 2. 해외 증권시장 주권등 상장폐지 결정 API
export const getOverseasDelistingDecisionSchema = commonMaterialEventSchema;
export type GetOverseasDelistingDecisionParams = z.infer<
  typeof getOverseasDelistingDecisionSchema
>;

export const getOverseasDelistingDecisionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        dlststk_ostk_cnt: "상장폐지주식 종류ㆍ수(주)(보통주식)",
        dlststk_estk_cnt: "상장폐지주식 종류ㆍ수(주)(기타주식)",
        lstex_nt: "상장거래소(소재국가)",
        dlstrq_prd: "폐지신청예정일자",
        dlst_prd: "폐지(예정)일자",
        dlst_rs: "폐지사유",
        bddd: "이사회결의일(확인일)",
        od_a_at_t: "사외이사 참석여부(참석(명))",
        od_a_at_b: "사외이사 참석여부(불참(명))",
        adt_a_atn: "감사(감사위원)참석여부",
      },
    ],
  },
});

export async function getOverseasDelistingDecision(
  params: GetOverseasDelistingDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/ovDlstDecsn.json", params)
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

// 3. 해외 증권시장 주권등 상장 API
export const getOverseasListingSchema = commonMaterialEventSchema;
export type GetOverseasListingParams = z.infer<typeof getOverseasListingSchema>;

export const getOverseasListingResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        lststk_ostk_cnt: "상장주식 종류 및 수(보통주식(주))",
        lststk_estk_cnt: "상장주식 종류 및 수(기타주식(주))",
        lstex_nt: "상장거래소(소재국가)",
        stk_cd: "종목 명 (code)",
        lstd: "상장일자",
        cfd: "확인일자",
      },
    ],
  },
});

export async function getOverseasListing(params: GetOverseasListingParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/ovLst.json", params)
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

// 4. 해외 증권시장 주권등 상장폐지 API
export const getOverseasDelistingSchema = commonMaterialEventSchema;
export type GetOverseasDelistingParams = z.infer<
  typeof getOverseasDelistingSchema
>;

export const getOverseasDelistingResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        lstex_nt: "상장거래소 및 소재국가",
        dlststk_ostk_cnt: "상장폐지주식의 종류(보통주식(주))",
        dlststk_estk_cnt: "상장폐지주식의 종류(기타주식(주))",
        tredd: "매매거래종료일",
        dlst_rs: "폐지사유",
        cfd: "확인일자",
      },
    ],
  },
});

export async function getOverseasDelisting(params: GetOverseasDelistingParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/ovDlst.json", params)
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
