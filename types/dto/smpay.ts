import { ResponseWithPagination } from "../api/common";
import type { ResponseDailyStat } from "../api/smpay";
import type { SmPayAdvertiserStatus } from "../smpay";

// SM Pay > 이력 리스트 모달
export type SMPayFormHistory = {
  no: number;
  advertiserCustomerId: string;
  advertiserLoginId: string;
  advertiserNickname: string;
  advertiserName: string;
  advertiserStatus: SmPayAdvertiserStatus;
  registerOrUpdateDt: string;
  advertiserFormId: number;
  advertiserId: number;
};

export interface DailyStatDto extends ResponseDailyStat {
  no: number;
}

export type ChargeRuleDto = {
  standardRoasPercent: number;
  changePercentOrValue: number;
  rangeType: "UP" | "DOWN";
  boundType: "FIXED_AMOUNT" | "PERCENT";
};

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

// 운영 계좌 잔액 조회(AAG027)
export type OverviewAccountBalanceDto = {
  balance: number;
  dailyUsingAmount: number;
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

// SM-Pay 심사 > 요청 목록 리스트 DTO
export type SmPayAuditListDto = ResponseWithPagination & {
  content: (SmPayAuditDto & {
    no: number;
  })[];
};

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

// 광고주 심사자 참고용 메모 조회 DTO
export type ReviewerMemoDto = {
  advertiserReviewerMemosId: number;
  description: string;
};

// 운영 검토 시 참고용 메모
export type ApprovalMemoDto = {
  advertiserApprovalMemosId: number;
  description: string;
};

export type AdvertiserDescriptionDto = {
  description: string;
  advertiserId: number;
  advertiserStatusMemosId: string;
};

// 광고주 detail 조회 DTO
export type AdvertiserDetailDto = {
  advertiserId: number;
  userId: number;
  customerId: number;
  agentId: number;
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
  description: AdvertiserDescriptionDto;
};
