import z from "zod";
import {
  fetchDisclosureXml,
  parseXml,
  buildToc,
  extractSection,
  MAX_RESULT_BYTES,
} from "./disclosure-xml.js";

export const getDisclosureSchema = z.object({
  rcept_no: z.string().length(14).describe("접수번호"),
  section_id: z
    .string()
    .optional()
    .describe(
      "조회할 섹션 ID. 생략하면 전체 문서를 반환하고, 문서가 크면 목차(type: toc)를 반환합니다. 목차의 섹션 ID를 지정하면 해당 섹션만 반환합니다.",
    ),
});
export type GetDisclosureParams = z.infer<typeof getDisclosureSchema>;

export async function getDisclosure(params: GetDisclosureParams) {
  const xml = await fetchDisclosureXml(params.rcept_no);

  if (params.section_id) {
    return extractSection(xml, params.section_id);
  }

  const parsed = parseXml(xml);
  const jsonStr = JSON.stringify(parsed);
  const sizeBytes = Buffer.byteLength(jsonStr, "utf8");

  if (sizeBytes < MAX_RESULT_BYTES) {
    return parsed;
  }

  return buildToc(xml);
}
