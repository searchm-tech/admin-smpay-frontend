import {
  ChargeRule,
  PrePaymentSchedule,
  SmPayAdvertiserApplyDto,
  SmPayAdvertiserStatus,
  SmPayAdvertiserStatusDto,
  SmPayAdvertiserStautsOrderType,
  SmPayAuditDto,
} from "@/types/smpay";

import { RequestAgentUser, ResponseWithPagination } from "./common";

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
export type SmPayAdvertiserApplyQuery = {
  page: number;
  size: number;
  keyword: string;
  orderType: SmPayAdvertiserStatus;
};

// 광고주 smPay 신청 관리 리스트 조회(SAG022) request type
export type RequestSmPayAdvertiserApply = {
  user: RequestAgentUser;
  queryParams: SmPayAdvertiserApplyQuery;
};

// 광고주 smPay 신청 관리 리스트 조회(SAG022) response type
export type ResponseSmPayAdvertiserApply = {
  content: SmPayAdvertiserApplyDto[];
  page: number;
  size: number;
  totalCount: number;
};

// AgentUser 타입에 advertiserId 추가
export type WithAdvertiserId = {
  user: RequestAgentUser;
  advertiserId: number;
};

// 광고주 detail 조회(SAG024) response type
export type AdvertiserDetailDto = {
  advertiserId: number;
  userId: number;
  customerId: number;
  id: string;
  nickName: string;
  name: string;
  representativeName: string;
  businessRegistrationNumber: string;
  phoneNumber: string;
  emailAddress: string;
  status: SmPayAdvertiserStatus;
  roleId: number;
  isLossPrivileges: boolean;
  advertiserFormId: number;
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

export interface RequestSmPayDetail extends WithAdvertiserId {
  formId: number | string;
}

// SM-Pay 심사 > 요청 목록 리스트
export type ResponseSmPayAudit = ResponseWithPagination & {
  content: (SmPayAuditDto & {
    no: number;
  })[];
};

export interface RequestSmPayRead extends WithAdvertiserId {
  isApprovalRead: boolean;
}

// 광고주 심상 승인 /거절 (최상위 그룹장 전용)(SAG036) params type
export type ParamsSmPayApproval = {
  decisionType: "APPROVE" | "REJECT";
  statIndicator: StatIndicatorParams;
  chargeRule: ChargeRule[];
  prePaymentSchedule: PrePaymentSchedule;
  reviewerMemo: string;
  approvalMemo: string;
  rejectStatusMemo: string;
};

export type ChargeRuleDto = {
  advertiserChargeRuleId: number;
  advertiserId: number;
  standardRoasPercent: number;
  changePercentOrValue: number;
  rangeType: "UP" | "DOWN";
  boundType: "FIXED_AMOUNT" | "PERCENT";
};

export type PrePaymentScheduleDto = {
  advertiserPrepaymentScheduleId: number;
  advertiserId: number;
  initialAmount: number;
  maxChargeLimit: number;
  minChargeLimit: number;
};
