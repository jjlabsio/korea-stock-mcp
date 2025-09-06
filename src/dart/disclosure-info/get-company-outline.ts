import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

export const getCompanyOutlineSchema = z.object({
  corp_code: z
    .string()
    .length(8)
    .describe("공시대상회사의 고유번호(8자리)"),
});
export type GetCompanyOutlineParams = z.infer<typeof getCompanyOutlineSchema>;

export const getCompanyOutlineResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    corp_name: "정식회사명",
    stock_name: "종목명(상장사) 또는 약식명칭(기타법인)",
    stock_code: "상장회사인 경우 주식의 종목코드(6자리)",
    ceo_nm: "대표자명",
    corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
    jurir_no: "법인등록번호",
    bizr_no: "사업자등록번호",
    adres: "주소",
    hm_url: "홈페이지 주소",
    ir_url: "IR 홈페이지 주소",
    phn_no: "전화번호",
    fax_no: "팩스번호",
    induty_code: "업종코드",
    est_dt: "설립일(YYYYMMDD)",
    acc_mt: "결산월(MM)",
  },
});

export async function getCompanyOutline(params: GetCompanyOutlineParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/company.json", params)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("해당 기업의 정보를 찾을 수 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  return data;
}