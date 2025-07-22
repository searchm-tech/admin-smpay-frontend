import type { ActionButton } from "@/types/smpay";
import type { SmPayAdvertiserStatus } from "@/types/smpay";

export const SM_PAY_STATUS_LIST: { label: string; value: string }[] = [
  { label: "전체", value: "ALL" },
  { label: "심사 대기", value: "REVIEW_PENDING" },
  { label: "심사 반려", value: "REVIEW_REJECTED" },
  { label: "운영 검토 대기", value: "OPERATION_REVIEW_PENDING" },
  { label: "운영 검토 거절", value: "OPERATION_REVIEW_REJECTED" },
  { label: "운영 검토 완료", value: "OPERATION_REVIEW_COMPLETED" },
  { label: "광고주 동의 대기", value: "ADVERTISER_AGREEMENT_PENDING" },
  { label: "광고주 동의 기한 만료", value: "ADVERTISER_AGREEMENT_EXPIRED" },
  { label: "심사 취소", value: "APPLICATION_CANCELLED" },
  {
    label: "출금계좌 등록 실패",
    value: "WITHDRAWAL_ACCOUNT_REGISTRATION_FAILED",
  },
  { label: "운영 중", value: "OPERATING" },
  { label: "일시중지", value: "SUSPENDED" },
  { label: "해지 대기", value: "TERMINATION_PENDING" },
  { label: "해지", value: "TERMINATED" },
  { label: "비활성", value: "STOP" },
];

/**
 * 테이블 상태에 따른 버튼 기능들
 * - admin : 광고주 운영 현황
 * - 대행새 : SM Pay 관리
 */
export const STATUS_ACTION_BUTTONS: Record<
  SmPayAdvertiserStatus,
  ActionButton[]
> = {
  UNSYNC_ADVERTISER: ["view"], // 광고주 비동기화
  APPLICABLE: ["view"], // 신청 가능
  WAIT_REVIEW: ["view", "application_cancel"], // 심사 대기: 조회, 신청 취소
  REJECT: ["view", "reapply"], // 심사 반려: 조회, 재신청
  OPERATION_REVIEW: ["view", "application_cancel"], // 운영 검토 대기: 조회, 신청 취소
  OPERATION_REJECT: ["view", "reapply"], // 운영 검토 거절: 조회, 재신청
  OPERATION_REVIEW_SUCCESS: ["view", "advertiser_agreement_send"], // 운영 검토 완료: 조회, 광고주 동의 전송
  ADVERTISER_AGREE_WAIT: ["view", "application_cancel"], // 광고주 동의 대기: 조회, 신청 취소
  ADVERTISER_AGREE_TIME_EXPIRE: ["view", "application_cancel", "resend"], // 광고주 동의 기한 만료: 조회, 신청 취소, 재발송
  CANCEL: ["view", "reapply"], // 신청 취소: 조회, 재신청
  REGISTER_WITHDRAW_ACCOUNT_FAIL: ["view"], // 출금계좌 등록 실패: 조회
  OPERATION: ["view", "suspend", "termination_request"], // 운영 중: 조회, 일시중지, 해지 신청
  PAUSE: ["view", "termination_request", "resume"], // 일시중지: 조회, 해지 신청, 재개
  TERMINATE_WAIT: ["view"], // 해지 대기: 조회
  TERMINATE: ["view"], // 해지: 조회
} as const;

export const USER_STATUS_OPTS = [
  { label: "활성", value: "NORMAL" },
  { label: "비활성", value: "STOP" },
];

export const ADVERTISER_STATUS_MAP: Record<SmPayAdvertiserStatus, string> = {
  UNSYNC_ADVERTISER: "광고주 비동기화",
  APPLICABLE: "신청 가능",
  WAIT_REVIEW: "심사 대기",
  REJECT: "심사 반려",
  OPERATION_REVIEW: "운영 검토 대기",
  OPERATION_REJECT: "운영 검토 거절",
  OPERATION_REVIEW_SUCCESS: "운영 검토 완료",
  ADVERTISER_AGREE_WAIT: "광고주 동의 대기",
  ADVERTISER_AGREE_TIME_EXPIRE: "광고주 동의 기한 만료",
  CANCEL: "신청 취소",
  REGISTER_WITHDRAW_ACCOUNT_FAIL: "출금 계좌 등록 실패",
  OPERATION: "운영중",
  PAUSE: "일시중지",
  TERMINATE_WAIT: "해지 대기",
  TERMINATE: "해지",
};

/**
 * SmPay 광고주 신청 상태 라벨
 */
export const SmPayAdvertiserStatusLabel: Record<SmPayAdvertiserStatus, string> =
  ADVERTISER_STATUS_MAP;
