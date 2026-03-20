import z from "zod";
import { dartRequest } from "../utils/request.js";
import { buildUrl } from "../utils/url.js";

export const getMarketTypeSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
});
type GetMarketTypeParams = z.infer<typeof getMarketTypeSchema>;

export async function getMarketType(params: GetMarketTypeParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/company.json", params),
  );
  const data = await response.json();

  if (data.status && data.status !== "000") {
    throw new Error(`DART API 오류 (status: ${data.status}): ${data.message}`);
  }

  return { market: data.corp_cls };
}
