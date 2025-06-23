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
  content: (SmPayAdvertiserStatusDto & {
    no: number;
  })[];
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

// 광고주 smPay 신청 이력 상세 조회(SAG026) response type
export type ResponseSmPayDetail = {
  chargeRules: ChargeRule[];
  advertiserFormId: number; // 1;
  advertiserId: number; // 1;
  advertiserStatus: SmPayAdvertiserStatus;
  advertiserName: string; // "광고주명";
  advertiserNickname: string; // "광고주 닉네임";
  advertiserRepresentativeName: string; //  "광고주 대표자명";
  advertiserPhoneNumber: string; //  "0101111111";
  advertiserEmailAddress: string; //  "pgw111111@naver.com";
  advertiserOperationPeriod: number; //  1;
  advertiserDailyAverageRoas: number; // 0.01;
  advertiserMonthlyConvAmt: number; // 0.01;
  advertiserDailySalesAmt: number; // 0.01;
  advertiserRecommendRoasPercent: number; // 0.01;
  advertiserStandardRoasPercent: number; // 1;
  advertiserRejectDescription: string; // "반려 사유";
  initialAmount: number; // 1;
  maxChargeLimit: number; // 1;
  minChargeLimit: number; // 1;
  reviewerMemo: string; // "심사자 메모";
  approvalMemo: string; // "운영자 메모";
  registerDt: string; //  null;
  updateDt: string; // null;
};

export interface RequestSmPayDetail extends WithAdvertiserId {
  formId: number;
}

export type ResponseSmPayApplyInfo = {
  chargeRules: ChargeRule[];
  advertiserFormId: number; // 1;
  advertiserId: number; // 1;
  advertiserStatus: SmPayAdvertiserStatus;
  advertiserName: string; // "광고주명";
  advertiserNickname: string; //  "광고주 닉네임";
  advertiserRepresentativeName: string; // "광고주 대표자명";
  advertiserPhoneNumber: string; // "0101111111";
  advertiserEmailAddress: string; // "pgw111111@naver.com";
  advertiserOperationPeriod: number; //1;
  advertiserDailyAverageRoas: number; // 0.01;
  advertiserMonthlyConvAmt: number; // 0.01;
  advertiserDailySalesAmt: number; // 0.01;
  advertiserRecommendRoasPercent: number; // 0.01;
  advertiserStandardRoasPercent: 1;
  advertiserRejectDescription: string; //  "반려 사유";
  initialAmount: number; // 1;
  maxChargeLimit: number; // 1;
  minChargeLimit: number; // 1;
  reviewerMemo: string; // "심사자 메모";
  approvalMemo: string; // "운영자 메모";
  registerDt: null;
  updateDt: null;
};

// SM-Pay 심사 > 요청 목록 리스트
export type ResponseSmPayAudit = ResponseWithPagination & {
  content: (SmPayAuditDto & {
    no: number;
  })[];
};

export interface RequestSmPayRead extends WithAdvertiserId {
  isReviewerRead: boolean;
}
