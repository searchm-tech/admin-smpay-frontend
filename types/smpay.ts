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

// SMPay 관리 상태
export type SmPayStatus =
  | "REVIEW_PENDING" // 심사 대기
  | "REVIEW_REJECTED" // 심사 반려
  | "OPERATION_REVIEW_PENDING" // 운영 검토 대기
  | "OPERATION_REVIEW_REJECTED" // 운영 검토 거절
  | "OPERATION_REVIEW_COMPLETED" // 운영 검토 완료
  | "ADVERTISER_AGREEMENT_PENDING" // 광고주 동의 대기
  | "ADVERTISER_AGREEMENT_EXPIRED" // 광고주 동의 기한 만료
  | "APPLICATION_CANCELLED" // 신청 취소
  | "WITHDRAWAL_ACCOUNT_REGISTRATION_FAILED" // 출금계좌 등록 실패
  | "OPERATING" // 운영 중
  | "SUSPENDED" // 일시중지
  | "TERMINATION_PENDING" // 해지 대기
  | "TERMINATED"; // 해지

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

// 이미지 기준으로 올바르게 매칭된 액션 버튼 타입
export type ActionButton =
  | "view" // 조회
  | "application_cancel" // 신청 취소
  | "reapply" // 재신청
  | "advertiser_agreement_send" // 광고주 동의 전송
  | "suspend" // 일시중지
  | "termination_request" // 해지 신청
  | "resume" // 재개
  | "resend"; // 재발송

export interface SmPayData {
  id: number; // For table key
  no: number; // No
  manager: string; // 담당자
  customerId: string; // CUSTOMER ID
  loginId: string; // 로그인 ID
  advertiserName: string; // 광고주명
  businessName: string;
  businessNumber: string;
  businessOwnerName: string;
  businessOwnerPhone: string;
  businessOwnerEmail: string;
  status: SmPayStatus; // 상태
  createdAt: string;
  updatedAt: string;
  lastModifiedAt: string; // 최종 수정일시
  chargeAccount: string;
  chargeAccountNumber: string;
  chargeAccountHolderName: string;
  chargeAccountBank: string;
  chargeAccountBankCode: string;
  chargeAccountBankName: string;
  salesAccount: string;
  salesAccountNumber: string;
  salesAccountHolderName: string;
  salesAccountBank: string;
  salesAccountBankCode: string;
  salesAccountBankName: string;
  nickname: string;
}

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
