import z from "zod";
import { dartRequest } from "../common/request.js";
import AdmZip from "adm-zip";
import { buildUrl } from "../common/utils.js";
import { XMLParser } from "fast-xml-parser";

export const getFinancialStatementSchema = z.object({
  rcept_no: z
    .string()
    .length(14)
    .describe(
      "접수번호 ※ 조회방법 : 공시검색API 호출 > 응답요청 값 rcept_no 추출"
    ),
  reprt_code: z
    .enum(["11013", "11012", "11014", "11011"])
    .describe(
      "보고서 코드: 11013(1분기), 11012(반기), 11014(3분기), 11011(사업보고서)"
    ),
});
type GetFinancialStatementSchema = z.infer<typeof getFinancialStatementSchema>;

export async function getFinancialStatement(
  params: GetFinancialStatementSchema
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/fnlttXbrl.xml", params)
  );

  const buffer = Buffer.from(await response.arrayBuffer());
  const zip = new AdmZip(buffer);

  /**
   * zip.getEntries().map(el => el.entryName)
   * [
      "entity01190568_2023-12-31.xbrl",
      "entity01190568_2023-12-31.xsd",
      "entity01190568_2023-12-31_def.xml",
      "entity01190568_2023-12-31_cal.xml",
      "entity01190568_2023-12-31_pre.xml",
      "entity01190568_2023-12-31_lab-ko.xml",
      "entity01190568_2023-12-31_lab-en.xml"
    ]
   */

  const xbrlEntry = zip
    .getEntries()
    .find((entry) => entry.entryName.endsWith(".xbrl"));

  if (!xbrlEntry) {
    throw Error("There is no xbrl entry");
  }

  const xmlContent = xbrlEntry.getData().toString("utf-8");

  const parser = new XMLParser();
  const parsed = parser.parse(xmlContent);

  return parsed;
}
