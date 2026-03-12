# Large Disclosure Handling Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Handle DART disclosures that exceed the MCP 1MB tool result limit by returning a table of contents for large documents, with a new tool to fetch individual sections.

**Architecture:** Modify `get_disclosure` to check response size and return a TOC for documents >= 1MB. Add `get_disclosure_section` tool that extracts individual sections from the XML by `AASSOCNOTE` ID. Add in-memory LRU cache to avoid redundant DART API calls when fetching multiple sections.

**Tech Stack:** TypeScript, fast-xml-parser, adm-zip, zod, @modelcontextprotocol/sdk

**Spec:** `docs/superpowers/specs/2026-03-12-large-disclosure-handling-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/dart/disclosure-xml.ts` | Create | XML fetching, ZIP extraction, caching, section extraction, TOC building |
| `src/dart/get-disclosure.ts` | Modify | Use `disclosure-xml.ts`, size-adaptive response |
| `src/dart/get-disclosure-section.ts` | Create | New tool: fetch individual section by ID |
| `src/dart/index.ts` | Modify | Export new tool |
| `src/index.ts` | Modify | Register new tool, update description |

---

## Task 1: Create `disclosure-xml.ts` — XML fetching, caching, and section utilities

This is the core module. It handles: fetching the ZIP from DART, extracting XML, caching, building TOC, and extracting sections.

**Files:**
- Create: `src/dart/disclosure-xml.ts`

- [ ] **Step 1: Create the file with constants and cache**

```ts
// src/dart/disclosure-xml.ts
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
```

- [ ] **Step 2: Add `fetchDisclosureXml` function**

```ts
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
```

- [ ] **Step 3: Add `parseXml` helper**

```ts
export function parseXml(xml: string): Record<string, unknown> {
  const parser = new XMLParser({ ignoreAttributes: false });
  return parser.parse(xml);
}
```

- [ ] **Step 4: Add `buildToc` function**

Scans the XML string for TITLE tags with `ATOC="Y"` and `AASSOCNOTE`, computes each section's byte size.

```ts
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
```

- [ ] **Step 5: Add `extractSection` function**

Extracts a section from raw XML by finding the TITLE with matching AASSOCNOTE and its parent container.

```ts
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
```

- [ ] **Step 6: Verify the file compiles**

Run: `npx tsc --noEmit`
Expected: No errors related to `disclosure-xml.ts`

- [ ] **Step 7: Commit**

```bash
git add src/dart/disclosure-xml.ts
git commit -m "feat: add disclosure XML utilities (fetch, cache, TOC, section extraction)"
```

---

## Task 2: Modify `get-disclosure.ts` — size-adaptive response

**Files:**
- Modify: `src/dart/get-disclosure.ts`

Note: This rewrite removes the `console.error("xmlContent >>", xmlContent)` debug log from the original file.

- [ ] **Step 1: Rewrite `get-disclosure.ts`**

```ts
// src/dart/get-disclosure.ts
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
  const parsed = parseXml(xml);
  const jsonStr = JSON.stringify(parsed);
  const sizeBytes = Buffer.byteLength(jsonStr, "utf8");

  if (sizeBytes < MAX_RESULT_BYTES) {
    return parsed;
  }

  return buildToc(xml);
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/dart/get-disclosure.ts
git commit -m "feat: add size-adaptive response to get_disclosure"
```

---

## Task 3: Create `get-disclosure-section.ts` — new tool

**Files:**
- Create: `src/dart/get-disclosure-section.ts`

- [ ] **Step 1: Create the file**

```ts
// src/dart/get-disclosure-section.ts
import z from "zod";
import { fetchDisclosureXml, extractSection } from "./disclosure-xml.js";

export const getDisclosureSectionSchema = z.object({
  rcept_no: z.string().length(14).describe("접수번호"),
  section_id: z
    .string()
    .describe("get_disclosure에서 반환된 목차의 섹션 ID"),
});
export type GetDisclosureSectionParams = z.infer<
  typeof getDisclosureSectionSchema
>;

export async function getDisclosureSection(
  params: GetDisclosureSectionParams
) {
  const xml = await fetchDisclosureXml(params.rcept_no);
  return extractSection(xml, params.section_id);
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/dart/get-disclosure-section.ts
git commit -m "feat: add get_disclosure_section tool"
```

---

## Task 4: Wire up exports and register tool

**Files:**
- Modify: `src/dart/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Add exports to `src/dart/index.ts`**

Add these lines after the existing `getDisclosure` exports:

```ts
import {
  getDisclosureSection,
  getDisclosureSectionSchema,
} from "./get-disclosure-section.js";
export { getDisclosureSection, getDisclosureSectionSchema };
```

- [ ] **Step 2: Update `get_disclosure` description in `src/index.ts`**

Change the tool description from:

```ts
"DART API를 통해 공시보고서 원본파일을 파싱해 가져옵니다."
```

to:

```ts
`DART API를 통해 공시보고서 원본파일을 파싱해 가져옵니다.
문서가 큰 경우(1MB 초과) 목차(type: "toc")를 반환합니다. 이 경우 get_disclosure_section으로 원하는 섹션을 조회하세요.`
```

- [ ] **Step 3: Register `get_disclosure_section` tool in `src/index.ts`**

Add after the `get_disclosure` tool registration block:

```ts
server.tool(
  "get_disclosure_section",
  `공시보고서의 특정 섹션을 가져옵니다.
get_disclosure에서 목차(type: "toc")가 반환된 경우, 원하는 섹션의 ID를 지정해 내용을 조회합니다.
해당 섹션도 1MB를 초과하면 하위 목차를 반환합니다.`,
  dart.getDisclosureSectionSchema.shape,
  async (params) => {
    const args = dart.getDisclosureSectionSchema.parse(params);
    const response = await dart.getDisclosureSection(args);

    return {
      content: [{ type: "text", text: JSON.stringify(response) }],
    };
  },
);
```

- [ ] **Step 4: Verify compilation**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: Successful compilation to `dist/`

- [ ] **Step 6: Commit**

```bash
git add src/dart/index.ts src/index.ts
git commit -m "feat: register get_disclosure_section tool and update descriptions"
```

---

## Task 5: Manual integration test with MCP Inspector

**Files:** None (testing only)

- [ ] **Step 1: Start MCP Inspector**

Run: `npm run inspect`

- [ ] **Step 2: Test small disclosure**

Call `get_disclosure` with a small document's `rcept_no`. Verify it returns the full parsed document (not a TOC). Confirm attributes are now included (e.g., `@_ACODE`, `@_ATOC`).

- [ ] **Step 3: Test large disclosure**

Call `get_disclosure` with `rcept_no: "20260310002977"`. Verify:
- Response is `type: "toc"`
- Contains `document_name`, `company_name`, `total_size_bytes`
- `sections` array with `id`, `title`, `size_bytes` for each

- [ ] **Step 4: Test section retrieval**

Call `get_disclosure_section` with `rcept_no: "20260310002977"` and a small section ID (e.g., `"D-1-1-1-0"`). Verify:
- Response is `type: "section"`
- Contains parsed content

- [ ] **Step 5: Test large section sub-TOC**

Call `get_disclosure_section` with `rcept_no: "20260310002977"` and `section_id: "CORRECTION"` (2.14MB). Verify:
- Response is `type: "toc"` with sub-sections

- [ ] **Step 6: Test invalid section ID**

Call `get_disclosure_section` with an invalid `section_id`. Verify error message includes valid section IDs.

- [ ] **Step 7: Test cache (verify no re-fetch)**

Call `get_disclosure_section` twice with same `rcept_no`, different `section_id`. Second call should be noticeably faster (cached XML).
