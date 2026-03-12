import z from "zod";
import { fetchDisclosureXml, extractSection } from "./disclosure-xml.js";

export const getDisclosureSectionSchema = z.object({
  rcept_no: z.string().length(14).describe("접수번호"),
  section_id: z
    .string()
    .describe("get_disclosure에서 반환된 목차의 섹션 ID"),
});
export type GetDisclosureSectionParams = z.infer<
  typeof getDisclosureSectionSchema
>;

export async function getDisclosureSection(
  params: GetDisclosureSectionParams
) {
  const xml = await fetchDisclosureXml(params.rcept_no);
  return extractSection(xml, params.section_id);
}
