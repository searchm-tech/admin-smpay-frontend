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
