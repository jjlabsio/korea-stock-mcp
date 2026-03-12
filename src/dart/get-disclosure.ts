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
    buildUrl("https://opendart.fss.or.kr/api/document.xml", params),
  );

  const buffer = Buffer.from(await response.arrayBuffer());

  // ZIP files start with magic bytes PK (0x50 0x4B)
  const isZip = buffer[0] === 0x50 && buffer[1] === 0x4b;

  let xmlContent: string;

  if (isZip) {
    const zip = new AdmZip(buffer);
    const xmlEntry = zip
      .getEntries()
      .find((entry) => entry.entryName.endsWith(".xml"));

    if (!xmlEntry) {
      throw Error("There is no xml");
    }

    xmlContent = xmlEntry.getData().toString("utf8");
  } else {
    // DART may return XML directly (e.g., error responses or large disclosures)
    xmlContent = buffer.toString("utf8");
  }

  console.error("xmlContent >>", xmlContent);

  const parser = new XMLParser();
  const parsed = parser.parse(xmlContent);

  return parsed;
}
