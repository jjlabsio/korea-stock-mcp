import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 정기보고서 재무정보 - XBRL택사노미재무제표양식
 * 금융감독원 회계포탈에서 제공하는 IFRS 기반 XBRL 재무제표 공시용 표준계정과목체계(계정과목) 을 제공합니다.
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS003
 */

// XBRL 택사노미 재무제표양식 스키마
export const getXBRLTaxonomySchema = z.object({
  sj_div: z
    .enum([
      // 재무상태표 (Balance Sheet)
      "BS1",
      "BS2",
      "BS3",
      "BS4",
      // 별개의 손익계산서 (Income Statement)
      "IS1",
      "IS2",
      "IS3",
      "IS4",
      // 포괄손익계산서 (Comprehensive Income Statement)
      "CIS1",
      "CIS2",
      "CIS3",
      "CIS4",
      // 단일 포괄손익계산서 (Single Comprehensive Income Statement)
      "DCIS1",
      "DCIS2",
      "DCIS3",
      "DCIS4",
      "DCIS5",
      "DCIS6",
      "DCIS7",
      "DCIS8",
      // 현금흐름표 (Cash Flow Statement)
      "CF1",
      "CF2",
      "CF3",
      "CF4",
      // 자본변동표 (Statement of Changes in Equity)
      "SCE1",
      "SCE2",
    ])
    .describe(
      "재무제표구분: BS1(재무상태표-연결-유동/비유동법), BS2(재무상태표-개별-유동/비유동법), IS1(별개의 손익계산서-연결-기능별분류), CIS1(포괄손익계산서-연결-세후), DCIS1(단일 포괄손익계산서-연결-기능별분류-세후포괄손익), CF1(현금흐름표-연결-직접법), SCE1(자본변동표-연결) 등"
    ),
});

export type GetXBRLTaxonomyParams = z.infer<typeof getXBRLTaxonomySchema>;

export const getXBRLTaxonomyResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        sj_div: "재무제표구분",
        account_id: "계정 고유명칭",
        account_nm: "계정명",
        bsns_de: "적용 기준일",
        label_kor: "한글 출력명",
        label_eng: "영문 출력명",
        data_tp:
          "데이타 유형설명 - text block : 제목 - Text : Text - yyyy-mm-dd : Date - X : Monetary Value - (X): Monetary Value(Negative) - X.XX : Decimalized Value - Shares : Number of shares (주식 수) - For each : 공시된 항목이 전후로 반복적으로 공시될 경우 사용 - 공란 : 입력 필요 없음",
        ifrs_ref: "IFRS Reference",
      },
    ],
  },
});

export async function getXBRLTaxonomy(params: GetXBRLTaxonomyParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/xbrlTaxonomy.json", params)
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
