# GitHub Pages Corp Code Proxy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the 15-20MB DART ZIP download from `get_corp_code` by serving a pre-built JSON via GitHub Pages, updated daily by GitHub Actions.

**Architecture:** A daily GitHub Action downloads DART's corpCode.xml ZIP, parses it to JSON, and pushes to a `gh-pages` branch served via GitHub Pages. The MCP server's `get_corp_code` fetches this lightweight JSON (~3MB) instead of the 15-20MB ZIP. On failure, it falls back to the current direct DART download.

**Tech Stack:** GitHub Actions, GitHub Pages, TypeScript, Node.js

---

## Background

### Problem
`get_corp_code` downloads ~15-20MB ZIP from DART, decompresses, and parses ~100K XML entries on every call. Some users on slow networks hit Claude Desktop's MCP tool call timeout ("No result received from client-side tool execution").

### Solution
Offload the heavy download to a daily GitHub Action. Serve the result as static JSON on GitHub Pages. The MCP server fetches ~3MB JSON instead of 15-20MB ZIP.

### Flow
```
[Daily GitHub Action]
DART corpCode.xml (15-20MB ZIP) → parse → corp-codes.json → gh-pages branch → GitHub Pages CDN

[MCP get_corp_code]
1. Try: fetch corp-codes.json from GitHub Pages (~3MB) → filter → return
2. Fallback: fetch corpCode.xml from DART directly (current behavior) → filter → return
```

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `scripts/generate-corp-codes.ts` | Create | Downloads DART ZIP, parses XML, writes JSON to stdout |
| `.github/workflows/update-corp-codes.yml` | Create | Daily cron that runs the script and deploys to gh-pages |
| `src/dart/get-corp-code.ts` | Modify | Add GitHub Pages fetch with fallback to DART direct download |
| `src/dart/corp-code-proxy.ts` | Create | GitHub Pages fetch logic, separated from main get-corp-code |
| `package.json` | Modify | Add `generate-corp-codes` script |

---

## Task 1: Create the corp code generation script

**Files:**
- Create: `scripts/generate-corp-codes.ts`
- Modify: `package.json`

This script will be used both by the GitHub Action and can be run locally for testing.

- [ ] **Step 1: Create the generation script**

```typescript
// scripts/generate-corp-codes.ts
import { XMLParser } from "fast-xml-parser";
import AdmZip from "adm-zip";

interface CorpInfo {
  corp_code: string;
  corp_name: string;
  stock_code: string;
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

  // Only keep fields needed for lookup, minimize JSON size
  const result: CorpInfo[] = companies.map((c) => ({
    corp_code: c.corp_code,
    corp_name: c.corp_name,
    stock_code: c.stock_code ?? "",
  }));

  const output = JSON.stringify(result);
  process.stdout.write(output);

  console.error(`Generated ${result.length} entries`);
}

main();
```

- [ ] **Step 2: Add npm script to package.json**

Add to `scripts` in `package.json`:
```json
"generate-corp-codes": "tsx scripts/generate-corp-codes.ts"
```

- [ ] **Step 3: Test locally**

Run: `DART_API_KEY=<your-key> npm run generate-corp-codes > /tmp/corp-codes.json`
Expected: `/tmp/corp-codes.json` contains JSON array with ~100K entries, file size ~3MB

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-corp-codes.ts package.json
git commit -m "feat: add corp code JSON generation script"
```

---

## Task 2: Create GitHub Actions workflow

**Files:**
- Create: `.github/workflows/update-corp-codes.yml`

- [ ] **Step 1: Create the workflow file**

```yaml
name: Update Corp Codes

on:
  schedule:
    # Run daily at 06:00 KST (21:00 UTC previous day)
    - cron: '0 21 * * *'
  workflow_dispatch: # Allow manual trigger

permissions:
  contents: write

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - name: Generate corp codes JSON
        run: |
          mkdir -p _pages
          npm run generate-corp-codes > _pages/corp-codes.json
        env:
          DART_API_KEY: ${{ secrets.DART_API_KEY }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_pages
          publish_branch: gh-pages
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/update-corp-codes.yml
git commit -m "ci: add daily corp code update workflow"
```

- [ ] **Step 3: Configure GitHub repo**

1. Go to repo Settings → Secrets → Add `DART_API_KEY` as a repository secret
2. Go to Settings → Pages → Source: Deploy from branch `gh-pages`, folder `/ (root)`
3. Manually trigger the workflow via Actions tab → "Update Corp Codes" → "Run workflow"
4. Verify: `https://jjlabsio.github.io/korea-stock-mcp/corp-codes.json` returns the JSON

---

## Task 3: Add GitHub Pages proxy fetch module

**Files:**
- Create: `src/dart/corp-code-proxy.ts`

- [ ] **Step 1: Create the proxy module**

```typescript
// src/dart/corp-code-proxy.ts

import type { CorpInfo } from "./get-corp-code.js";

const PROXY_URL =
  "https://jjlabsio.github.io/korea-stock-mcp/corp-codes.json";
const FETCH_TIMEOUT_MS = 5000;

export async function fetchCorpListFromProxy(): Promise<CorpInfo[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(PROXY_URL, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data) || data.length === 0 || !data[0].corp_code) {
      throw new Error("Invalid proxy response shape");
    }

    return data as CorpInfo[];
  } finally {
    clearTimeout(timeoutId);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/dart/corp-code-proxy.ts
git commit -m "feat: add GitHub Pages corp code proxy fetch"
```

---

## Task 4: Integrate proxy into get_corp_code with fallback

**Files:**
- Modify: `src/dart/get-corp-code.ts`

- [ ] **Step 1: Modify get-corp-code.ts**

Replace the current `fetchCorpList()` usage with proxy-first, fallback-to-DART logic:

```typescript
// src/dart/get-corp-code.ts
import z from "zod";
import { dartRequest } from "../utils/request.js";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";
import { fetchCorpListFromProxy } from "./corp-code-proxy.js";

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
    stock_code: "상장회사의 종목코드(6자리)",
  },
});

export interface CorpInfo {
  corp_code: string;
  corp_name: string;
  stock_code: string;
}

async function fetchCorpListFromDart(): Promise<CorpInfo[]> {
  const response = await dartRequest(
    "https://opendart.fss.or.kr/api/corpCode.xml",
  );

  const buffer = Buffer.from(await response.arrayBuffer());

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

async function fetchCorpList(): Promise<CorpInfo[]> {
  try {
    return await fetchCorpListFromProxy();
  } catch {
    return await fetchCorpListFromDart();
  }
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
      "일치하는 회사가 없습니다. 6자리 종목코드(stock_code, 예: 005930)를 알고 있다면 종목코드로 다시 조회해주세요.",
    );
  }

  return matches;
}
```

Key changes:
- Renamed original `fetchCorpList` → `fetchCorpListFromDart`
- New `fetchCorpList` tries proxy first, falls back to DART on any error
- `CorpInfo` simplified to 3 fields only (`corp_code`, `corp_name`, `stock_code`) — `corp_eng_name`/`modify_date` removed (unused by callers)
- `CorpInfo` exported for use by `corp-code-proxy.ts` (shared type, no duplication)

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 3: Test manually with MCP Inspector**

Run: `npm run inspect`
Call `get_corp_code` with `{ "stock_code": "005930" }` (Samsung Electronics)
Expected: Returns corp_code for Samsung

- [ ] **Step 4: Commit**

```bash
git add src/dart/get-corp-code.ts src/dart/corp-code-proxy.ts
git commit -m "feat: use GitHub Pages proxy for corp code lookup with DART fallback"
```

---

## Task 5: Update dart/index.ts exports (if needed)

**Files:**
- Check: `src/dart/index.ts`

- [ ] **Step 1: Verify no export changes needed**

`corp-code-proxy.ts` is an internal module imported only by `get-corp-code.ts`. No new exports needed in `src/dart/index.ts`. Verify the build still passes.

Run: `npm run build`
Expected: PASS

---

## Summary of changes

| Before | After |
|--------|-------|
| Every `get_corp_code` call downloads 15-20MB ZIP from DART | Fetches ~3MB JSON from GitHub Pages CDN |
| No fallback on failure | Falls back to DART direct download |
| No timeout on fetch | 5s timeout on proxy fetch |
| 5 fields per entry | 3 fields per entry (smaller payload) |
| Single point of failure (DART) | Two sources: GitHub Pages (primary) + DART (fallback) |
