import { buildUrl } from "./utils.js";

export async function dartRequest(url: string): Promise<Response> {
  const response = await fetch(
    buildUrl(url, {
      crtfc_key: process.env.DART_API_KEY,
    })
  );

  if (!response.ok) {
    throw "Dart request error";
  }

  return response;
}
