import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 아래 링크의 API를 사용
 * https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019001
 */

export const getDisclosureListSchema = z.object({
  corp_code: z
    .string()
    .length(8)
    .optional()
    .describe("공시대상회사의 고유번호(8자리)"),
  bgn_de: z
    .string()
    .length(8)
    .optional()
    .describe("검색시작 접수일자(YYYYMMDD) 1) 기본값 : 종료일(end_de)"),
  end_de: z
    .string()
    .length(8)
    .optional()
    .describe("검색종료 접수일자(YYYYMMDD) 1) 기본값 : 당일"),
  last_reprt_at: z
    .string()
    .length(1)
    .optional()
    .describe(
      "최종보고서 검색여부 (Y 또는 N) 1) 기본값 : N(정정이 있는 경우 최종정정만 검색)"
    ),
  pblntf_ty: z
    .string()
    .length(1)
    .optional()
    .describe(
      "공시유형 // A : 정기공시, B : 주요사항보고, C : 발행공시, D : 지분공시, E : 기타공시, F : 외부감사관련, G : 펀드공시, H : 자산유동화, I : 거래소공시, J : 공정위공시"
    ),
  pblntf_detail_ty: z.string().length(4).optional().describe("공시상세유형"),
  corp_cls: z
    .string()
    .length(1)
    .optional()
    .describe(
      "법인구분 (Y: 유가증권시장, K: 코스닥, N: 코넥스, E: 기타) ※ 없으면 전체조회, 복수조건 불가"
    ),
  sort: z
    .string()
    .length(4)
    .optional()
    .describe(
      "정렬 (date: 접수일자, crp: 회사명, rpt: 보고서명) ※ 기본값 : date"
    ),
  sort_mth: z
    .string()
    .length(4)
    .optional()
    .describe("정렬방법 (asc: 오름차순, desc: 내림차순) ※ 기본값 : desc"),
  page_no: z
    .string()
    .length(5)
    .optional()
    .describe("페이지 번호(1~n) 기본값 : 1"),
  page_count: z
    .string()
    .length(3)
    .optional()
    .describe("페이지당 건수(1~100) 기본값 : 10, 최대값 : 100"),
});
export type GetDisclosureListParams = z.infer<typeof getDisclosureListSchema>;

export const getDisclosureListResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    page_no: "페이지 번호",
    page_count: "페이지 별 건수",
    total_count: "총 건수",
    total_page: "총 페이지 수",
    list: [
      {
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_name: "공시대상회사의 종목명(상장사) 또는 법인명(기타법인)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        stock_code: "상장회사의 종목코드(6자리)",
        report_nm: `공시구분+보고서명+기타정보
[기재정정] : 본 보고서명으로 이미 제출된 보고서의 기재내용이 변경되어 제출된 것임
[첨부정정] : 본 보고서명으로 이미 제출된 보고서의 첨부내용이 변경되어 제출된 것임
[첨부추가] : 본 보고서명으로 이미 제출된 보고서의 첨부서류가 추가되어 제출된 것임
[변경등록] : 본 보고서명으로 이미 제출된 보고서의 유동화계획이 변경되어 제출된 것임
[연장결정] : 본 보고서명으로 이미 제출된 보고서의 신탁계약이 연장되어 제출된 것임
[발행조건확정] : 본 보고서명으로 이미 제출된 보고서의 유가증권 발행조건이 확정되어 제출된 것임
[정정명령부과] : 본 보고서에 대하여 금융감독원이 정정명령을 부과한 것임
[정정제출요구] : 본 보고서에 대하여 금융감독원이 정정제출요구을 부과한 것임`,
        rcept_no: `접수번호(14자리)
※ 공시뷰어 연결에 이용예시
- PC용 : https://dart.fss.or.kr/dsaf001/main.do?rcpNo=접수번호`,
        flr_nm: "공시 제출인명",
        rcept_dt: "공시 접수일자(YYYYMMDD)",
        rm: `조합된 문자로 각각은 아래와 같은 의미가 있음
유 : 본 공시사항은 한국거래소 유가증권시장본부 소관임
코 : 본 공시사항은 한국거래소 코스닥시장본부 소관임
채 : 본 공시사항은 한국거래소 채권상장법인 공시사항임
넥 : 본 공시사항은 한국거래소 코넥스시장 소관임
공 : 본 공시사항은 공정거래위원회 소관임
연 : 본 보고서에는 연결부분이 포함되어 있음
정 : 정정신고가 있음을 나타냄
철 : 철회된 보고서임`,
      },
    ],
  },
});

export async function getDisclosureList(params: GetDisclosureListParams) {
  console.error("params >> ", params);
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/list.json", params)
  );
  const data = await response.json();

  return data;
}
