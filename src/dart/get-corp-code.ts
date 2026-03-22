import z from "zod";
import { fetchCorpListFromProxy } from "./corp-code-proxy.js";

/**
 * 아래 링크의 API를 사용
 * https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019018
 */

export const getCorpCodeSchema = z.object({
  corp_name: z
    .string()
    .optional()
    .describe(
      "회사 명칭 (한글 또는 영문). 부분 일치 검색을 지원합니다. stock_code와 둘 중 하나만 입력",
    ),
  stock_code: z
    .string()
    .optional()
    .describe(
      "상장회사의 종목코드(6자리). 회사명을 모르거나 검색에 실패한 경우 종목코드로 조회할 수 있습니다.",
    ),
});
type GetCorpCodeSchema = z.infer<typeof getCorpCodeSchema>;

export const getCorpCodeResponseDescription = JSON.stringify({
  result: {
    corp_code: "공시대상회사의 고유번호(8자리)",
    corp_name: "정식회사명",
    corp_eng_name: "영문 회사명",
    stock_code: "상장회사의 종목코드(6자리)",
  },
});

export interface CorpInfo {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
}

function filterCompanies(
  companies: CorpInfo[],
  params: GetCorpCodeSchema,
): CorpInfo[] {
  if (params.stock_code) {
    return companies.filter((c) => c.stock_code === params.stock_code);
  }

  const query = params.corp_name!.toLowerCase();

  // Try exact match first
  const exact = companies.filter(
    (c) =>
      c.corp_name === params.corp_name ||
      c.corp_eng_name.toLowerCase() === query,
  );
  if (exact.length > 0) return exact;

  // Fall back to partial match
  return companies.filter(
    (c) =>
      c.corp_name.includes(params.corp_name!) ||
      c.corp_eng_name.toLowerCase().includes(query),
  );
}

export async function getCorpCode(params: GetCorpCodeSchema) {
  if (!params.corp_name && !params.stock_code) {
    throw Error("corp_name 또는 stock_code 중 하나를 입력해주세요.");
  }

  const companies = await fetchCorpListFromProxy();
  const matches = filterCompanies(companies, params);

  if (matches.length === 0) {
    throw Error(
      "일치하는 회사가 없습니다. 6자리 종목코드(stock_code, 예: 005930)를 알고 있다면 종목코드로 다시 조회해주세요.",
    );
  }

  return matches;
}
