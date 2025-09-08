import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 주요사항보고서 주요정보 - 주권관련사채권 거래 이벤트
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

// 1. 주권 관련 사채권 양수 결정 API
export const getStockRelatedBondAcquisitionDecisionSchema =
  commonMaterialEventSchema;
export type GetStockRelatedBondAcquisitionDecisionParams = z.infer<
  typeof getStockRelatedBondAcquisitionDecisionSchema
>;

export const getStockRelatedBondAcquisitionDecisionResponseDescription =
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
          stkrtbd_kndn: "주권 관련 사채권의 종류",
          tm: "주권 관련 사채권의 종류(회차)",
          knd: "주권 관련 사채권의 종류(종류)",
          bdiscmp_cmpnm: "사채권 발행회사(회사명)",
          bdiscmp_nt: "사채권 발행회사(국적)",
          bdiscmp_rp: "사채권 발행회사(대표자)",
          bdiscmp_cpt: "사채권 발행회사(자본금(원))",
          bdiscmp_rl_cmpn: "사채권 발행회사(회사와 관계)",
          bdiscmp_tisstk: "사채권 발행회사(발행주식 총수(주))",
          bdiscmp_mbsn: "사채권 발행회사(주요사업)",
          l6m_tpa_nstkaq_atn: "최근 6월 이내 제3자 배정에 의한 신주취득 여부",
          inhdtl_bd_fta: "양수내역(사채의 권면(전자등록)총액(원))",
          inhdtl_inhprc: "양수내역(양수금액(원)(A))",
          inhdtl_tast: "양수내역(총자산(원)(B))",
          inhdtl_tast_vs: "양수내역(총자산대비(%)(A/B))",
          inhdtl_ecpt: "양수내역(자기자본(원)(C))",
          inhdtl_ecpt_vs: "양수내역(자기자본대비(%)(A/C))",
          inh_pp: "양수목적",
          inh_prd: "양수예정일자",
          dlptn_cmpnm: "거래상대방(회사명(성명))",
          dlptn_cpt: "거래상대방(자본금(원))",
          dlptn_mbsn: "거래상대방(주요사업)",
          dlptn_hoadd: "거래상대방(본점소재지(주소))",
          dlptn_rl_cmpn: "거래상대방(회사와의 관계)",
          dl_pym: "거래대금지급",
          exevl_atn: "외부평가에 관한 사항(외부평가 여부)",
          exevl_bs_rs: "외부평가에 관한 사항(근거 및 사유)",
          exevl_intn: "외부평가에 관한 사항(외부평가기관의 명칭)",
          exevl_pd: "외부평가에 관한 사항(외부평가 기간)",
          exevl_op: "외부평가에 관한 사항(외부평가 의견)",
          bddd: "이사회결의일(결정일)",
          od_a_at_t: "사외이사 참석여부(참석(명))",
          od_a_at_b: "사외이사 참석여부(불참(명))",
          adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
          ftc_stt_atn: "공정거래위원회 신고대상 여부",
          popt_ctr_atn: "풋옵션 등 계약 체결여부",
          popt_ctr_cn: "계약내용",
        },
      ],
    },
  });

export async function getStockRelatedBondAcquisitionDecision(
  params: GetStockRelatedBondAcquisitionDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/stkrtbdInhDecsn.json", params)
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

// 2. 주권 관련 사채권 양도 결정 API
export const getStockRelatedBondTransferDecisionSchema =
  commonMaterialEventSchema;
export type GetStockRelatedBondTransferDecisionParams = z.infer<
  typeof getStockRelatedBondTransferDecisionSchema
>;

export const getStockRelatedBondTransferDecisionResponseDescription =
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
          stkrtbd_kndn: "주권 관련 사채권의 종류",
          tm: "주권 관련 사채권의 종류(회차)",
          knd: "주권 관련 사채권의 종류(종류)",
          aqd: "취득일자",
          bdiscmp_cmpnm: "사채권 발행회사(회사명)",
          bdiscmp_nt: "사채권 발행회사(국적)",
          bdiscmp_rp: "사채권 발행회사(대표자)",
          bdiscmp_cpt: "사채권 발행회사(자본금(원))",
          bdiscmp_rl_cmpn: "사채권 발행회사(회사와 관계)",
          bdiscmp_tisstk: "사채권 발행회사(발행주식 총수(주))",
          bdiscmp_mbsn: "사채권 발행회사(주요사업)",
          trfdtl_bd_fta: "양도내역(사채의 권면(전자등록)총액(원))",
          trfdtl_trfprc: "양도내역(양도금액(원)(A))",
          trfdtl_tast: "양도내역(총자산(원)(B))",
          trfdtl_tast_vs: "양도내역(총자산대비(%)(A/B))",
          trfdtl_ecpt: "양도내역(자기자본(원)(C))",
          trfdtl_ecpt_vs: "양도내역(자기자본대비(%)(A/C))",
          trf_pp: "양도목적",
          trf_prd: "양도예정일자",
          dlptn_cmpnm: "거래상대방(회사명(성명))",
          dlptn_cpt: "거래상대방(자본금(원))",
          dlptn_mbsn: "거래상대방(주요사업)",
          dlptn_hoadd: "거래상대방(본점소재지(주소))",
          dlptn_rl_cmpn: "거래상대방(회사와의 관계)",
          dl_pym: "거래대금지급",
          exevl_atn: "외부평가에 관한 사항(외부평가 여부)",
          exevl_bs_rs: "외부평가에 관한 사항(근거 및 사유)",
          exevl_intn: "외부평가에 관한 사항(외부평가기관의 명칭)",
          exevl_pd: "외부평가에 관한 사항(외부평가 기간)",
          exevl_op: "외부평가에 관한 사항(외부평가 의견)",
          bddd: "이사회결의일(결정일)",
          od_a_at_t: "사외이사 참석여부(참석(명))",
          od_a_at_b: "사외이사 참석여부(불참(명))",
          adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
          ftc_stt_atn: "공정거래위원회 신고대상 여부",
          popt_ctr_atn: "풋옵션 등 계약 체결여부",
          popt_ctr_cn: "계약내용",
        },
      ],
    },
  });

export async function getStockRelatedBondTransferDecision(
  params: GetStockRelatedBondTransferDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/stkrtbdTrfDecsn.json", params)
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
