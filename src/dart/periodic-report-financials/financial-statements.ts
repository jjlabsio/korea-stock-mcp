import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 정기보고서 재무정보 - 재무제표
 * 상장법인(유가증권, 코스닥) 및 주요 비상장법인(사업보고서 제출대상 & IFRS 적용)이 제출한 정기보고서 내에 XBRL재무제표 정보를 제공합니다.
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS003
 */

// 공통 재무제표 스키마
const baseFinancialStatementSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bsns_year: z.string().length(4).describe("사업연도(4자리) - 2015년 이후부터 정보제공"),
  reprt_code: z.enum(["11013", "11012", "11014", "11011"]).describe("보고서 코드: 11013(1분기), 11012(반기), 11014(3분기), 11011(사업보고서)"),
});

// 전체 재무제표용 스키마 (fs_div 필수)
const fullFinancialStatementSchema = baseFinancialStatementSchema.extend({
  fs_div: z.enum(["OFS", "CFS"]).describe("개별/연결구분: OFS(재무제표), CFS(연결재무제표)"),
});

// 1. 단일회사 주요계정 API
export const getSingleCompanyKeyAccountsSchema = baseFinancialStatementSchema;
export type GetSingleCompanyKeyAccountsParams = z.infer<typeof getSingleCompanyKeyAccountsSchema>;

export const getSingleCompanyKeyAccountsResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        bsns_year: "사업 연도",
        stock_code: "상장회사의 종목코드(6자리)",
        reprt_code: "보고서 코드",
        account_nm: "계정명",
        fs_div: "개별/연결구분",
        fs_nm: "개별/연결명",
        sj_div: "재무제표구분",
        sj_nm: "재무제표명",
        thstrm_nm: "당기명",
        thstrm_dt: "당기일자",
        thstrm_amount: "당기금액",
        thstrm_add_amount: "당기누적금액",
        frmtrm_nm: "전기명",
        frmtrm_dt: "전기일자",
        frmtrm_amount: "전기금액",
        frmtrm_add_amount: "전기누적금액",
        bfefrmtrm_nm: "전전기명",
        bfefrmtrm_dt: "전전기일자",
        bfefrmtrm_amount: "전전기금액",
        ord: "계정과목 정렬순서",
        currency: "통화 단위",
      },
    ],
  },
});

export async function getSingleCompanyKeyAccounts(params: GetSingleCompanyKeyAccountsParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/fnlttSinglAcnt.json", params)
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

// 2. 다중회사 주요계정 API
export const getMultipleCompanyKeyAccountsSchema = baseFinancialStatementSchema;
export type GetMultipleCompanyKeyAccountsParams = z.infer<typeof getMultipleCompanyKeyAccountsSchema>;

export const getMultipleCompanyKeyAccountsResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        bsns_year: "사업연도(4자리)",
        stock_code: "상장회사의 종목코드(6자리)",
        reprt_code: "보고서 코드",
        account_nm: "계정명",
        fs_div: "개별/연결구분",
        fs_nm: "개별/연결명",
        sj_div: "재무제표구분",
        sj_nm: "재무제표명",
        thstrm_nm: "당기명",
        thstrm_dt: "당기일자",
        thstrm_amount: "당기금액",
        thstrm_add_amount: "당기누적금액",
        frmtrm_nm: "전기명",
        frmtrm_dt: "전기일자",
        frmtrm_amount: "전기금액",
        frmtrm_add_amount: "전기누적금액",
        bfefrmtrm_nm: "전전기명",
        bfefrmtrm_dt: "전전기일자",
        bfefrmtrm_amount: "전전기금액",
        ord: "계정과목 정렬순서",
        currency: "통화 단위",
      },
    ],
  },
});

export async function getMultipleCompanyKeyAccounts(params: GetMultipleCompanyKeyAccountsParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/fnlttMultiAcnt.json", params)
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

// 3. 단일회사 전체 재무제표 API
export const getSingleCompanyFullFinancialStatementsSchema = fullFinancialStatementSchema;
export type GetSingleCompanyFullFinancialStatementsParams = z.infer<typeof getSingleCompanyFullFinancialStatementsSchema>;

export const getSingleCompanyFullFinancialStatementsResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        reprt_code: "보고서 코드",
        bsns_year: "사업 연도",
        corp_code: "공시대상회사의 고유번호(8자리)",
        sj_div: "재무제표구분",
        sj_nm: "재무제표명",
        account_id: "계정ID",
        account_nm: "계정명",
        account_detail: "계정상세",
        thstrm_nm: "당기명",
        thstrm_amount: "당기금액",
        thstrm_add_amount: "당기누적금액",
        frmtrm_nm: "전기명",
        frmtrm_amount: "전기금액",
        frmtrm_q_nm: "전기명(분/반기)",
        frmtrm_q_amount: "전기금액(분/반기)",
        frmtrm_add_amount: "전기누적금액",
        bfefrmtrm_nm: "전전기명",
        bfefrmtrm_amount: "전전기금액",
        ord: "계정과목 정렬순서",
        currency: "통화 단위",
      },
    ],
  },
});

export async function getSingleCompanyFullFinancialStatements(params: GetSingleCompanyFullFinancialStatementsParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json", params)
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