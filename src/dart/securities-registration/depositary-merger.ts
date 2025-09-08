import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 증권신고서 주요정보 - 증권예탁증권 및 합병
 * 아래 링크들의 API를 사용
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS006
 */

// 공통 스키마 - 모든 증권신고서 API에서 사용
const commonSecuritiesRegistrationSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bgn_de: z
    .string()
    .length(8)
    .describe("검색시작 접수일자(YYYYMMDD) - 2013년 이후부터 정보제공"),
  end_de: z
    .string()
    .length(8)
    .describe("검색종료 접수일자(YYYYMMDD) - 2013년 이후부터 정보제공"),
});

// 1. 증권예탁증권 API
export const getDepositaryReceiptsSchema = commonSecuritiesRegistrationSchema;
export type GetDepositaryReceiptsParams = z.infer<
  typeof getDepositaryReceiptsSchema
>;

export const getDepositaryReceiptsResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    group: [
      {
        title: "일반사항",
        list: [
          {
            rcept_no: "접수번호(14자리)",
            corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
            corp_code: "공시대상회사의 고유번호(8자리)",
            corp_name: "공시대상회사명",
            sbd: "청약기일",
            pymd: "납입기일",
            sband: "청약공고일",
            asand: "배정공고일",
            asstd: "배정기준일",
            exstk: "신주인수권에 관한 사항(행사대상증권)",
            exprc: "신주인수권에 관한 사항(행사가격)",
            expd: "신주인수권에 관한 사항(행사기간)",
            rpt_rcpn: "주요사항보고서(접수번호)",
          },
        ],
      },
      {
        title: "증권의종류",
        list: [
          {
            rcept_no: "접수번호(14자리)",
            corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
            corp_code: "공시대상회사의 고유번호(8자리)",
            corp_name: "공시대상회사명",
            stksen: "증권의종류",
            stkcnt: "증권수량",
            fv: "액면가액",
            slprc: "모집(매출)가액",
            slta: "모집(매출)총액",
            slmthn: "모집(매출)방법",
          },
        ],
      },
      {
        title: "인수인정보",
        list: [
          {
            rcept_no: "접수번호(14자리)",
            corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
            corp_code: "공시대상회사의 고유번호(8자리)",
            corp_name: "공시대상회사명",
            actsen: "인수인구분",
            actnmn: "인수인명",
            stksen: "증권의종류",
            udtcnt: "인수수량",
            udtamt: "인수금액",
            udtprc: "인수대가",
            udtmth: "인수방법",
          },
        ],
      },
      {
        title: "자금의사용목적",
        list: [
          {
            rcept_no: "접수번호(14자리)",
            corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
            corp_code: "공시대상회사의 고유번호(8자리)",
            corp_name: "공시대상회사명",
            se: "구분",
            amt: "금액",
          },
        ],
      },
      {
        title: "매출인에관한사항",
        list: [
          {
            rcept_no: "접수번호(14자리)",
            corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
            corp_code: "공시대상회사의 고유번호(8자리)",
            corp_name: "공시대상회사명",
            hdr: "보유자",
            rl_cmp: "회사와의관계",
            bfsl_hdstk: "매출전보유증권수",
            slstk: "매출증권수",
            atsl_hdstk: "매출후보유증권수",
          },
        ],
      },
    ],
  },
});

export async function getDepositaryReceipts(
  params: GetDepositaryReceiptsParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/stkdpRs.json", params)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("조회된 데이타가 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  return data;
}

// 2. 합병 API
export const getMergerSchema = commonSecuritiesRegistrationSchema;
export type GetMergerParams = z.infer<typeof getMergerSchema>;

export const getMergerResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    group: [
      {
        title: "일반사항",
        list: [
          {
            rcept_no: "접수번호(14자리)",
            corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
            corp_code: "공시대상회사의 고유번호(8자리)",
            corp_name: "공시대상회사명",
            stn: "형태",
            bddd: "이사회 결의일",
            ctrd: "계약일",
            gmtsck_shddstd: "주주총회를 위한 주주확정일",
            ap_gmtsck: "승인을 위한 주주총회일",
            aprskh_pd_bgd: "주식매수청구권 행사 기간 및 가격(시작일)",
            aprskh_pd_edd: "주식매수청구권 행사 기간 및 가격(종료일)",
            aprskh_prc: "주식매수청구권 행사 기간 및 가격((주식매수청구가격-회사제시))",
            mgdt_etc: "합병기일등",
            rt_vl: "비율 또는 가액",
            exevl_int: "외부평가기관",
            grtmn_etc: "지급 교부금 등",
            rpt_rcpn: "주요사항보고서(접수번호)",
          },
        ],
      },
      {
        title: "발행증권",
        list: [
          {
            rcept_no: "접수번호(14자리)",
            corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
            corp_code: "공시대상회사의 고유번호(8자리)",
            corp_name: "공시대상회사명",
            kndn: "종류",
            cnt: "수량",
            fv: "액면가액",
            slprc: "모집(매출)가액",
            slta: "모집(매출)총액",
          },
        ],
      },
      {
        title: "당사회사에관한사항",
        list: [
          {
            rcept_no: "접수번호(14자리)",
            corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
            corp_code: "공시대상회사의 고유번호(8자리)",
            corp_name: "공시대상회사명",
            cmpnm: "회사명",
            sen: "구분",
            tast: "총자산",
            cpt: "자본금",
            isstk_knd: "발행주식수(주식의종류)",
            isstk_cnt: "발행주식수(주식수)",
          },
        ],
      },
    ],
  },
});

export async function getMerger(params: GetMergerParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/mgRs.json", params)
  );
  const data = await response.json();

  if (data.status === "013") {
    throw new Error("조회된 데이타가 없습니다.");
  }

  if (data.status !== "000") {
    throw new Error(`API 오류: ${data.message}`);
  }

  return data;
}
