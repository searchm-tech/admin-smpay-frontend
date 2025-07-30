import {
  PrePaymentSchedule,
  SmPayAdvertiserStatus,
  SmPayAdvertiserStautsOrderType,
} from "@/types/smpay";

import type {
  RequestAgentUser,
  ResponseWithPagination,
  WithAdvertiserId,
} from "./common";

import type {
  ChargeRuleDto,
  SmPayAdvertiserStatusDto,
  OverviewApplyAccountDto,
  SmPayAdminAuditDto,
  SmPayChargeRecoveryDto,
} from "../dto/smpay";

// 광고주 상태 갯수 조회(AAG028) response type
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

export interface RequestSmPayAdminRead extends WithAdvertiserId {
  isOperatorRead: boolean;
}

// 광고주 운영 심사 승인/반려 (운영 관리자 전용) (AAG026)
export type ParamsSmPayAdminOverviewOperatorDecision = {
  decisionType: "APPROVE" | "REJECT";
  chargeRule: ChargeRuleDto[];
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
