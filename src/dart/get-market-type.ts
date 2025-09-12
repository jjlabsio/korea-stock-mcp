import z from "zod";
import { dartRequest } from "../utils/request.js";
import { buildUrl } from "../utils/url.js";

export const getMarketTypeSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
});
type GetMarketTypeParams = z.infer<typeof getMarketTypeSchema>;

export async function getMarketType(params: GetMarketTypeParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/company.json", params)
  );
  const data = await response.json();

  const parsed = {
    market: data.corp_cls,
  };

  return parsed;
}
