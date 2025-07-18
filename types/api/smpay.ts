import {
  ChargeRule,
  PrePaymentSchedule,
  SmPayAdvertiserStatus,
  SmPayAdvertiserStautsOrderType,
} from "@/types/smpay";

import type {
  RequestAgentUser,
  RequestWithPagination,
  ResponseWithPagination,
  WithAdvertiserId,
} from "./common";

import type {
  ChargeRuleDto,
  SmPayAdvertiserStatusDto,
  OverviewApplyAccountDto,
  SmPayAdminAuditDto,
  SmPayAdvertiserApplyDto,
  AdvertiserDetailDto,
  AdvertiserDescriptionDto,
  SmPayChargeRecoveryDto,
} from "../dto/smpay";

// 광고주 상태 갯수 조회(SAG020) response type
export interface ResponseSmPayStatusCount {
  totalCount: number;
  waitReviewCount: number;
  rejectCount: number;
  operationReviewCount: number;
  operationRejectCount: number;
  operationReviewSuccessCount: number;
  advertiserAgreeWaitCount: number;
  advertiserAgreeTimeExpireCount: number;
  cancelCount: number;
  registerWithDrawAccountFailCount: number;
  operationCount: number;
  pauseCount: number;
  terminateWaitCount: number;
  terminateCount: number;
}

// 광고주 상태 리스트 페이지네이션 조회(SAG019) request type
export type RequestSmPayAdvertiserStatus = {
  user: RequestAgentUser;
  queryParams: QueryParams;
};

// 광고주 상태 리스트 페이지네이션 조회(SAG019) query params type
export type QueryParams = {
  page: number;
  size: number;
  keyword: string;
  orderType: SmPayAdvertiserStautsOrderType;
};

// SM-Pay 관리 > 광고주 상태 리스트
export type ResponseSmPayAdvertiserStatus = ResponseWithPagination & {
  content: SmPayAdvertiserStatusDto[];
};

// 광고주 상태 리스트 페이지네이션 조회(SAG019) query params type
export type SmPayAdvertiserApplyQuery = RequestWithPagination & {
  orderType: SmPayAdvertiserStatus;
};

// 광고주 smPay 신청 관리 리스트 조회(SAG022) request type
export type RequestSmPayAdvertiserApply = {
  user: RequestAgentUser;
  queryParams: SmPayAdvertiserApplyQuery;
};

// 광고주 smPay 신청 관리 리스트 조회(SAG022) response type
export interface ResponseSmPayAdvertiserApply extends ResponseWithPagination {
  content: SmPayAdvertiserApplyDto[];
}

export interface RequestFormId extends WithAdvertiserId {
  formId: number | string;
}

// 광고주 detail 조회(SAG024) response type
export type ResponseAdvertiserDetail = {
  advertiser: AdvertiserDetailDto;
  description: AdvertiserDescriptionDto;
};

// 광고주 detail 등록 및 수정(SAG023) request type
export interface RequestSmPayAdvertiserDetailPut extends WithAdvertiserId {
  params: PutSmPayAdvertiserDetail;
}

export type PutSmPayAdvertiserDetail = {
  name: string;
  representativeName: string;
  representativeNumber: string;
  phoneNumber: string;
  email: string;
};

// 광고주 성과 기반 참고용 심사 지표 조회(28일)(SAG028) response type
// TODO : 제거 예정
export type ResponseSmPayAdvertiserStatIndicator = {
  operationPeriod: number; // 운영 기간
  dailyAverageRoas: number; // 일별 평균 ROAS 1.0,
  monthlyConvAmt: number; // 월별 전환액 1000.0,
  dailySalesAmt: number; // 일별 매출액 100.0,
  recommendRoas: number; // 권장 ROAS  0.8,
};

// 광고주 smPay 등록(SAG029) request type
export type StatIndicatorParams = {
  operationPeriod: number; //  1;
  dailyAverageRoas: number; //1.0;
  monthlyConvAmt: number; //1.0;
  dailySalesAmt: number; //1.0;
  recommendRoasPercent: number; // 1.0;
};

export type SmPayWriteParams = {
  statIndicator: StatIndicatorParams;
  chargeRule: ChargeRule[];
  prePaymentSchedule: PrePaymentSchedule;
  reviewerMemo: string;
};

// 광고주 smPay 등록(SAG029) request type
export interface RequestSmPayWrite extends WithAdvertiserId {
  params: SmPayWriteParams;
}

export interface RequestSmPayRead extends WithAdvertiserId {
  isApprovalRead: boolean;
}

export interface RequestSmPayAdminRead extends WithAdvertiserId {
  isOperatorRead: boolean;
}

// 광고주 심상 승인 /거절 (최상위 그룹장 전용)(SAG036) params type
export type ParamsSmPayApproval = {
  decisionType: "APPROVE" | "REJECT" | "";
  chargeRule: ChargeRule[];
  statIndicator: StatIndicatorParams;
  prePaymentSchedule: PrePaymentSchedule;
  reviewerMemo: string;
  approvalMemo: string;
  rejectStatusMemo: string;
};

// 광고주 운영 심사 승인/반려 (운영 관리자 전용) (AAG026)
export type ParamsSmPayAdminOverviewOperatorDecision = {
  decisionType: "APPROVE" | "REJECT";
  chargeRule: ChargeRule[];
  prePaymentSchedule: PrePaymentSchedule;
  reviewerMemo: string;
  approvalMemo: string;
  rejectStatusMemo: string;
};

export type PrePaymentScheduleDto = {
  advertiserPrepaymentScheduleId: number;
  advertiserId: number;
  initialAmount: number;
  maxChargeLimit: number;
  minChargeLimit: number;
};

export type ResponseSmPayAdminAudit = ResponseWithPagination & {
  content: SmPayAdminAuditDto[];
};

// 광고주 smPay 신청 이력 상세 조회 (운영 관리자 전용) (AAG022)
export type RequestSmPayAdminOverviewApplyFormDetail = {
  user: RequestAgentUser;
  advertiserId: number;
  formId: number;
};

// 광고주 운영 심사 승인/반려 (운영 관리자 전용) (AAG026)
export type AdminOverviewOperatorDecision = {
  user: RequestAgentUser;
  advertiserId: number;
  params: ParamsSmPayAdminOverviewOperatorDecision;
};

export type ResponseOverviewForm = {
  chargeRules: ChargeRuleDto[];
  accounts: OverviewApplyAccountDto[];
  advertiserFormId: number;
  advertiserId: number;
  advertiserCustomerId: number;
  advertiserLoginId: string;
  advertiserStatus: SmPayAdvertiserStatus;
  advertiserName: string;
  advertiserNickname: string;
  advertiserRepresentativeName: string;
  advertiserPhoneNumber: string;
  advertiserEmailAddress: string;
  advertiserOperationPeriod: number;
  advertiserDailyAverageRoas: number;
  advertiserMonthlyConvAmt: number;
  advertiserDailySalesAmt: number;
  advertiserRecommendRoasPercent: number;
  advertiserStandardRoasPercent: number;
  advertiserRejectDescription: string;
  initialAmount: number;
  maxChargeLimit: number;
  minChargeLimit: number;
  reviewerMemo: string;
  approvalMemo: string;
  registerDt: string;
  updateDt: string;
};

/**
 * SM Pay 상세 내용
 * - API : 광고주 smPay 신청 이력 상세 조회(SAG026) response type
 * - API : 광고주 smPay 신청 이력 리스트 조회(SAG025)
 */
export type ResponseSMPayDetail = {
  chargeRules: ChargeRule[];
  advertiserFormId: number;
  advertiserId: number;
  advertiserStatus: SmPayAdvertiserStatus;
  advertiserName: string;
  advertiserNickname: string;
  advertiserLoginId: string;
  advertiserCustomerId: number;
  advertiserRepresentativeName: string;
  advertiserPhoneNumber: string;
  advertiserEmailAddress: string;
  advertiserOperationPeriod: number;
  advertiserDailyAverageRoas: number;
  advertiserMonthlyConvAmt: number;
  advertiserDailySalesAmt: number;
  advertiserRecommendRoasPercent: number;
  advertiserStandardRoasPercent: number;
  advertiserRejectDescription: string;
  initialAmount: number;
  maxChargeLimit: number;
  minChargeLimit: number;
  reviewerMemo: string;
  approvalMemo: string;
  registerDt: string;
  updateDt: string;
};

// 광고주 일별 통계
export type ResponseDailyStat = {
  advertiserId: number; // 광고주 UID
  impCnt: number; // 노출 수
  clkCnt: number; // 클릭 수
  salesAmt: number; // 광고비
  avgRnk: number; // 평균 노출 순위
  convAmt: number; // 전환 매출
  cpc: number; // 클릭 단가
  ccnt: number; // 전환 수
  crto: number; // 전환율
  cpConv: number; // 전환당 비용
  ror: number; // roas
  date: string; // 날짜
};

// 충전 규칙 response type
export type ResponseChargeRule = {
  advertiserChargeRuleId: number;
  advertiserId: number;
  standardRoasPercent: number;
  changePercentOrValue: number;
  rangeType: "UP" | "DOWN";
  boundType: "FIXED_AMOUNT" | "PERCENT";
};

// 충전/회수 이력 리스트 조회(AAG034) response type
export type ResponseSmPayChargeRecovery = ResponseWithPagination & {
  content: SmPayChargeRecoveryDto[];
};

// 충전/회수 이력 리스트 조회(AAG034) request type
export type ChargeRecoveryParams = {
  page: number;
  size: number;
  agentUniqueCode: string;
  advertiserCustomerId: number;
  startDate: string;
  endDate: string;
  isNotRecoveryAdvertiser: boolean;
};
