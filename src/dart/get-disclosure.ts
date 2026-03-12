import z from "zod";
import {
  fetchDisclosureXml,
  parseXml,
  buildToc,
  MAX_RESULT_BYTES,
} from "./disclosure-xml.js";

export const getDisclosureSchema = z.object({
  rcept_no: z.string().length(14).describe("접수번호"),
});
export type GetDisclosureParams = z.infer<typeof getDisclosureSchema>;

export async function getDisclosure(params: GetDisclosureParams) {
  const xml = await fetchDisclosureXml(params.rcept_no);

  if (Buffer.byteLength(xml, "utf8") >= MAX_RESULT_BYTES) {
    return buildToc(xml);
  }

  return parseXml(xml);
}
