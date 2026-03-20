import { buildUrl } from "./url.js";

export async function dartRequest(url: string): Promise<Response> {
  if (!process.env.DART_API_KEY) {
    throw Error("There is no DART API KEY");
  }

  const response = await fetch(
    buildUrl(url, {
      crtfc_key: process.env.DART_API_KEY,
    }),
  );

  if (!response.ok) {
    throw Error(
      `DART API HTTP 오류 (status: ${response.status}): ${response.statusText}`,
    );
  }

  return response;
}

export async function krxRequest(url: string): Promise<Response> {
  if (!process.env.KRX_API_KEY) {
    throw Error("There is no KRX API KEY");
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      AUTH_KEY: process.env.KRX_API_KEY,
    },
  });

  if (!response.ok) {
    throw Error(
      `KRX API HTTP 오류 (status: ${response.status}): ${response.statusText}`,
    );
  }

  return response;
}
