// scripts/generate-corp-codes.ts
import { XMLParser } from "fast-xml-parser";
import AdmZip from "adm-zip";

interface CompactCorpInfo {
  c: string; // corp_code
  n: string; // corp_name
  e?: string; // corp_eng_name (omitted if empty)
  s?: string; // stock_code (omitted if empty)
}

async function main() {
  const apiKey = process.env.DART_API_KEY;
  if (!apiKey) {
    console.error("DART_API_KEY is required");
    process.exit(1);
  }

  const url = `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`DART API HTTP error: ${response.status}`);
    process.exit(1);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  const isZip = buffer[0] === 0x50 && buffer[1] === 0x4b;
  if (!isZip) {
    const parser = new XMLParser({ parseTagValue: false });
    const parsed = parser.parse(buffer.toString("utf8"));
    console.error(`DART API error: ${parsed?.result?.message}`);
    process.exit(1);
  }

  const zip = new AdmZip(buffer);
  const xmlEntry = zip.getEntry("CORPCODE.xml");
  if (!xmlEntry) {
    console.error("No CORPCODE.xml in ZIP");
    process.exit(1);
  }

  const xmlContent = xmlEntry.getData().toString("utf-8");
  const parser = new XMLParser({ parseTagValue: false });
  const parsed = parser.parse(xmlContent);
  const companies = parsed.result.list as Array<{
    corp_code: string;
    corp_name: string;
    corp_eng_name: string;
    stock_code: string;
    modify_date: string;
  }>;

  const result: CompactCorpInfo[] = companies.map((c) => {
    const entry: CompactCorpInfo = { c: c.corp_code, n: c.corp_name };
    if (c.corp_eng_name) entry.e = c.corp_eng_name;
    if (c.stock_code) entry.s = c.stock_code;
    return entry;
  });

  const output = JSON.stringify(result);
  process.stdout.write(output);

  const listed = result.filter((c) => c.s).length;
  console.error(`Generated ${result.length} entries (${listed} listed)`);
}

main();
