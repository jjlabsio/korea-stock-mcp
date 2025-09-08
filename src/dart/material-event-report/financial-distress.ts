import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 주요사항보고서 주요정보 - 재무위기 관련 이벤트
 * 아래 링크들의 API를 사용
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS005
 */

// 공통 스키마 - 모든 주요사항보고서 API에서 사용
const commonMaterialEventSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bgn_de: z.string().length(8).describe("검색시작 접수일자(YYYYMMDD) - 2015년 이후부터 정보제공"),
  end_de: z.string().length(8).describe("검색종료 접수일자(YYYYMMDD) - 2015년 이후부터 정보제공"),
});

// 1. 부도발생 API
export const getBankruptcyOccurrenceSchema = commonMaterialEventSchema;
export type GetBankruptcyOccurrenceParams = z.infer<typeof getBankruptcyOccurrenceSchema>;

export const getBankruptcyOccurrenceResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        df_cn: "부도내용",
        df_amt: "부도금액",
        df_bnk: "부도발생은행",
        dfd: "최종부도(당좌거래정지)일자",
        df_rs: "부도사유 및 경위",
      },
    ],
  },
});

export async function getBankruptcyOccurrence(params: GetBankruptcyOccurrenceParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/dfOcr.json", params)
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

// 2. 영업정지 API
export const getBusinessSuspensionSchema = commonMaterialEventSchema;
export type GetBusinessSuspensionParams = z.infer<typeof getBusinessSuspensionSchema>;

export const getBusinessSuspensionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        bsnsp_rm: "영업정지 분야",
        bsnsp_amt: "영업정지 내역(영업정지금액)",
        rsl: "영업정지 내역(최근매출총액)",
        sl_vs: "영업정지 내역(매출액 대비)",
        ls_atn: "영업정지 내역(대규모법인여부)",
        krx_stt_atn: "영업정지 내역(거래소 의무공시 해당 여부)",
        bsnsp_cn: "영업정지 내용",
        bsnsp_rs: "영업정지사유",
        ft_ctp: "향후대책",
        bsnsp_af: "영업정지영향",
        bsnspd: "영업정지일자",
        bddd: "이사회결의일(결정일)",
        od_a_at_t: "사외이사 참석여부(참석)",
        od_a_at_b: "사외이사 참석여부(불참)",
        adt_a_atn: "감사(감사위원) 참석여부",
      },
    ],
  },
});

export async function getBusinessSuspension(params: GetBusinessSuspensionParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/bsnSp.json", params)
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

// 3. 회생절차 개시신청 API
export const getRehabilitationApplicationSchema = commonMaterialEventSchema;
export type GetRehabilitationApplicationParams = z.infer<typeof getRehabilitationApplicationSchema>;

export const getRehabilitationApplicationResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        apcnt: "신청인 (회사와의 관계)",
        cpct: "관할법원",
        rq_rs: "신청사유",
        rqd: "신청일자",
        ft_ctp_sc: "향후대책 및 일정",
      },
    ],
  },
});

export async function getRehabilitationApplication(params: GetRehabilitationApplicationParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/ctrcvsBgrq.json", params)
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

// 4. 해산사유 발생 API
export const getDissolutionReasonSchema = commonMaterialEventSchema;
export type GetDissolutionReasonParams = z.infer<typeof getDissolutionReasonSchema>;

export const getDissolutionReasonResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        ds_rs: "해산사유",
        ds_rsd: "해산사유발생일(결정일)",
        od_a_at_t: "사외이사 참석여부(참석)",
        od_a_at_b: "사외이사 참석여부(불참)",
        adt_a_atn: "감사(감사위원) 참석 여부",
      },
    ],
  },
});

export async function getDissolutionReason(params: GetDissolutionReasonParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/dsRsOcr.json", params)
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

// 5. 채권은행 등의 관리절차 개시 API
export const getCreditorBankManagementStartSchema = commonMaterialEventSchema;
export type GetCreditorBankManagementStartParams = z.infer<typeof getCreditorBankManagementStartSchema>;

export const getCreditorBankManagementStartResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        mngt_pcbg_dd: "관리절차개시 결정일자",
        mngt_int: "관리기관",
        mngt_pd: "관리기간",
        mngt_rs: "관리사유",
        cfd: "확인일자",
      },
    ],
  },
});

export async function getCreditorBankManagementStart(params: GetCreditorBankManagementStartParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/bnkMngtPcbg.json", params)
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

// 6. 채권은행 등의 관리절차 중단 API
export const getCreditorBankManagementEndSchema = commonMaterialEventSchema;
export type GetCreditorBankManagementEndParams = z.infer<typeof getCreditorBankManagementEndSchema>;

export const getCreditorBankManagementEndResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        mngt_pcsp_dd: "관리절차중단 결정일자",
        mngt_int: "관리기관",
        sp_rs: "중단사유",
        ft_ctp: "향후대책",
        cfd: "확인일자",
      },
    ],
  },
});

export async function getCreditorBankManagementEnd(params: GetCreditorBankManagementEndParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/bnkMngtPcsp.json", params)
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