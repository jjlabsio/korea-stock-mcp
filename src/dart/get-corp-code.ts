import z from "zod";
import { dartRequest } from "../utils/request.js";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";

/**
 * 아래 링크의 API를 사용
 * https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019018
 */

export const getCorpCodeSchema = z.object({
  corp_name: z
    .string()
    .optional()
    .describe("정식 회사 명칭. stock_code와 둘 중 하나만 입력"),
  stock_code: z
    .string()
    .optional()
    .describe(
      "상장회사의 종목코드(6자리). 회사명을 모르거나 검색에 실패한 경우 종목코드로 조회할 수 있습니다.",
    ),
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

interface CorpInfo {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
  modify_date: string;
}

async function fetchCorpList(): Promise<CorpInfo[]> {
  const response = await dartRequest(
    "https://opendart.fss.or.kr/api/corpCode.xml",
  );

  const buffer = Buffer.from(await response.arrayBuffer());

  // ZIP files start with magic bytes PK (0x50 0x4B)
  const isZip = buffer[0] === 0x50 && buffer[1] === 0x4b;

  if (!isZip) {
    const parser = new XMLParser({ parseTagValue: false });
    const parsed = parser.parse(buffer.toString("utf8"));
    const status = parsed?.result?.status;
    const message = parsed?.result?.message;
    throw Error(
      `DART API 오류 (status: ${status ?? "unknown"}): ${message ?? "unknown"}`,
    );
  }
  const zip = new AdmZip(buffer);
  const xmlEntry = zip.getEntry("CORPCODE.xml");

  if (!xmlEntry) {
    throw Error("There is no CORPCODE.xml");
  }

  const xmlContent = xmlEntry.getData().toString("utf-8");
  const parser = new XMLParser({ parseTagValue: false });
  const parsed = parser.parse(xmlContent);

  return parsed.result.list as CorpInfo[];
}

export async function getCorpCode(params: GetCorpCodeSchema) {
  if (!params.corp_name && !params.stock_code) {
    throw Error("corp_name 또는 stock_code 중 하나를 입력해주세요.");
  }

  const companies = await fetchCorpList();

  const matches = params.stock_code
    ? companies.filter((c) => c.stock_code === params.stock_code)
    : companies.filter((c) => c.corp_name === params.corp_name);

  if (matches.length === 0) {
    throw Error(
      "일치하는 회사가 없습니다. 종목코드(stock_code)를 알고 있다면 종목코드로 다시 조회해주세요.",
    );
  }

  return matches;
}
