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
