import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 지분공시 종합정보 - 대량보유 상황보고
 * 주식등의 대량보유상황보고서 내에 대량보유 상황보고 정보를 제공합니다.
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS004
 */

// 대량보유 상황보고 스키마
export const getMajorShareholdingSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
});

export type GetMajorShareholdingParams = z.infer<typeof getMajorShareholdingSchema>;

export const getMajorShareholdingResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        rcept_dt: "공시 접수일자(YYYYMMDD)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "공시대상회사의 종목명(상장사) 또는 법인명(기타법인)",
        report_tp: "주식등의 대량보유상황 보고구분",
        repror: "대표보고자",
        stkqy: "보유주식등의 수",
        stkqy_irds: "보유주식등의 증감",
        stkrt: "보유비율",
        stkrt_irds: "보유비율 증감",
        ctr_stkqy: "주요체결 주식등의 수",
        ctr_stkrt: "주요체결 보유비율",
        report_resn: "보고사유",
      },
    ],
  },
});

export async function getMajorShareholding(params: GetMajorShareholdingParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/majorstock.json", params)
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