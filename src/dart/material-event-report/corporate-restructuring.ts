import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 주요사항보고서 주요정보 - 기업구조조정 관련 이벤트
 * 아래 링크들의 API를 사용
 * https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS005
 */

// 공통 스키마 - 모든 주요사항보고서 API에서 사용
const commonMaterialEventSchema = z.object({
  corp_code: z.string().length(8).describe("공시대상회사의 고유번호(8자리)"),
  bgn_de: z
    .string()
    .length(8)
    .describe("검색시작 접수일자(YYYYMMDD) - 2015년 이후부터 정보제공"),
  end_de: z
    .string()
    .length(8)
    .describe("검색종료 접수일자(YYYYMMDD) - 2015년 이후부터 정보제공"),
});

// 1. 회사합병 결정 API
export const getCompanyMergerDecisionSchema = commonMaterialEventSchema;
export type GetCompanyMergerDecisionParams = z.infer<
  typeof getCompanyMergerDecisionSchema
>;

export const getCompanyMergerDecisionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        mg_mth: "합병방법",
        mg_stn: "합병형태",
        mg_pp: "합병목적",
        mg_rt: "합병비율",
        mg_rt_bs: "합병비율 산출근거",
        exevl_atn: "외부평가에 관한 사항(외부평가 여부)",
        exevl_bs_rs: "외부평가에 관한 사항(근거 및 사유)",
        exevl_intn: "외부평가에 관한 사항(외부평가기관의 명칭)",
        exevl_pd: "외부평가에 관한 사항(외부평가 기간)",
        exevl_op: "외부평가에 관한 사항(외부평가 의견)",
        mgnstk_ostk_cnt: "합병신주의 종류와 수(주)(보통주식)",
        mgnstk_cstk_cnt: "합병신주의 종류와 수(주)(종류주식)",
        mgptncmp_cmpnm: "합병상대회사(회사명)",
        mgptncmp_mbsn: "합병상대회사(주요사업)",
        mgptncmp_rl_cmpn: "합병상대회사(회사와의 관계)",
        rbsnfdtl_tast: "합병상대회사(최근 사업연도 재무내용(원)(자산총계))",
        rbsnfdtl_tdbt: "합병상대회사(최근 사업연도 재무내용(원)(부채총계))",
        rbsnfdtl_teqt: "합병상대회사(최근 사업연도 재무내용(원)(자본총계))",
        rbsnfdtl_cpt: "합병상대회사(최근 사업연도 재무내용(원)(자본금))",
        rbsnfdtl_sl: "합병상대회사(최근 사업연도 재무내용(원)(매출액))",
        rbsnfdtl_nic: "합병상대회사(최근 사업연도 재무내용(원)(당기순이익))",
        eadtat_intn: "합병상대회사(외부감사 여부(기관명))",
        eadtat_op: "합병상대회사(외부감사 여부(감사의견))",
        nmgcmp_cmpnm: "신설합병회사(회사명)",
        ffdtl_tast: "신설합병회사(설립시 재무내용(원)(자산총계))",
        ffdtl_tdbt: "신설합병회사(설립시 재무내용(원)(부채총계))",
        ffdtl_teqt: "신설합병회사(설립시 재무내용(원)(자본총계))",
        ffdtl_cpt: "신설합병회사(설립시 재무내용(원)(자본금))",
        ffdtl_std: "신설합병회사(설립시 재무내용(원)(현재기준))",
        nmgcmp_nbsn_rsl: "신설합병회사(신설사업부문 최근 사업연도 매출액(원))",
        nmgcmp_mbsn: "신설합병회사(주요사업)",
        nmgcmp_rlst_atn: "신설합병회사(재상장신청 여부)",
        mgsc_mgctrd: "합병일정(합병계약일)",
        mgsc_shddstd: "합병일정(주주확정기준일)",
        mgsc_shclspd_bgd: "합병일정(주주명부 폐쇄기간(시작일))",
        mgsc_shclspd_edd: "합병일정(주주명부 폐쇄기간(종료일))",
        mgsc_mgop_rcpd_bgd: "합병일정(합병반대의사통지 접수기간(시작일))",
        mgsc_mgop_rcpd_edd: "합병일정(합병반대의사통지 접수기간(종료일))",
        mgsc_gmtsck_prd: "합병일정(주주총회예정일자)",
        mgsc_aprskh_expd_bgd: "합병일정(주식매수청구권 행사기간(시작일))",
        mgsc_aprskh_expd_edd: "합병일정(주식매수청구권 행사기간(종료일))",
        mgsc_osprpd_bgd: "합병일정(구주권 제출기간(시작일))",
        mgsc_osprpd_edd: "합병일정(구주권 제출기간(종료일))",
        mgsc_trspprpd_bgd: "합병일정(매매거래 정지예정기간(시작일))",
        mgsc_trspprpd_edd: "합병일정(매매거래 정지예정기간(종료일))",
        mgsc_cdobprpd_bgd: "합병일정(채권자이의 제출기간(시작일))",
        mgsc_cdobprpd_edd: "합병일정(채권자이의 제출기간(종료일))",
        mgsc_mgdt: "합병일정(합병기일)",
        mgsc_ergmd: "합병일정(종료보고 총회일)",
        mgsc_mgrgsprd: "합병일정(합병등기예정일자)",
        mgsc_nstkdlprd: "합병일정(신주권교부예정일)",
        mgsc_nstklstprd: "합병일정(신주의 상장예정일)",
        bdlst_atn: "우회상장 해당 여부",
        otcpr_bdlst_sf_atn: "타법인의 우회상장 요건 충족여부",
        aprskh_plnprc: "주식매수청구권에 관한 사항(매수예정가격)",
        aprskh_pym_plpd_mth:
          "주식매수청구권에 관한 사항(지급예정시기, 지급방법)",
        aprskh_ctref: "주식매수청구권에 관한 사항(계약에 미치는 효력)",
        bddd: "이사회결의일(결정일)",
        od_a_at_t: "사외이사참석여부(참석(명))",
        od_a_at_b: "사외이사참석여부(불참(명))",
        adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
        popt_ctr_atn: "풋옵션 등 계약 체결여부",
        popt_ctr_cn: "계약내용",
        rs_sm_atn: "증권신고서 제출대상 여부",
        ex_sm_r: "제출을 면제받은 경우 그 사유",
      },
    ],
  },
});

export async function getCompanyMergerDecision(
  params: GetCompanyMergerDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/cmpMgDecsn.json", params)
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

// 2. 회사분할 결정 API
export const getCompanyDivisionDecisionSchema = commonMaterialEventSchema;
export type GetCompanyDivisionDecisionParams = z.infer<
  typeof getCompanyDivisionDecisionSchema
>;

export const getCompanyDivisionDecisionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        dv_mth: "분할방법",
        dv_impef: "분할의 중요영향 및 효과",
        dv_rt: "분할비율",
        dv_trfbsnprt_cn: "분할로 이전할 사업 및 재산의 내용",
        atdv_excmp_cmpnm: "분할 후 존속회사(회사명)",
        atdvfdtl_tast: "분할 후 존속회사(분할후 재무내용(원)(자산총계))",
        atdvfdtl_tdbt: "분할 후 존속회사(분할후 재무내용(원)(부채총계))",
        atdvfdtl_teqt: "분할 후 존속회사(분할후 재무내용(원)(자본총계))",
        atdvfdtl_cpt: "분할 후 존속회사(분할후 재무내용(원)(자본금))",
        atdvfdtl_std: "분할 후 존속회사(분할후 재무내용(원)(현재기준))",
        atdv_excmp_exbsn_rsl:
          "분할 후 존속회사(존속사업부문 최근 사업연도매출액(원))",
        atdv_excmp_mbsn: "분할 후 존속회사(주요사업)",
        atdv_excmp_atdv_lstmn_atn: "분할 후 존속회사(분할 후 상장유지 여부)",
        dvfcmp_cmpnm: "분할설립회사(회사명)",
        ffdtl_tast: "분할설립회사(설립시 재무내용(원)(자산총계))",
        ffdtl_tdbt: "분할설립회사(설립시 재무내용(원)(부채총계))",
        ffdtl_teqt: "분할설립회사(설립시 재무내용(원)(자본총계))",
        ffdtl_cpt: "분할설립회사(설립시 재무내용(원)(자본금))",
        ffdtl_std: "분할설립회사(설립시 재무내용(원)(현재기준))",
        dvfcmp_nbsn_rsl: "분할설립회사(신설사업부문 최근 사업연도 매출액(원))",
        dvfcmp_mbsn: "분할설립회사(주요사업)",
        dvfcmp_rlst_atn: "분할설립회사(재상장신청 여부)",
        abcr_crrt: "감자에 관한 사항(감자비율(%))",
        abcr_osprpd_bgd: "감자에 관한 사항(구주권 제출기간(시작일))",
        abcr_osprpd_edd: "감자에 관한 사항(구주권 제출기간(종료일))",
        abcr_trspprpd_bgd: "감자에 관한 사항(매매거래정지 예정기간(시작일))",
        abcr_trspprpd_edd: "감자에 관한 사항(매매거래정지 예정기간(종료일))",
        abcr_nstkascnd: "감자에 관한 사항(신주배정조건)",
        abcr_shstkcnt_rt_at_rs:
          "감자에 관한 사항(주주 주식수 비례여부 및 사유)",
        abcr_nstkasstd: "감자에 관한 사항(신주배정기준일)",
        abcr_nstkdlprd: "감자에 관한 사항(신주권교부예정일)",
        abcr_nstklstprd: "감자에 관한 사항(신주의 상장예정일)",
        gmtsck_prd: "주주총회 예정일",
        cdobprpd_bgd: "채권자 이의제출기간(시작일)",
        cdobprpd_edd: "채권자 이의제출기간(종료일)",
        dvdt: "분할기일",
        dvrgsprd: "분할등기 예정일",
        bddd: "이사회결의일(결정일)",
        od_a_at_t: "사외이사참석여부(참석(명))",
        od_a_at_b: "사외이사참석여부(불참(명))",
        adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
        popt_ctr_atn: "풋옵션 등 계약 체결여부",
        popt_ctr_cn: "계약내용",
        rs_sm_atn: "증권신고서 제출대상 여부",
        ex_sm_r: "제출을 면제받은 경우 그 사유",
      },
    ],
  },
});

export async function getCompanyDivisionDecision(
  params: GetCompanyDivisionDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/cmpDvDecsn.json", params)
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

// 3. 회사분할합병 결정 API
export const getCompanyDivisionMergerDecisionSchema = commonMaterialEventSchema;
export type GetCompanyDivisionMergerDecisionParams = z.infer<
  typeof getCompanyDivisionMergerDecisionSchema
>;

export const getCompanyDivisionMergerDecisionResponseDescription =
  JSON.stringify({
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          rcept_no: "접수번호(14자리)",
          corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
          corp_code: "공시대상회사의 고유번호(8자리)",
          corp_name: "회사명",
          dvmg_mth: "분할합병 방법",
          dvmg_impef: "분할합병의 중요영향 및 효과",
          dv_trfbsnprt_cn: "분할에 관한 사항(분할로 이전할 사업 및 재산의 내용)",
          atdv_excmp_cmpnm: "분할에 관한 사항(분할 후 존속회사(회사명))",
          atdvfdtl_tast: "분할에 관한 사항(분할 후 존속회사(분할후 재무내용(원)(자산총계)))",
          atdvfdtl_tdbt: "분할에 관한 사항(분할 후 존속회사(분할후 재무내용(원)(부채총계)))",
          atdvfdtl_teqt: "분할에 관한 사항(분할 후 존속회사(분할후 재무내용(원)(자본총계)))",
          atdvfdtl_cpt: "분할에 관한 사항(분할 후 존속회사(분할후 재무내용(원)(자본금)))",
          atdvfdtl_std: "분할에 관한 사항(분할 후 존속회사(분할후 재무내용(원)(현재기준)))",
          atdv_excmp_exbsn_rsl: "분할에 관한 사항(분할 후 존속회사(존속사업부문 최근 사업연도매출액(원)))",
          atdv_excmp_mbsn: "분할에 관한 사항(분할 후 존속회사(주요사업))",
          atdv_excmp_atdv_lstmn_atn: "분할에 관한 사항(분할 후 존속회사(분할 후 상장유지 여부))",
          dvfcmp_cmpnm: "분할에 관한 사항(분할설립 회사(회사명))",
          ffdtl_tast: "분할에 관한 사항(분할설립 회사(설립시 재무내용(원)(자산총계)))",
          ffdtl_tdbt: "분할에 관한 사항(분할설립 회사(설립시 재무내용(원)(부채총계)))",
          ffdtl_teqt: "분할에 관한 사항(분할설립 회사(설립시 재무내용(원)(자본총계)))",
          ffdtl_cpt: "분할에 관한 사항(분할설립 회사(설립시 재무내용(원)(자본금)))",
          ffdtl_std: "분할에 관한 사항(분할설립 회사(설립시 재무내용(원)(현재기준)))",
          dvfcmp_nbsn_rsl: "분할에 관한 사항(분할설립 회사(신설사업부문 최근 사업연도 매출액(원)))",
          dvfcmp_mbsn: "분할에 관한 사항(분할설립 회사(주요사업))",
          dvfcmp_atdv_lstmn_at: "분할에 관한 사항(분할설립 회사(분할후 상장유지여부))",
          abcr_crrt: "분할에 관한 사항(감자에 관한 사항(감자비율(%)))",
          abcr_osprpd_bgd: "분할에 관한 사항(감자에 관한 사항(구주권 제출기간(시작일)))",
          abcr_osprpd_edd: "분할에 관한 사항(감자에 관한 사항(구주권 제출기간(종료일)))",
          abcr_trspprpd_bgd: "분할에 관한 사항(감자에 관한 사항(매매거래정지 예정기간(시작일)))",
          abcr_trspprpd_edd: "분할에 관한 사항(감자에 관한 사항(매매거래정지 예정기간(종료일)))",
          abcr_nstkascnd: "분할에 관한 사항(감자에 관한 사항(신주배정조건))",
          abcr_shstkcnt_rt_at_rs: "분할에 관한 사항(감자에 관한 사항(주주 주식수 비례여부 및 사유))",
          abcr_nstkasstd: "분할에 관한 사항(감자에 관한 사항(신주배정기준일))",
          abcr_nstkdlprd: "분할에 관한 사항(감자에 관한 사항(신주권교부예정일))",
          abcr_nstklstprd: "분할에 관한 사항(감자에 관한 사항(신주의 상장예정일))",
          mg_stn: "합병에 관한 사항(합병형태)",
          mgptncmp_cmpnm: "합병에 관한 사항(합병상대 회사(회사명))",
          mgptncmp_mbsn: "합병에 관한 사항(합병상대 회사(주요사업))",
          mgptncmp_rl_cmpn: "합병에 관한 사항(합병상대 회사(회사와의 관계))",
          rbsnfdtl_tast: "합병에 관한 사항(합병상대 회사(최근 사업연도 재무내용(원)(자산총계)))",
          rbsnfdtl_tdbt: "합병에 관한 사항(합병상대 회사(최근 사업연도 재무내용(원)(부채총계)))",
          rbsnfdtl_teqt: "합병에 관한 사항(합병상대 회사(최근 사업연도 재무내용(원)(자본총계)))",
          rbsnfdtl_cpt: "합병에 관한 사항(합병상대 회사(최근 사업연도 재무내용(원)(자본금)))",
          rbsnfdtl_sl: "합병에 관한 사항(합병상대 회사(최근 사업연도 재무내용(원)(매출액)))",
          rbsnfdtl_nic: "합병에 관한 사항(합병상대 회사(최근 사업연도 재무내용(원)(당기순이익)))",
          eadtat_intn: "합병에 관한 사항(합병상대 회사(외부감사 여부(기관명)))",
          eadtat_op: "합병에 관한 사항(합병상대 회사(외부감사 여부(감사의견)))",
          dvmgnstk_ostk_cnt: "합병에 관한 사항(분할합병신주의 종류와 수(주)(보통주식))",
          dvmgnstk_cstk_cnt: "합병에 관한 사항(분할합병신주의 종류와 수(주)(종류주식))",
          nmgcmp_cmpnm: "합병에 관한 사항(합병신설 회사(회사명))",
          nmgcmp_cpt: "합병에 관한 사항(합병신설 회사(자본금(원)))",
          nmgcmp_mbsn: "합병에 관한 사항(합병신설 회사(주요사업))",
          nmgcmp_rlst_atn: "합병에 관한 사항(합병신설 회사(재상장신청 여부))",
          dvmg_rt: "분할합병비율",
          dvmg_rt_bs: "분할합병비율 산출근거",
          exevl_atn: "외부평가에 관한 사항(외부평가 여부)",
          exevl_bs_rs: "외부평가에 관한 사항(근거 및 사유)",
          exevl_intn: "외부평가에 관한 사항(외부평가기관의 명칭)",
          exevl_pd: "외부평가에 관한 사항(외부평가 기간)",
          exevl_op: "외부평가에 관한 사항(외부평가 의견)",
          dvmgsc_dvmgctrd: "분할합병일정(분할합병계약일)",
          dvmgsc_shddstd: "분할합병일정(주주확정기준일)",
          dvmgsc_shclspd_bgd: "분할합병일정(주주명부 폐쇄기간(시작일))",
          dvmgsc_shclspd_edd: "분할합병일정(주주명부 폐쇄기간(종료일))",
          dvmgsc_dvmgop_rcpd_bgd: "분할합병일정(분할합병반대의사통지 접수기간(시작일))",
          dvmgsc_dvmgop_rcpd_edd: "분할합병일정(분할합병반대의사통지 접수기간(종료일))",
          dvmgsc_gmtsck_prd: "분할합병일정(주주총회예정일자)",
          dvmgsc_aprskh_expd_bgd: "분할합병일정(주식매수청구권 행사기간(시작일))",
          dvmgsc_aprskh_expd_edd: "분할합병일정(주식매수청구권 행사기간(종료일))",
          dvmgsc_cdobprpd_bgd: "분할합병일정(채권자 이의 제출기간(시작일))",
          dvmgsc_cdobprpd_edd: "분할합병일정(채권자 이의 제출기간(종료일))",
          dvmgsc_dvmgdt: "분할합병일정(분할합병기일)",
          dvmgsc_ergmd: "분할합병일정(종료보고 총회일)",
          dvmgsc_dvmgrgsprd: "분할합병일정(분할합병등기예정일)",
          bdlst_atn: "우회상장 해당 여부",
          otcpr_bdlst_sf_atn: "타법인의 우회상장 요건 충족여부",
          aprskh_exrq: "주식매수청구권에 관한 사항(행사요건)",
          aprskh_plnprc: "주식매수청구권에 관한 사항(매수예정가격)",
          aprskh_ex_pc_mth_pd_pl: "주식매수청구권에 관한 사항(행사절차, 방법, 기간, 장소)",
          aprskh_pym_plpd_mth: "주식매수청구권에 관한 사항(지급예정시기, 지급방법)",
          aprskh_lmt: "주식매수청구권에 관한 사항(주식매수청구권 제한 관련 내용)",
          aprskh_ctref: "주식매수청구권에 관한 사항(계약에 미치는 효력)",
          bddd: "이사회결의일(결정일)",
          od_a_at_t: "사외이사참석여부(참석(명))",
          od_a_at_b: "사외이사참석여부(불참(명))",
          adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
          popt_ctr_atn: "풋옵션 등 계약 체결여부",
          popt_ctr_cn: "계약내용",
          rs_sm_atn: "증권신고서 제출대상 여부",
          ex_sm_r: "제출을 면제받은 경우 그 사유",
        },
      ],
    },
  });

export async function getCompanyDivisionMergerDecision(
  params: GetCompanyDivisionMergerDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/cmpDvmgDecsn.json", params)
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

// 4. 주식교환·이전 결정 API
export const getStockExchangeTransferDecisionSchema = commonMaterialEventSchema;
export type GetStockExchangeTransferDecisionParams = z.infer<
  typeof getStockExchangeTransferDecisionSchema
>;

export const getStockExchangeTransferDecisionResponseDescription =
  JSON.stringify({
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          rcept_no: "접수번호(14자리)",
          corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
          corp_code: "공시대상회사의 고유번호(8자리)",
          corp_name: "회사명",
          extr_sen: "구분",
          extr_stn: "교환·이전 형태",
          extr_tgcmp_cmpnm: "교환·이전 대상법인(회사명)",
          extr_tgcmp_rp: "교환·이전 대상법인(대표자)",
          extr_tgcmp_mbsn: "교환·이전 대상법인(주요사업)",
          extr_tgcmp_rl_cmpn: "교환·이전 대상법인(회사와의 관계)",
          extr_tgcmp_tisstk_ostk: "교환·이전 대상법인(발행주식총수(주)(보통주식))",
          extr_tgcmp_tisstk_cstk: "교환·이전 대상법인(발행주식총수(주)(종류주식))",
          rbsnfdtl_tast: "교환·이전 대상법인(최근 사업연도 요약재무내용(원)(자산총계))",
          rbsnfdtl_tdbt: "교환·이전 대상법인(최근 사업연도 요약재무내용(원)(부채총계))",
          rbsnfdtl_teqt: "교환·이전 대상법인(최근 사업연도 요약재무내용(원)(자본총계))",
          rbsnfdtl_cpt: "교환·이전 대상법인(최근 사업연도 요약재무내용(원)(자본금))",
          extr_rt: "교환·이전 비율",
          extr_rt_bs: "교환·이전 비율 산출근거",
          exevl_atn: "외부평가에 관한 사항(외부평가 여부)",
          exevl_bs_rs: "외부평가에 관한 사항(근거 및 사유)",
          exevl_intn: "외부평가에 관한 사항(외부평가기관의 명칭)",
          exevl_pd: "외부평가에 관한 사항(외부평가 기간)",
          exevl_op: "외부평가에 관한 사항(외부평가 의견)",
          extr_pp: "교환·이전 목적",
          extrsc_extrctrd: "교환·이전일정(교환·이전계약일)",
          extrsc_shddstd: "교환·이전일정(주주확정기준일)",
          extrsc_shclspd_bgd: "교환·이전일정(주주명부 폐쇄기간(시작일))",
          extrsc_shclspd_edd: "교환·이전일정(주주명부 폐쇄기간(종료일))",
          extrsc_extrop_rcpd_bgd: "교환·이전일정(주식교환·이전 반대의사 통지접수기간(시작일))",
          extrsc_extrop_rcpd_edd: "교환·이전일정(주식교환·이전 반대의사 통지접수기간(종료일))",
          extrsc_gmtsck_prd: "교환·이전일정(주주총회 예정일자)",
          extrsc_aprskh_expd_bgd: "교환·이전일정(주식매수청구권 행사기간(시작일))",
          extrsc_aprskh_expd_edd: "교환·이전일정(주식매수청구권 행사기간(종료일))",
          extrsc_osprpd_bgd: "교환·이전일정(구주권제출기간(시작일))",
          extrsc_osprpd_edd: "교환·이전일정(구주권제출기간(종료일))",
          extrsc_trspprpd: "교환·이전일정(매매거래정지예정기간)",
          extrsc_trspprpd_bgd: "교환·이전일정(매매거래정지예정기간(시작일))",
          extrsc_trspprpd_edd: "교환·이전일정(매매거래정지예정기간(종료일))",
          extrsc_extrdt: "교환·이전일정(교환·이전일자)",
          extrsc_nstkdlprd: "교환·이전일정(신주권교부예정일)",
          extrsc_nstklstprd: "교환·이전일정(신주의 상장예정일)",
          atextr_cpcmpnm: "교환·이전 후 완전모회사명",
          aprskh_plnprc: "주식매수청구권에 관한 사항(매수예정가격)",
          aprskh_pym_plpd_mth: "주식매수청구권에 관한 사항(지급예정시기, 지급방법)",
          aprskh_lmt: "주식매수청구권에 관한 사항(주식매수청구권 제한 관련 내용)",
          aprskh_ctref: "주식매수청구권에 관한 사항(계약에 미치는 효력)",
          bdlst_atn: "우회상장 해당 여부",
          otcpr_bdlst_sf_atn: "타법인의 우회상장 요건 충족 여부",
          bddd: "이사회결의일(결정일)",
          od_a_at_t: "사외이사참석여부(참석(명))",
          od_a_at_b: "사외이사참석여부(불참(명))",
          adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
          popt_ctr_atn: "풋옵션 등 계약 체결여부",
          popt_ctr_cn: "계약내용",
          rs_sm_atn: "증권신고서 제출대상 여부",
          ex_sm_r: "제출을 면제받은 경우 그 사유",
        },
      ],
    },
  });

export async function getStockExchangeTransferDecision(
  params: GetStockExchangeTransferDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/stkExtrDecsn.json", params)
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
