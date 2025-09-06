import z from "zod";
import { dartRequest } from "../../common/request.js";
import AdmZip from "adm-zip";
import { parseStringPromise } from "xml2js";

export const getCorpCodeSchema = z.object({
  corp_name: z.string().describe("정식 회사 명칭"),
});
type GetCorpCodeSchema = z.infer<typeof getCorpCodeSchema>;

export async function getCorpCode(params: GetCorpCodeSchema) {
  const response = await dartRequest(
    "https://opendart.fss.or.kr/api/corpCode.xml"
  );

  const buffer = Buffer.from(await response.arrayBuffer());
  const zip = new AdmZip(buffer);
  const xmlEntry = zip.getEntry("CORPCODE.xml");

  if (!xmlEntry) {
    throw Error("There is no CORPCODE.xml");
  }

  const xmlContent = xmlEntry.getData().toString("utf-8");

  const parsed = await parseStringPromise(xmlContent, { explicitArray: false });
  const companies = parsed.result.list as {
    corp_code: string;
    corp_name: string;
    stock_code: string;
  }[];

  const matches = companies.filter(
    ({ corp_name }) => corp_name === params.corp_name
  );

  if (matches.length === 0) {
    throw Error("일치하는 회사가 없습니다.");
  }

  return matches[0];
}
