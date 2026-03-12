import { dartRequest } from "../utils/request.js";
import { buildUrl } from "../utils/url.js";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";

export const MAX_RESULT_BYTES = 1_000_000;
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX_ENTRIES = 3;

interface CacheEntry {
  xml: string;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

function evictExpired(): void {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      cache.delete(key);
    }
  }
}

function evictLRU(): void {
  while (cache.size > CACHE_MAX_ENTRIES) {
    const oldest = [...cache.entries()].sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    )[0];
    if (oldest) cache.delete(oldest[0]);
  }
}

export async function fetchDisclosureXml(rceptNo: string): Promise<string> {
  evictExpired();

  const cached = cache.get(rceptNo);
  if (cached) {
    cache.set(rceptNo, { xml: cached.xml, timestamp: Date.now() });
    return cached.xml;
  }

  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/document.xml", {
      rcept_no: rceptNo,
    })
  );

  const buffer = Buffer.from(await response.arrayBuffer());

  // ZIP files start with magic bytes PK (0x50 0x4B)
  const isZip = buffer[0] === 0x50 && buffer[1] === 0x4b;

  if (!isZip) {
    // DART returns plain XML for error responses
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(buffer.toString("utf8"));
    const status = parsed?.result?.status;
    const message = parsed?.result?.message;
    throw new Error(
      `DART API error: ${status ?? "unknown"} - ${message ?? "unknown"}`
    );
  }

  const zip = new AdmZip(buffer);
  const xmlEntry = zip
    .getEntries()
    .find((entry) => entry.entryName.endsWith(".xml"));

  if (!xmlEntry) {
    throw new Error("ZIP contains no XML file");
  }

  const xml = xmlEntry.getData().toString("utf8");

  cache.set(rceptNo, { xml, timestamp: Date.now() });
  evictLRU();

  return xml;
}

export function parseXml(xml: string): Record<string, unknown> {
  const parser = new XMLParser({ ignoreAttributes: false });
  return parser.parse(xml);
}

export interface TocEntry {
  id: string;
  title: string;
  size_bytes: number;
}

export interface TocResponse {
  type: "toc";
  document_name: string;
  company_name: string;
  total_size_bytes: number;
  sections: TocEntry[];
}

export function buildToc(xml: string): TocResponse {
  // Match TITLE tags that have both ATOC="Y" and AASSOCNOTE (in any order)
  const titleRegex =
    /<TITLE[^>]*?(?=.*?ATOC="Y")(?=.*?AASSOCNOTE="([^"]+)")[^>]*>([^<]*)<\/TITLE>/g;

  const titles: { id: string; title: string; position: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = titleRegex.exec(xml)) !== null) {
    titles.push({
      id: match[1],
      title: match[2].trim(),
      position: match.index,
    });
  }

  const sections: TocEntry[] = titles.map((t, i) => {
    const start = t.position;
    const end = i + 1 < titles.length ? titles[i + 1].position : xml.length;
    return {
      id: t.id,
      title: t.title,
      size_bytes: Buffer.byteLength(xml.slice(start, end), "utf8"),
    };
  });

  // Extract document metadata
  const docNameMatch = xml.match(/<DOCUMENT-NAME[^>]*>([^<]*)<\/DOCUMENT-NAME>/);
  const companyMatch = xml.match(/<COMPANY-NAME[^>]*>([^<]*)<\/COMPANY-NAME>/);

  return {
    type: "toc",
    document_name: docNameMatch?.[1]?.trim() ?? "",
    company_name: companyMatch?.[1]?.trim() ?? "",
    total_size_bytes: Buffer.byteLength(xml, "utf8"),
    sections,
  };
}

const CONTAINER_TAGS = [
  "SECTION-2",
  "SECTION-1",
  "PART",
  "CORRECTION",
  "LIBRARY",
];

export interface SectionResponse {
  type: "section";
  section_id: string;
  content: Record<string, unknown>;
}

export function extractSection(
  xml: string,
  sectionId: string
): SectionResponse | TocResponse {
  // Find the TITLE with matching AASSOCNOTE
  const titlePattern = `AASSOCNOTE="${sectionId}"`;
  const titlePos = xml.indexOf(titlePattern);

  if (titlePos === -1) {
    // Build list of valid IDs for error message
    const ids: string[] = [];
    const idRegex = /AASSOCNOTE="([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = idRegex.exec(xml)) !== null) {
      ids.push(m[1]);
    }
    throw new Error(
      `Section "${sectionId}" not found. Valid IDs: ${ids.join(", ")}`
    );
  }

  // Find the innermost container tag that wraps this TITLE
  let sectionXml: string | null = null;

  for (const tag of CONTAINER_TAGS) {
    // Use space or > after tag name to avoid matching longer tag names
    const openTag = `<${tag}`;
    const openTagCheck = new RegExp(`^<${tag}[\\s>]`);
    const closeTag = `</${tag}>`;

    // Search backwards from titlePos for the opening tag
    let searchPos = titlePos;
    let openPos = -1;
    while (searchPos >= 0) {
      openPos = xml.lastIndexOf(openTag, searchPos);
      if (openPos === -1) break;
      // Verify exact tag match (not a prefix of a longer tag)
      if (!openTagCheck.test(xml.slice(openPos))) {
        searchPos = openPos - 1;
        continue;
      }

      // Find the matching close tag
      // We need to handle nested tags of the same type
      let depth = 0;
      let scanPos = openPos;
      let closePos = -1;

      while (scanPos < xml.length) {
        const nextOpen = xml.indexOf(openTag, scanPos + 1);
        const nextClose = xml.indexOf(closeTag, scanPos + 1);

        if (nextClose === -1) break;

        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth++;
          scanPos = nextOpen;
        } else {
          if (depth === 0) {
            closePos = nextClose + closeTag.length;
            break;
          }
          depth--;
          scanPos = nextClose;
        }
      }

      // Check if this container actually wraps our TITLE
      if (closePos !== -1 && openPos <= titlePos && titlePos < closePos) {
        sectionXml = xml.slice(openPos, closePos);
        break;
      }

      searchPos = openPos - 1;
    }

    if (sectionXml) break;
  }

  if (!sectionXml) {
    throw new Error(`Could not extract container for section "${sectionId}"`);
  }

  const sizeBytes = Buffer.byteLength(sectionXml, "utf8");

  if (sizeBytes < MAX_RESULT_BYTES) {
    return {
      type: "section",
      section_id: sectionId,
      content: parseXml(sectionXml),
    };
  }

  // Section too large — return sub-section TOC
  const subToc = buildToc(sectionXml);

  // Filter out the current section itself from sub-toc
  const subSections = subToc.sections.filter((s) => s.id !== sectionId);

  if (subSections.length === 0) {
    // No sub-sections: leaf node that's still too large.
    // Strip XML tags and return plain text truncated to fit within 1MB.
    const plainText = sectionXml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const encoder = new TextEncoder();
    const encoded = encoder.encode(plainText);
    // Reserve space for JSON wrapper (~200 bytes)
    const maxTextBytes = MAX_RESULT_BYTES - 200;
    const truncated = encoded.byteLength > maxTextBytes
      ? new TextDecoder().decode(encoded.slice(0, maxTextBytes))
      : plainText;
    return {
      type: "section",
      section_id: sectionId,
      content: { _truncated: true, text: truncated },
    };
  }

  return {
    type: "toc",
    document_name: "",
    company_name: "",
    total_size_bytes: sizeBytes,
    sections: subSections,
  };
}
