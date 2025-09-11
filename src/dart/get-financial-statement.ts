import z from "zod";
import { dartRequest } from "../common/request.js";
import { buildUrl } from "../common/utils.js";

const statementName = [
  "재무상태표",
  "포괄손익계산서",
  "자본변동표",
  "현금흐름표",
] as const;

export const getFinancialStatementSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bsns_year: z
    .string()
    .length(4)
    .describe("사업연도(4자리) - 2015년 이후부터 정보제공"),
  reprt_code: z
    .enum(["11013", "11012", "11014", "11011"])
    .describe(
      "보고서 코드: 11013(1분기), 11012(반기), 11014(3분기), 11011(사업보고서)"
    ),
  fs_div: z
    .enum(["OFS", "CFS"])
    .describe("개별/연결구분: OFS(재무제표), CFS(연결재무제표)"),
  sj_nm: z // dart api가 아닌 데이터 전처리를 위해 필요한 필드
    .enum(statementName)
    .optional()
    .describe(
      "재무상태표, 포괄손익계산서, 자본변동표, 현금흐름표 중 하나. 없으면 전체조회"
    ),
});
export type GetFinancialStatementParams = z.infer<
  typeof getFinancialStatementSchema
>;

export interface FinancialStatementItem {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  sj_div: string;
  sj_nm: string;
  account_id: string;
  account_nm: string;
  account_detail: string;
  thstrm_nm: string;
  thstrm_amount: string;
  thstrm_add_amount: string;
  frmtrm_nm: string;
  frmtrm_amount: string;
  frmtrm_q_nm: string;
  frmtrm_q_amount: string;
  frmtrm_add_amount: string;
  bfefrmtrm_nm: string;
  bfefrmtrm_amount: string;
  ord: string;
  currency: string;
}

export const getFinancialStatementResponseDescription = JSON.stringify({
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

export async function getFinancialStatement(
  params: GetFinancialStatementParams
) {
  const { sj_nm, ...args } = params;
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/fnlttSinglAcntAll.json", args)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("조회된 데이타가 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  // sj_nm이 존재할 경우 필요한 재무제표만 추출
  if (!sj_nm) {
    return data;
  }

  const parsed = data.list as FinancialStatementItem[];
  const filtered = parsed.filter((item) => item.sj_nm === sj_nm);

  return filtered;
}
