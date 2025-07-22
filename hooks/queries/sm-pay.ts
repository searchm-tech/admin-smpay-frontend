import {
  useQuery,
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";

import type { RequestAgentUser } from "@/types/api/common";
import type {
  ParamsSmPayAdminOverviewOperatorDecision,
  QueryParams,
  ResponseSmPayAdvertiserStatus,
  ResponseSmPayStatusCount,
  ResponseSmPayAdminAudit,
  ResponseOverviewForm,
  ResponseSMPayDetail,
  ResponseSmPayChargeRecovery,
  ChargeRecoveryParams,
  PrePaymentScheduleDto,
} from "@/types/api/smpay";

import { useAuthQuery } from "../useAuthQuery";
import { useAuthMutation } from "../useAuthMutation";
import {
  getSmPayAdvertiserDailyStat,
  getSmPayFormDetail,
  getSmPayApplyList,
  getSmPayAdminAuditList,
  getSmPayAdminOverviewChargeRule,
  patchSmPayAdminOverviewAlarm,
  getSmPayAdminOverviewDetail,
  getSmPayAdminOverviewApplyFormList,
  getSmPayAdminOverviewApplyFormDetail,
  getSmPayAdminOverviewPrePaymentSchedule,
  getSmPayAdminOverviewReviewerMemo,
  getSmPayAdminOverviewApprovalMemo,
  postSmPayAdminOverviewOperatorDecision,
  getSmPayAdminOverviewAccountBalance,
  postSmPayAdvertiserAgreeNotification,
  getSmPayDetailApprovalMemo,
  getSmPayAdminOverviewStatusList,
  getSmPayAdminOverviewStatusCount,
  getSmPayAdminChargeRecoveryList,
  getSmPayAdvertiserDetail,
} from "@/services/smpay";

import type {
  ChargeRuleDto,
  DailyStatDto,
  SMPayFormHistory,
  OverviewAccountBalanceDto,
  ApprovalMemoDto,
  ReviewerMemoDto,
  AdvertiserDetailDto,
} from "@/types/dto/smpay";

// 광고주 detail 조회(SAG024) query
export const useSmPayAdvertiserDetail = (advertiserId: number) => {
  return useAuthQuery<AdvertiserDetailDto>({
    queryKey: ["/smpay/advertiser-detail", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserDetail({ user, advertiserId }),
  });
};

// 광고주 일 별 성과 조회(28일)(SAG027) query
export const useSmPayAdvertiserDailyStat = (advertiserId: number) => {
  return useAuthQuery<DailyStatDto[]>({
    queryKey: ["/smpay/advertiser-daily-stat", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserDailyStat({ user, advertiserId }),
  });
};

// 광고주 smPay 신청 이력 상세 조회(SAG026) query
export const useSmPayFormDetail = (advertiserId: number, formId: number) => {
  return useAuthQuery<ResponseSMPayDetail>({
    queryKey: ["/smpay/detail", advertiserId, formId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayFormDetail({ user, advertiserId, formId }),
    enabled: !!advertiserId && !!formId && !isNaN(formId),
  });
};

// 광고주 smPay 신청 이력 리스트 조회(SAG025) query
export const useSmPayApplyList = (advertiserId: number) => {
  return useAuthQuery<SMPayFormHistory[]>({
    queryKey: ["/smpay/apply-list", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayApplyList({ user, advertiserId }),
  });
};

// 광고주 동의 이메일, 문자발송 (SAG037)
export const useSmPayAdvertiserAgreeNotification = (
  options?: UseMutationOptions<null, Error, number>
) => {
  return useAuthMutation<null, Error, number>({
    mutationFn: (variables, user) =>
      postSmPayAdvertiserAgreeNotification({
        user,
        advertiserId: variables,
      }),
    ...options,
  });
};

// ---- admin ----

// 광고주 심사 관리 리스트 조회 (운영 관리자 전용) (AAG018)
export const useSmPayAdminAuditList = (params: QueryParams) => {
  return useAuthQuery<ResponseSmPayAdminAudit>({
    queryKey: ["/smpay/admin-audit-list", params],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminAuditList({ user, queryParams: params }),
  });
};

// 광고주 충전 규칙 조회 (운영 관리자 전용) (AAG023)
export const useSmPayAdminOverviewChargeRule = (advertiserId: number) => {
  return useAuthQuery<ChargeRuleDto[]>({
    queryKey: ["/smpay/admin-overview-charge-rule", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewChargeRule({ user, advertiserId }),
  });
};

// 광고주 선결제 스케줄 조회 (운영 관리자 전용) (AAG024)
export const useSmPayAdminOverviewPrePaymentSchedule = (
  advertiserId: number
) => {
  return useAuthQuery<PrePaymentScheduleDto>({
    queryKey: ["/smpay/admin-overview-pre-payment-schedule", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewPrePaymentSchedule({ user, advertiserId }),
    enabled: !!advertiserId,
  });
};
// useSmPayWrite 훅에 전달될 variables 타입 정의
type SmPayReadAdminVariables = {
  advertiserId: number;
  isOperatorRead: boolean;
};

// 광고주 심사 목록 읽음, 미읽음 상태 변경 (운영 관리자 전용) (AAG019)
export const useSmPayAdminOverviewAlarm = (
  options?: UseMutationOptions<null, Error, SmPayReadAdminVariables>
) => {
  return useAuthMutation<null, Error, SmPayReadAdminVariables>({
    mutationFn: (variables, user) =>
      patchSmPayAdminOverviewAlarm({
        user,
        advertiserId: variables.advertiserId,
        isOperatorRead: variables.isOperatorRead,
      }),
    ...options,
  });
};

// 광고주 detail 조회 (운영 관리자 전용) (AAG020)
export const useSmPayAdminDetail = (
  advertiserId: number,
  agentId: number,
  userId: number
) => {
  return useAuthQuery<AdvertiserDetailDto>({
    queryKey: ["/smpay/admin-overview-detail", advertiserId, agentId, userId],
    queryFn: () =>
      getSmPayAdminOverviewDetail({
        advertiserId,
        agentId,
        userId,
      }),
    enabled: !!advertiserId && !!agentId && !!userId,
  });
};

// 광고주 smPay 신청 이력 리스트 조회 (운영 관리자 전용) (AAG021)
export const useSmPayAdminOverviewApplyFormList = (
  advertiserId: number,
  agentId: number,
  userId: number
) => {
  return useQuery<SMPayFormHistory[]>({
    queryKey: [
      "/smpay/admin-overview-apply-form-list",
      advertiserId,
      agentId,
      userId,
    ],
    queryFn: () =>
      getSmPayAdminOverviewApplyFormList({
        advertiserId,
        agentId,
        userId,
      }),
  });
};

// 광고주 smPay 신청 이력 상세 조회 (운영 관리자 전용) (AAG022)
export const useSmPayAdminOverviewApplyFormDetail = (
  advertiserId: number,
  formId: number,
  agentId: number,
  userId: number
) => {
  return useQuery<ResponseOverviewForm>({
    queryKey: [
      "/smpay/admin-overview-apply-form-detail",
      advertiserId,
      formId,
      agentId,
      userId,
    ],
    queryFn: () =>
      getSmPayAdminOverviewApplyFormDetail({
        advertiserId,
        formId,
        agentId,
        userId,
      }),
    enabled: !!advertiserId && !!formId && !!agentId && !!userId,
  });
};

/**
 * 광고주 최상위 그룹장 참고용 메모 조회 (운영 관리자 전용) (AAG026)
 * - 화면 : 없음
 * - formId를 통한 데이터로 모두 사용하고 있음
 * - TODO : 추후 사용할 수 있으므로, 대기
 */
export const useSmPayDetailApprovalMemo = (advertiserId: number) => {
  return useAuthQuery<ApprovalMemoDto>({
    queryKey: ["/smpay/detail-approval-memo", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayDetailApprovalMemo({ user, advertiserId }),
  });
};

export type PropsRequestDecision = {
  advertiserId: number;
  params: ParamsSmPayAdminOverviewOperatorDecision;
  agentId: number;
  userId: number;
};

// 광고주 운영 심사 승인/반려 (운영 관리자 전용) (AAG026)
export const useSmPayAdminOverviewOperatorDecision = (
  options?: UseMutationOptions<null, Error, PropsRequestDecision>
) => {
  return useMutation<null, Error, PropsRequestDecision>({
    mutationFn: (data: PropsRequestDecision) =>
      postSmPayAdminOverviewOperatorDecision(data),
    ...options,
  });
};

// 광고주 심사자 참고용 메모 조회 (운영 관리자 전용) (AAG025)
export const useSmPayAdminOverviewReviewerMemo = (advertiserId: number) => {
  return useAuthQuery<ReviewerMemoDto>({
    queryKey: ["/smpay/admin-overview-reviewer-memo", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewReviewerMemo({ user, advertiserId }),
  });
};

// 광고주 최상위 그룹장 참고용 메모 조회 (운영 관리자 전용) (AAG026)
export const useSmPayAdminOverviewApprovalMemo = (advertiserId: number) => {
  return useAuthQuery<ApprovalMemoDto>({
    queryKey: ["/smpay/admin-overview-approval-memo", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewApprovalMemo({ user, advertiserId }),
  });
};

// 운영 계좌 잔액 조회 (운영 관리자 전용) (AAG027)
export const useSmPayAdminOverviewAccountBalance = (userId: number) => {
  return useAuthQuery<OverviewAccountBalanceDto>({
    queryKey: ["/smpay/admin-overview-account-balance", userId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewAccountBalance(user),
  });
};

// 광고주 운영 현황 리스트 조회 (운영 관리자 전용) (AAG031)
export type PropsSmPayAdminOverviewStatusList = QueryParams & {
  agentId: string;
  advertiserId: string;
};
export const useSmPayAdminOverviewStatusList = (
  params: PropsSmPayAdminOverviewStatusList
) => {
  return useQuery<ResponseSmPayAdvertiserStatus>({
    queryKey: ["/smpay/admin-overview-status-list", params],
    queryFn: () => getSmPayAdminOverviewStatusList(params),
  });
};

// 광고주 운영 현황 상태 갯수 조회 (운영 관리자 전용) (AAG028)
export const useSmPayAdminOverviewStatusCount = () => {
  return useAuthQuery<ResponseSmPayStatusCount>({
    queryKey: ["/smpay/admin-overview-status-count"],
    queryFn: () => getSmPayAdminOverviewStatusCount(),
  });
};

// 충전/회수 이력 리스트 조회(AAG034) query
export const useSmPayAdminChargeRecoveryList = (
  params: ChargeRecoveryParams
) => {
  return useQuery<ResponseSmPayChargeRecovery>({
    queryKey: ["/smpay/admin-charge-recovery-list", params],
    queryFn: () => getSmPayAdminChargeRecoveryList(params),
  });
};
