import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 증권신고서 주요정보 - 지분증권 및 채무증권
 * 아래 링크들의 API를 사용
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS006
 */

// 공통 스키마 - 모든 증권신고서 API에서 사용
const commonSecuritiesRegistrationSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bgn_de: z.string().length(8).describe("검색시작 접수일자(YYYYMMDD) - 2013년 이후부터 정보제공"),
  end_de: z.string().length(8).describe("검색종료 접수일자(YYYYMMDD) - 2013년 이후부터 정보제공"),
});

// 1. 지분증권 API
export const getEquitySecuritiesSchema = commonSecuritiesRegistrationSchema;
export type GetEquitySecuritiesParams = z.infer<typeof getEquitySecuritiesSchema>;

export const getEquitySecuritiesResponseDescription = JSON.stringify({
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
      {
        title: "일반청약자환매청구권",
        list: [
          {
            rcept_no: "접수번호(14자리)",
            corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
            corp_code: "공시대상회사의 고유번호(8자리)",
            corp_name: "공시대상회사명",
            grtrs: "부여사유",
            exavivr: "행사가능 투자자",
            grtcnt: "부여수량",
            expd: "행사기간",
            exprc: "행사가격",
          },
        ],
      },
    ],
  },
});

export async function getEquitySecurities(params: GetEquitySecuritiesParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/estkRs.json", params)
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

// 2. 채무증권 API
export const getDebtSecuritiesSchema = commonSecuritiesRegistrationSchema;
export type GetDebtSecuritiesParams = z.infer<typeof getDebtSecuritiesSchema>;

export const getDebtSecuritiesResponseDescription = JSON.stringify({
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
            tm: "회차",
            bdnmn: "채무증권 명칭",
            slmth: "모집(매출)방법",
            fta: "권면(전자등록)총액",
            slta: "모집(매출)총액",
            isprc: "발행가액",
            intr: "이자율",
            isrr: "발행수익률",
            rpd: "상환기일",
            print_pymint: "원리금지급대행기관",
            mngt_cmp: "(사채)관리회사",
            cdrt_int: "신용등급(신용평가기관)",
            sbd: "청약기일",
            pymd: "납입기일",
            sband: "청약공고일",
            asand: "배정공고일",
            asstd: "배정기준일",
            dpcrn: "표시통화",
            dpcr_amt: "표시통화기준발행규모",
            usarn: "사용지역",
            usntn: "사용국가",
            wnexpl_at: "원화 교환 예정 여부",
            udtintnm: "인수기관명",
            grt_int: "보증을 받은 경우(보증기관)",
            grt_amt: "보증을 받은 경우(보증금액)",
            icmg_mgknd: "담보 제공의 경우(담보의 종류)",
            icmg_mgamt: "담보 제공의 경우(담보금액)",
            estk_exstk: "지분증권과 연계된 경우(행사대상증권)",
            estk_exrt: "지분증권과 연계된 경우(권리행사비율)",
            estk_exprc: "지분증권과 연계된 경우(권리행사가격)",
            estk_expd: "지분증권과 연계된 경우(권리행사기간)",
            rpt_rcpn: "주요사항보고서(접수번호)",
            drcb_at: "파생결합사채해당여부",
            drcb_uast: "파생결합사채(기초자산)",
            drcb_optknd: "파생결합사채(옵션종류)",
            drcb_mtd: "파생결합사채(만기일)",
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
            tm: "회차",
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
            tm: "회차",
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
            tm: "회차",
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

export async function getDebtSecurities(params: GetDebtSecuritiesParams) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/bdRs.json", params)
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