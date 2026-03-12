import z from "zod";
import { dartRequest } from "../utils/request.js";
import { buildUrl } from "../utils/url.js";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";

export const getDisclosureSchema = z.object({
  rcept_no: z.string().length(14).describe("접수번호"),
});
export type GetDisclosureParams = z.infer<typeof getDisclosureSchema>;

export async function getDisclosure(params: GetDisclosureParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/document.xml", params)
  );

  const buffer = Buffer.from(await response.arrayBuffer());
  const zip = new AdmZip(buffer);
  const xmlEntry = zip
    .getEntries()
    .find((entry) => entry.entryName.endsWith(".xml"));

  if (!xmlEntry) {
    throw Error("There is no xml");
  }

  const xmlContent = xmlEntry.getData().toString("utf8");
  console.error("xmlContent >>", xmlContent);

  const parser = new XMLParser();
  const parsed = parser.parse(xmlContent);

  return parsed;
}
