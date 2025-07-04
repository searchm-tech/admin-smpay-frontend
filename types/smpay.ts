export type SmPayAdvertiserStatus =
  | "UNSYNC_ADVERTISER"
  | "APPLICABLE"
  | "WAIT_REVIEW"
  | "REJECT"
  | "OPERATION_REVIEW"
  | "OPERATION_REJECT"
  | "OPERATION_REVIEW_SUCCESS"
  | "OPERATION"
  | "PAUSE"
  | "TERMINATE_WAIT"
  | "TERMINATE"
  | "ADVERTISER_AGREE_WAIT"
  | "ADVERTISER_AGREE_TIME_EXPIRE"
  | "CANCEL"
  | "REGISTER_WITHDRAW_ACCOUNT_FAIL";

// SMPay 신청 > 광고주 목록 광고주 데이터 DTO
export type SmPayAdvertiserApplyDto = {
  advertiserId: number;
  advertiserCustomerId: number;
  advertiserLoginId: string;
  advertiserNickName: number;
  advertiserName: string;
  advertiserType: SmPayAdvertiserStatus;
  registerOrUpdateDt: string;
};

export type SmPayAdvertiserStautsOrderType =
  | "ADVERTISER_REGISTER_DESC"
  | "ADVERTISER_REGISTER_ASC"
  | "ADVERTISER_STATUS_DESC"
  | "ADVERTISER_STATUS_ASC"
  | "ADVERTISER_NAME_DESC"
  | "ADVERTISER_NAME_ASC"
  | "ADVERTISER_ID_DESC"
  | "ADVERTISER_ID_ASC"
  | "ADVERTISER_CUSTOMER_ID_DESC"
  | "ADVERTISER_CUSTOMER_ID_ASC"
  | "NO_ASC";

// SMPay 관리 > 광고주 상태 데이터 DTO
export type SmPayAdvertiserStatusDto = {
  no: number;
  advertiserId: number;
  userId: number;
  userName: string;
  advertiserCustomerId: number;
  advertiserLoginId: string;
  advertiserName: string;
  advertiserType: SmPayAdvertiserStatus;
  description: string;
  descriptionRegisterDt: string;
  registerOrUpdateDt: string;
  isMyAdvertiser: true;
  advertiserFormId: number;
};

export type ChargeRule = {
  standardRoasPercent: number; //  1; // 기준 ROAS
  rangeType: string; // "UP";
  boundType: string; //  "FIXED_AMOUNT"; // 정액
  changePercentOrValue: number; // 1;
};
export type PrePaymentSchedule = {
  initialAmount: number; // 1;
  maxChargeLimit: number; //  1;
  minChargeLimit: number; // 1; -> 일 최소 충전 한도 값은 없으므로 0으로 해도 되는지
};

// SMPay 심사 > 요청 목록 DTO
export type SmPayAuditDto = {
  advertiserId: number;
  userId: number;
  userName: string;
  advertiserCustomerId: number;
  advertiserLoginId: string;
  advertiserName: string;
  advertiserType: SmPayAdvertiserStatus;
  registerOrUpdateDt: string;
  isApprovalRead: boolean;
  isReviewerRead: boolean;
  advertiserFormId: number;
};

export type SmPayStatIndicator = {
  operationPeriod: number; // 운영 기간
  dailyAverageRoas: number; // 일별 평균 ROAS 1.0,
  monthlyConvAmt: number; // 월별 전환액 1000.0,
  dailySalesAmt: number; // 일별 매출액 100.0,
  recommendRoas: number; // 권장 ROAS  0.8,
};

// 심사 상세 > 최상위 그룹장 전용 심사 지표 조회 DTO
export type SmPayScreeningIndicator = {
  advertiserScreeningIndicatorId: number;
  advertiserId: number;
  advertiserOperationPeriod: number;
  advertiserDailyAverageRoas: number;
  advertiserMonthlyConvAmt: number;
  advertiserDailySalesAmt: number;
  advertiserRecommendRoasPercent: number;
};

// 심사 상세 > 광고주 심사자 참고용 메모 조회 DTO
export type SmPayReviewerMemo = {
  advertiserReviewerMemosId: number;
  description: string;
};

// 심사 상세 > 광고주 최상위 그룹장 참고용 메모 조회 DTO
export type SmPayApprovalMemo = {
  advertiserApprovalMemosId: number;
  description: string;
};

// [시스템 관리자] 광고주 심사 관리 리스트 조회 (운영 관리자 전용) (AAG018)
export type SmPayAdminAuditDto = {
  id: number;
  agentId: number;
  agentName: string;
  userId: number;
  userName: string;
  advertiserId: number;
  advertiserCustomerId: number;
  advertiserLoginId: string;
  advertiserNickname: string;
  advertiserName: string;
  advertiserType: SmPayAdvertiserStatus;
  registerOrUpdateDt: string;
  isOperatorRead: boolean;
};

export type OverviewApplyAccountDto = {
  advertiserFormAccountId: number;
  advertiserFormId: number;
  advertiserAccountCode: string;
  advertiserAccountCodeName: string;
  advertiserAccountNumber: string;
  advertiserAccountName: string;
  advertiserAccountType: string; // DEPOSIT, WITHDRAW
};

// 운영 계좌 잔액 조회(AAG027)
export type OverviewAccountBalanceDto = {
  balance: number;
  dailyUsingAmount: number;
};
