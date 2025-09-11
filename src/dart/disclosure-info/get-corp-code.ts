import z from "zod";
import { dartRequest } from "../../common/request.js";
import AdmZip from "adm-zip";
import { parseStringPromise } from "xml2js";

/**
 * 아래 링크의 API를 사용
 * https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019018
 */

export const getCorpCodeSchema = z.object({
  corp_name: z.string().describe("정식 회사 명칭"),
});
type GetCorpCodeSchema = z.infer<typeof getCorpCodeSchema>;

export const getCorpCodeResponseDescription = JSON.stringify({
  result: {
    corp_code: "공시대상회사의 고유번호(8자리)",
    corp_name: "정식회사명",
    corp_eng_name: "영문정식회사명칭",
    stock_code: "상장회사의 종목코드(6자리)",
    modify_date: "기업개황정보 최종변경일자(YYYYMMDD)",
  },
});

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
    corp_eng_name: string;
    stock_code: string;
    modify_date: string;
  }[];

  const matches = companies.filter(
    ({ corp_name }) => corp_name === params.corp_name
  );

  if (matches.length === 0) {
    throw Error("일치하는 회사가 없습니다.");
  }

  return matches;
}
