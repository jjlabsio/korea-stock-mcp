// src/dart/corp-code-proxy.ts
import type { CorpInfo } from "./get-corp-code.js";

const PROXY_URL =
  "https://jjlabsio.github.io/korea-stock-mcp/corp-codes.json";
const FETCH_TIMEOUT_MS = 10_000;

interface CompactCorpInfo {
  c: string; // corp_code
  n: string; // corp_name
  s?: string; // stock_code
}

export async function fetchCorpListFromProxy(): Promise<CorpInfo[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(PROXY_URL, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data) || data.length === 0 || !data[0].c) {
      throw new Error("Invalid proxy response shape");
    }

    return (data as CompactCorpInfo[]).map((entry) => ({
      corp_code: entry.c,
      corp_name: entry.n,
      stock_code: entry.s ?? "",
    }));
  } finally {
    clearTimeout(timeoutId);
  }
}
