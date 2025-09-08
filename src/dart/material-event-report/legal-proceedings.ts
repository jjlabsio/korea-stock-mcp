import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 주요사항보고서 주요정보 - 법적 절차 관련 이벤트
 * 아래 링크들의 API를 사용
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS005
 */

// 공통 스키마 - 모든 주요사항보고서 API에서 사용
const commonMaterialEventSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bgn_de: z.string().length(8).describe("시작일(최초접수일)(YYYYMMDD) - 2015년 이후부터 정보제공"),
  end_de: z.string().length(8).describe("종료일(최초접수일)(YYYYMMDD) - 2015년 이후부터 정보제공"),
});

// 1. 소송 등의 제기 API
export const getLegalProceedingsFilingSchema = commonMaterialEventSchema;
export type GetLegalProceedingsFilingParams = z.infer<typeof getLegalProceedingsFilingSchema>;

export const getLegalProceedingsFilingResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        icnm: "사건의 명칭",
        ac_ap: "원고ㆍ신청인",
        rq_cn: "청구내용",
        cpct: "관할법원",
        ft_ctp: "향후대책",
        lgd: "제기일자",
        cfd: "확인일자",
      },
    ],
  },
});

export async function getLegalProceedingsFiling(params: GetLegalProceedingsFilingParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/lwstLg.json", params)
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