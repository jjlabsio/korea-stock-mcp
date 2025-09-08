import z from "zod";
import { dartRequest } from "../../common/request.js";
import { buildUrl } from "../../common/utils.js";

/**
 * 주요사항보고서 주요정보 - 자산거래 관련 이벤트
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

// 1. 자산양수도(기타), 풋백옵션 API
export const getAssetTransferEtcPutBackOptionSchema = commonMaterialEventSchema;
export type GetAssetTransferEtcPutBackOptionParams = z.infer<
  typeof getAssetTransferEtcPutBackOptionSchema
>;

export const getAssetTransferEtcPutBackOptionResponseDescription =
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
          rp_rsn: "보고 사유",
          ast_inhtrf_prc: "자산양수·도 가액",
        },
      ],
    },
  });

export async function getAssetTransferEtcPutBackOption(
  params: GetAssetTransferEtcPutBackOptionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/astInhtrfEtcPtbkOpt.json", params)
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

// 2. 영업양수 결정 API
export const getBusinessAcquisitionDecisionSchema = commonMaterialEventSchema;
export type GetBusinessAcquisitionDecisionParams = z.infer<
  typeof getBusinessAcquisitionDecisionSchema
>;

export const getBusinessAcquisitionDecisionResponseDescription = JSON.stringify(
  {
    result: {
      status: "에러 및 정보 코드",
      message: "에러 및 정보 메시지",
      list: [
        {
          rcept_no: "접수번호(14자리)",
          corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
          corp_code: "공시대상회사의 고유번호(8자리)",
          corp_name: "회사명",
          inh_bsn: "양수영업",
          inh_bsn_mc: "양수영업 주요내용",
          inh_prc: "양수가액(원)",
          absn_inh_atn: "영업전부의 양수 여부",
          ast_inh_bsn: "재무내용(원)(자산액(양수대상 영업부문(A)))",
          ast_cmp_all: "재무내용(원)(자산액(당사전체(B)))",
          ast_rt: "재무내용(원)(자산액(비중(%)(A/B)))",
          sl_inh_bsn: "재무내용(원)(매출액(양수대상 영업부문(A)))",
          sl_cmp_all: "재무내용(원)(매출액(당사전체(B)))",
          sl_rt: "재무내용(원)(매출액(비중(%)(A/B)))",
          dbt_inh_bsn: "재무내용(원)(부채액(양수대상 영업부문(A)))",
          dbt_cmp_all: "재무내용(원)(부채액(당사전체(B)))",
          dbt_rt: "재무내용(원)(부채액(비중(%)(A/B)))",
          inh_pp: "양수목적",
          inh_af: "양수영향",
          inh_prd_ctr_cnsd: "양수예정일자(계약체결일)",
          inh_prd_inh_std: "양수예정일자(양수기준일)",
          dlptn_cmpnm: "거래상대방(회사명(성명))",
          dlptn_cpt: "거래상대방(자본금(원))",
          dlptn_mbsn: "거래상대방(주요사업)",
          dlptn_hoadd: "거래상대방(본점소재지(주소))",
          dlptn_rl_cmpn: "거래상대방(회사와의 관계)",
          inh_pym: "양수대금지급",
          exevl_atn: "외부평가에 관한 사항(외부평가 여부)",
          exevl_bs_rs: "외부평가에 관한 사항(근거 및 사유)",
          exevl_intn: "외부평가에 관한 사항(외부평가기관의 명칭)",
          exevl_pd: "외부평가에 관한 사항(외부평가 기간)",
          exevl_op: "외부평가에 관한 사항(외부평가 의견)",
          gmtsck_spd_atn: "주주총회 특별결의 여부",
          gmtsck_prd: "주주총회 예정일자",
          aprskh_plnprc: "주식매수청구권에 관한 사항(매수예정가격)",
          aprskh_pym_plpd_mth:
            "주식매수청구권에 관한 사항(지급예정시기, 지급방법)",
          aprskh_lmt:
            "주식매수청구권에 관한 사항(주식매수청구권 제한 관련 내용)",
          aprskh_ctref: "주식매수청구권에 관한 사항(계약에 미치는 효력)",
          bddd: "이사회결의일(결정일)",
          od_a_at_t: "사외이사참석여부(참석(명))",
          od_a_at_b: "사외이사참석여부(불참(명))",
          adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
          bdlst_atn: "우회상장 해당 여부",
          n6m_tpai_plann: "향후 6월이내 제3자배정 증자 등 계획",
          otcpr_bdlst_sf_atn: "타법인의 우회상장 요건 충족여부",
          ftc_stt_atn: "공정거래위원회 신고대상 여부",
          popt_ctr_atn: "풋옵션 등 계약 체결여부",
          popt_ctr_cn: "계약내용",
        },
      ],
    },
  }
);

export async function getBusinessAcquisitionDecision(
  params: GetBusinessAcquisitionDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/bsnInhDecsn.json", params)
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

// 3. 영업양도 결정 API
export const getBusinessTransferDecisionSchema = commonMaterialEventSchema;
export type GetBusinessTransferDecisionParams = z.infer<
  typeof getBusinessTransferDecisionSchema
>;

export const getBusinessTransferDecisionResponseDescription = JSON.stringify({
  result: {
    status: "에러 및 정보 코드",
    message: "에러 및 정보 메시지",
    list: [
      {
        rcept_no: "접수번호(14자리)",
        corp_cls: "법인구분 : Y(유가), K(코스닥), N(코넥스), E(기타)",
        corp_code: "공시대상회사의 고유번호(8자리)",
        corp_name: "회사명",
        tf_bsn: "양도영업",
        tf_bsn_mc: "양도영업 주요내용",
        tf_prc: "양도가액(원)",
        ast_trf_bsn: "재무내용(원)(자산액(양도대상 영업부문(A)))",
        ast_cmp_all: "재무내용(원)(자산액(당사전체(B)))",
        ast_rt: "재무내용(원)(자산액(비중(%)(A/B)))",
        sl_trf_bsn: "재무내용(원)(매출액(양도대상 영업부문(A)))",
        sl_cmp_all: "재무내용(원)(매출액(당사전체(B)))",
        sl_rt: "재무내용(원)(매출액(비중(%)(A/B)))",
        trf_pp: "양도목적",
        trf_af: "양도영향",
        trf_prd_ctr_cnsd: "양도예정일자(계약체결일)",
        trf_prd_tf_std: "양도예정일자(양도기준일)",
        dlptn_cmpnm: "거래상대방(회사명(성명))",
        dlptn_cpt: "거래상대방(자본금(원))",
        dlptn_mbsn: "거래상대방(주요사업)",
        dlptn_hoadd: "거래상대방(본점소재지(주소))",
        dlptn_rl_cmpn: "거래상대방(회사와의 관계)",
        trf_pym: "양도대금지급",
        exevl_atn: "외부평가에 관한 사항(외부평가 여부)",
        exevl_bs_rs: "외부평가에 관한 사항(근거 및 사유)",
        exevl_intn: "외부평가에 관한 사항(외부평가기관의 명칭)",
        exevl_pd: "외부평가에 관한 사항(외부평가 기간)",
        exevl_op: "외부평가에 관한 사항(외부평가 의견)",
        gmtsck_spd_atn: "주주총회 특별결의 여부",
        gmtsck_prd: "주주총회 예정일자",
        aprskh_plnprc: "주식매수청구권에 관한 사항(매수예정가격)",
        aprskh_pym_plpd_mth:
          "주식매수청구권에 관한 사항(지급예정시기, 지급방법)",
        aprskh_lmt: "주식매수청구권에 관한 사항(주식매수청구권 제한 관련 내용)",
        aprskh_ctref: "주식매수청구권에 관한 사항(계약에 미치는 효력)",
        bddd: "이사회결의일(결정일)",
        od_a_at_t: "사외이사참석여부(참석(명))",
        od_a_at_b: "사외이사참석여부(불참(명))",
        adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
        ftc_stt_atn: "공정거래위원회 신고대상 여부",
        popt_ctr_atn: "풋옵션 등 계약 체결여부",
        popt_ctr_cn: "계약내용",
      },
    ],
  },
});

export async function getBusinessTransferDecision(
  params: GetBusinessTransferDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/bsnTrfDecsn.json", params)
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

// 4. 유형자산 양수 결정 API
export const getTangibleAssetAcquisitionDecisionSchema =
  commonMaterialEventSchema;
export type GetTangibleAssetAcquisitionDecisionParams = z.infer<
  typeof getTangibleAssetAcquisitionDecisionSchema
>;

export const getTangibleAssetAcquisitionDecisionResponseDescription =
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
          ast_sen: "자산구분",
          ast_nm: "자산명",
          inhdtl_inhprc: "양수내역(양수금액(원))",
          inhdtl_tast: "양수내역(자산총액(원))",
          inhdtl_tast_vs: "양수내역(자산총액대비(%))",
          inh_pp: "양수목적",
          inh_af: "양수영향",
          inh_prd_ctr_cnsd: "양수예정일자(계약체결일)",
          inh_prd_inh_std: "양수예정일자(양수기준일)",
          inh_prd_rgs_prd: "양수예정일자(등기예정일)",
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
          gmtsck_spd_atn: "주주총회 특별결의 여부",
          gmtsck_prd: "주주총회 예정일자",
          aprskh_exrq: "주식매수청구권에 관한 사항(행사요건)",
          aprskh_plnprc: "주식매수청구권에 관한 사항(매수예정가격)",
          aprskh_ex_pc_mth_pd_pl:
            "주식매수청구권에 관한 사항(행사절차, 방법, 기간, 장소)",
          aprskh_pym_plpd_mth:
            "주식매수청구권에 관한 사항(지급예정시기, 지급방법)",
          aprskh_lmt:
            "주식매수청구권에 관한 사항(주식매수청구권 제한 관련 내용)",
          aprskh_ctref: "주식매수청구권에 관한 사항(계약에 미치는 효력)",
          bddd: "이사회결의일(결정일)",
          od_a_at_t: "사외이사참석여부(참석(명))",
          od_a_at_b: "사외이사참석여부(불참(명))",
          adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
          ftc_stt_atn: "공정거래위원회 신고대상 여부",
          popt_ctr_atn: "풋옵션 등 계약 체결여부",
          popt_ctr_cn: "계약내용",
        },
      ],
    },
  });

export async function getTangibleAssetAcquisitionDecision(
  params: GetTangibleAssetAcquisitionDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/tgastInhDecsn.json", params)
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

// 5. 유형자산 양도 결정 API
export const getTangibleAssetTransferDecisionSchema = commonMaterialEventSchema;
export type GetTangibleAssetTransferDecisionParams = z.infer<
  typeof getTangibleAssetTransferDecisionSchema
>;

export const getTangibleAssetTransferDecisionResponseDescription =
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
          ast_sen: "자산구분",
          ast_nm: "자산명",
          trfdtl_tfprc: "양도내역(양도금액(원))",
          trfdtl_tast: "양도내역(자산총액(원))",
          trfdtl_tast_vs: "양도내역(자산총액대비(%))",
          trf_pp: "양도목적",
          trf_af: "양도영향",
          trf_prd_ctr_cnsd: "양도예정일자(계약체결일)",
          trf_prd_trf_std: "양도예정일자(양도기준일)",
          trf_prd_rgs_prd: "양도예정일자(등기예정일)",
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
          gmtsck_spd_atn: "주주총회 특별결의 여부",
          gmtsck_prd: "주주총회 예정일자",
          aprskh_exrq: "주식매수청구권에 관한 사항(행사요건)",
          aprskh_plnprc: "주식매수청구권에 관한 사항(매수예정가격)",
          aprskh_ex_pc_mth_pd_pl:
            "주식매수청구권에 관한 사항(행사절차, 방법, 기간, 장소)",
          aprskh_pym_plpd_mth:
            "주식매수청구권에 관한 사항(지급예정시기, 지급방법)",
          aprskh_lmt:
            "주식매수청구권에 관한 사항(주식매수청구권 제한 관련 내용)",
          aprskh_ctref: "주식매수청구권에 관한 사항(계약에 미치는 효력)",
          bddd: "이사회결의일(결정일)",
          od_a_at_t: "사외이사참석여부(참석(명))",
          od_a_at_b: "사외이사참석여부(불참(명))",
          adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
          ftc_stt_atn: "공정거래위원회 신고대상 여부",
          popt_ctr_atn: "풋옵션 등 계약 체결여부",
          popt_ctr_cn: "계약내용",
        },
      ],
    },
  });

export async function getTangibleAssetTransferDecision(
  params: GetTangibleAssetTransferDecisionParams
) {
  const response = await dartRequest(
    buildUrl("https://opendart.fss.or.kr/api/tgastTrfDecsn.json", params)
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

// 6. 타법인 주식 및 출자증권 양수결정 API
export const getOtherCorpStockAcquisitionDecisionSchema =
  commonMaterialEventSchema;
export type GetOtherCorpStockAcquisitionDecisionParams = z.infer<
  typeof getOtherCorpStockAcquisitionDecisionSchema
>;

export const getOtherCorpStockAcquisitionDecisionResponseDescription =
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
          iscmp_cmpnm: "발행회사(회사명)",
          iscmp_nt: "발행회사(국적)",
          iscmp_rp: "발행회사(대표자)",
          iscmp_cpt: "발행회사(자본금(원))",
          iscmp_rl_cmpn: "발행회사(회사와 관계)",
          iscmp_tisstk: "발행회사(발행주식 총수(주))",
          iscmp_mbsn: "발행회사(주요사업)",
          l6m_tpa_nstkaq_atn: "최근 6월 이내 제3자 배정에 의한 신주취득 여부",
          inhdtl_stkcnt: "양수내역(양수주식수(주))",
          inhdtl_inhprc: "양수내역(양수금액(원)(A))",
          inhdtl_tast: "양수내역(총자산(원)(B))",
          inhdtl_tast_vs: "양수내역(총자산대비(%)(A/B))",
          inhdtl_ecpt: "양수내역(자기자본(원)(C))",
          inhdtl_ecpt_vs: "양수내역(자기자본대비(%)(A/C))",
          atinh_owstkcnt: "양수후 소유주식수 및 지분비율(소유주식수(주))",
          atinh_eqrt: "양수후 소유주식수 및 지분비율(지분비율(%))",
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
          od_a_at_t: "사외이사참석여부(참석(명))",
          od_a_at_b: "사외이사참석여부(불참(명))",
          adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
          bdlst_atn: "우회상장 해당 여부",
          n6m_tpai_plann: "향후 6월이내 제3자배정 증자 등 계획",
          iscmp_bdlst_sf_atn: "발행회사(타법인)의 우회상장 요건 충족여부",
          ftc_stt_atn: "공정거래위원회 신고대상 여부",
          popt_ctr_atn: "풋옵션 등 계약 체결여부",
          popt_ctr_cn: "계약내용",
        },
      ],
    },
  });

export async function getOtherCorpStockAcquisitionDecision(
  params: GetOtherCorpStockAcquisitionDecisionParams
) {
  const response = await dartRequest(
    buildUrl(
      "https://opendart.fss.or.kr/api/otcprStkInvscrInhDecsn.json",
      params
    )
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

// 7. 타법인 주식 및 출자증권 양도결정 API
export const getOtherCorpStockTransferDecisionSchema =
  commonMaterialEventSchema;
export type GetOtherCorpStockTransferDecisionParams = z.infer<
  typeof getOtherCorpStockTransferDecisionSchema
>;

export const getOtherCorpStockTransferDecisionResponseDescription =
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
          iscmp_cmpnm: "발행회사(회사명)",
          iscmp_nt: "발행회사(국적)",
          iscmp_rp: "발행회사(대표자)",
          iscmp_cpt: "발행회사(자본금(원))",
          iscmp_rl_cmpn: "발행회사(회사와 관계)",
          iscmp_tisstk: "발행회사(발행주식 총수(주))",
          iscmp_mbsn: "발행회사(주요사업)",
          trfdtl_stkcnt: "양도내역(양도주식수(주))",
          trfdtl_trfprc: "양도내역(양도금액(원)(A))",
          trfdtl_tast: "양도내역(총자산(원)(B))",
          trfdtl_tast_vs: "양도내역(총자산대비(%)(A/B))",
          trfdtl_ecpt: "양도내역(자기자본(원)(C))",
          trfdtl_ecpt_vs: "양도내역(자기자본대비(%)(A/C))",
          attrf_owstkcnt: "양도후 소유주식수 및 지분비율(소유주식수(주))",
          attrf_eqrt: "양도후 소유주식수 및 지분비율(지분비율(%))",
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
          od_a_at_t: "사외이사참석여부(참석(명))",
          od_a_at_b: "사외이사참석여부(불참(명))",
          adt_a_atn: "감사(사외이사가 아닌 감사위원) 참석여부",
          ftc_stt_atn: "공정거래위원회 신고대상 여부",
          popt_ctr_atn: "풋옵션 등 계약 체결여부",
          popt_ctr_cn: "계약내용",
        },
      ],
    },
  });

export async function getOtherCorpStockTransferDecision(
  params: GetOtherCorpStockTransferDecisionParams
) {
  const response = await dartRequest(
    buildUrl(
      "https://opendart.fss.or.kr/api/otcprStkInvscrTrfDecsn.json",
      params
    )
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
