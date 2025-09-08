import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 지분공시 종합정보 - 임원ㆍ주요주주 소유보고
 * 임원ㆍ주요주주특정증권등 소유상황보고서 내에 임원ㆍ주요주주 소유보고 정보를 제공합니다.
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS004
 */

// 임원ㆍ주요주주 소유보고 스키마
export const getExecutiveOwnershipSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
});

export type GetExecutiveOwnershipParams = z.infer<typeof getExecutiveOwnershipSchema>;

export const getExecutiveOwnershipResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        rcept_dt: "공시 접수일자(YYYY-MM-DD)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        repror: "보고자명",
        isu_exctv_rgist_at: "발행 회사 관계 임원(등기여부)",
        isu_exctv_ofcps: "발행 회사 관계 임원 직위",
        isu_main_shrholdr: "발행 회사 관계 주요 주주",
        sp_stock_lmp_cnt: "특정 증권 등 소유 수",
        sp_stock_lmp_irds_cnt: "특정 증권 등 소유 증감 수",
        sp_stock_lmp_rate: "특정 증권 등 소유 비율",
        sp_stock_lmp_irds_rate: "특정 증권 등 소유 증감 비율",
      },
    ],
  },
});

export async function getExecutiveOwnership(params: GetExecutiveOwnershipParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/elestock.json", params)
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