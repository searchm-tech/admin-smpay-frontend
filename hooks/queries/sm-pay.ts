import {
  useQuery,
  useMutation,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  fetchSmPayData,
  getSmPayRejectReason,
  getSmPayStatus,
  getSmPayStopInfo,
  updateSmPayStatus,
} from "@/services/sm-pay";

import type {
  SmPayRejectReasonResponse,
  TableParams,
  SmPayResponse,
  SmPayStopInfoResponse,
  SmPayStatusResponse,
} from "@/services/types";
import type { BooleanResponse } from "@/types/sm-pay";
import type { RequestAgentUser } from "@/types/api/common";
import type {
  ResponseSmPayAdvertiserStatus,
  ResponseSmPayStatusCount,
  ResponseSmPayAdvertiserApply,
  QueryParams,
  SmPayAdvertiserApplyQuery,
  PutSmPayAdvertiserDetail,
  SmPayWriteParams,
  ResponseSmPayAudit,
  AdvertiserDetailDto,
  ParamsSmPayApproval,
  ChargeRuleDto,
  PrePaymentScheduleDto,
  ResponseSmPayAdminAudit,
  ParamsSmPayAdminOverviewOperatorDecision,
} from "@/types/api/smpay";

import { useAuthQuery } from "../useAuthQuery";
import { useAuthMutation } from "../useAuthMutation";
import {
  getSmPayAdvertiserApplyList,
  getSmPayAdvertiserDetail,
  getSmPayAdvertiserStatIndicator,
  getSmPayAdvertiserStatusList,
  getSmPayStatusCountList,
  putSmPayAdvertiserDetail,
  getSmPayAdvertiserDailyStat,
  postSmPay,
  getSmPayDetail,
  getSmPayApplyList,
  getSmPayAuditList,
  patchSmPayRead,
  getSmPayAdvertiserScreeningIndicator,
  getSmPayAdvertiserReviewerMemo,
  postSmPayApproval,
  getSmPayAdvertiserChargeRule,
  getSmPayAdvertiserPrePaymentSchedule,
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
} from "@/services/smpay";
import type {
  DailyStat,
  SmPayDetailDto,
  SmPayStatIndicator,
  SmPayScreeningIndicator,
  SmPayReviewerMemo,
  OverviewApplyListDto,
  SmPayApprovalMemo,
  OverviewAccountBalanceDto,
} from "@/types/smpay";

export const useSmPayList = (params: TableParams) => {
  return useQuery<SmPayResponse>({
    queryKey: ["/smpay/list", params],
    queryFn: () => fetchSmPayData(params),
    staleTime: 1000 * 60,
  });
};

// 삭제 예정
export const useSmPayStatus = () => {
  return useQuery<SmPayStatusResponse>({
    queryKey: ["/smpay/status"],
    queryFn: () => getSmPayStatus(),
  });
};

export const useSmPayRejectReason = (id: string) => {
  return useQuery<SmPayRejectReasonResponse>({
    queryKey: ["/smpay/reject-reason", id],
    queryFn: () => getSmPayRejectReason(id),
    enabled: !!id,
    initialData: {
      data: "",
      success: false,
    },
  });
};

export const useSmPayStopInfo = (id: string) => {
  return useQuery<SmPayStopInfoResponse>({
    queryKey: ["/smpay/stop-info", id],
    queryFn: () => getSmPayStopInfo(id),
    enabled: !!id,
    initialData: {
      data: {
        date: "",
        reason: "",
      },
      success: false,
    },
  });
};

type StatusParams = {
  id: string;
  status: string;
};

export const useSmPayStatusUpdate = (
  options?: UseMutationOptions<BooleanResponse, Error, StatusParams>
) => {
  return useMutation<BooleanResponse, Error, StatusParams>({
    mutationFn: ({ id, status }) => updateSmPayStatus(id, status),
    ...options,
  });
};

// ------------- 실제 react-query -----------

// 광고주 상태 갯수 조회(SAG020) query
export const useSmPayStatusCountList = () => {
  return useAuthQuery<ResponseSmPayStatusCount>({
    queryKey: ["/smpay/status-count-list"],
    queryFn: (user: RequestAgentUser) => getSmPayStatusCountList(user),
  });
};

// 광고주 상태 리스트 페이지네이션 조회(SAG019) query
export const useSmPayAdvertiserStatusList = (params: QueryParams) => {
  return useAuthQuery<ResponseSmPayAdvertiserStatus>({
    queryKey: ["/smpay/advertiser-status-list", params],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserStatusList({ user, queryParams: params }),
  });
};

// 광고주 smPay 신청 관리 리스트 조회(SAG022) query
export const useSmPayAdvertiserApplyList = (
  params: SmPayAdvertiserApplyQuery
) => {
  return useAuthQuery<ResponseSmPayAdvertiserApply>({
    queryKey: ["/smpay/advertiser-apply-list", params],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserApplyList({ user, queryParams: params }),
  });
};

// useSmPayAdvertiserUpdate 훅에 전달될 variables 타입 정의
type SmPayAdvertiserUpdateVariables = {
  advertiserId: number;
  params: PutSmPayAdvertiserDetail;
};

// 광고주 detail 등록 및 수정(SAG023) mutate
export const useSmPayAdvertiserUpdate = (
  options?: UseMutationOptions<null, Error, SmPayAdvertiserUpdateVariables>
) => {
  return useAuthMutation<null, Error, SmPayAdvertiserUpdateVariables>({
    mutationFn: (variables, user) =>
      putSmPayAdvertiserDetail({
        user,
        advertiserId: variables.advertiserId,
        params: variables.params,
      }),
    ...options,
  });
};

// 광고주 detail 조회(SAG024) query
export const useSmPayAdvertiserDetail = (advertiserId: number) => {
  return useAuthQuery<AdvertiserDetailDto>({
    queryKey: ["/smpay/advertiser-detail", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserDetail({ user, advertiserId }),
  });
};

// 광고주 성과 기반 참고용 심사 지표 조회(28일)(SAG028) query
export const useSmPayAdvertiserStatIndicator = (advertiserId: number) => {
  return useAuthQuery<SmPayStatIndicator>({
    queryKey: ["/smpay/advertiser-stat-indicator", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserStatIndicator({ user, advertiserId }),
  });
};

// 광고주 일 별 성과 조회(28일)(SAG027) query
export const useSmPayAdvertiserDailyStat = (advertiserId: number) => {
  return useAuthQuery<DailyStat[]>({
    queryKey: ["/smpay/advertiser-daily-stat", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserDailyStat({ user, advertiserId }),
  });
};

// useSmPayWrite 훅에 전달될 variables 타입 정의
type SmPayWriteVariables = {
  advertiserId: number;
  params: SmPayWriteParams;
};

// 광고주 smPay 등록(SAG029) mutate
export const useSmPayWrite = (
  options?: UseMutationOptions<null, Error, SmPayWriteVariables>
) => {
  return useAuthMutation<null, Error, SmPayWriteVariables>({
    mutationFn: (variables, user) =>
      postSmPay({
        user,
        advertiserId: variables.advertiserId,
        params: variables.params,
      }),
    ...options,
  });
};

// 광고주 smPay 신청 이력 상세 조회(SAG026) query
export const useSmPayDetail = (advertiserId: number, formId: number) => {
  return useAuthQuery<SmPayDetailDto>({
    queryKey: ["/smpay/detail", advertiserId, formId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayDetail({ user, advertiserId, formId }),
    enabled: !!advertiserId && !!formId && !isNaN(formId),
  });
};

// 광고주 smPay 신청 이력 리스트 조회(SAG025) query
export const useSmPayApplyList = (advertiserId: number) => {
  return useAuthQuery<SmPayDetailDto[]>({
    queryKey: ["/smpay/apply-list", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayApplyList({ user, advertiserId }),
  });
};

// 광고주 심사 관리 리스트 조회(최상위 그룹장 전용)(SAG030) query
export const useSmPayAuditList = (params: QueryParams) => {
  return useAuthQuery<ResponseSmPayAudit>({
    queryKey: ["/smpay/audit-list", params],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAuditList({ user, queryParams: params }),
  });
};

// useSmPayWrite 훅에 전달될 variables 타입 정의
type SmPayReadVariables = {
  advertiserId: number;
  isApprovalRead: boolean;
};

// 광고주 심사 목록 읽음, 미읽음 상태 변경 (최상위 그룹장 전용)(SAG031) mutate
export const useSmPayRead = (
  options?: UseMutationOptions<null, Error, SmPayReadVariables>
) => {
  return useAuthMutation<null, Error, SmPayReadVariables>({
    mutationFn: (variables, user) =>
      patchSmPayRead({
        user,
        advertiserId: variables.advertiserId,
        isApprovalRead: variables.isApprovalRead,
      }),
    ...options,
  });
};

// 광고주 심사 지표 조회 (최상위 그룹장 전용)(SAG032) query
export const useSmPayScreeningIndicator = (advertiserId: number) => {
  return useAuthQuery<SmPayScreeningIndicator>({
    queryKey: ["/smpay/screening-indicator", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserScreeningIndicator({ user, advertiserId }),
    enabled: !!advertiserId,
  });
};

// 광고주 심사자 참고용 메모 조회 (최상위 그룹장 전용)(SAG035) query
export const useSmPayReviewerMemo = (advertiserId: number) => {
  return useAuthQuery<SmPayReviewerMemo>({
    queryKey: ["/smpay/reviewer-memo", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserReviewerMemo({ user, advertiserId }),
  });
};

// useSmPayApproval 훅에 전달될 variables 타입 정의
type SmPayApprovalVariables = {
  advertiserId: number;
  params: ParamsSmPayApproval;
};

// 광고주 심상 승인 /거절 (최상위 그룹장 전용)(SAG036) mutate
export const useSmPayApproval = (
  options?: UseMutationOptions<null, Error, SmPayApprovalVariables>
) => {
  return useAuthMutation<null, Error, SmPayApprovalVariables>({
    mutationFn: (variables, user) =>
      postSmPayApproval({
        user,
        advertiserId: variables.advertiserId,
        params: variables.params,
      }),
    ...options,
  });
};

// 광고주 충전 규칙 조회 (최상위 그룹장 전용)(SAG033) query
export const useSmPayAdvertiserChargeRule = (advertiserId: number) => {
  return useAuthQuery<ChargeRuleDto[]>({
    queryKey: ["/smpay/advertiser-charge-rule", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserChargeRule({ user, advertiserId }),
    enabled: !!advertiserId,
  });
};

// 광고주 선결제 스케줄 조회 (최상위 그룹장 전용)(SAG034) query
export const useSmPayAdvertiserPrePaymentSchedule = (advertiserId: number) => {
  return useAuthQuery<PrePaymentScheduleDto>({
    queryKey: ["/smpay/advertiser-pre-payment-schedule", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdvertiserPrePaymentSchedule({ user, advertiserId }),
  });
};

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
export const useSmPayAdminDetail = (advertiserId: number) => {
  return useAuthQuery<AdvertiserDetailDto>({
    queryKey: ["/smpay/admin-overview-detail", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewDetail({ user, advertiserId }),
  });
};

// 광고주 smPay 신청 이력 리스트 조회 (운영 관리자 전용) (AAG021)
export const useSmPayAdminOverviewApplyFormList = (advertiserId: number) => {
  return useAuthQuery<OverviewApplyListDto[]>({
    queryKey: ["/smpay/admin-overview-apply-form-list", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewApplyFormList({ user, advertiserId }),
  });
};

// 광고주 smPay 신청 이력 상세 조회 (운영 관리자 전용) (AAG022)
export const useSmPayAdminOverviewApplyFormDetail = (
  advertiserId: number,
  formId: number
) => {
  return useAuthQuery<OverviewApplyListDto>({
    queryKey: ["/smpay/admin-overview-apply-form-detail", advertiserId, formId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewApplyFormDetail({ user, advertiserId, formId }),
  });
};

// 광고주 심사자 참고용 메모 조회 (운영 관리자 전용) (AAG025)
export const useSmPayAdminOverviewReviewerMemo = (advertiserId: number) => {
  return useAuthQuery<SmPayReviewerMemo>({
    queryKey: ["/smpay/admin-overview-reviewer-memo", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewReviewerMemo({ user, advertiserId }),
  });
};

// 광고주 최상위 그룹장 참고용 메모 조회 (운영 관리자 전용) (AAG026)
export const useSmPayAdminOverviewApprovalMemo = (advertiserId: number) => {
  return useAuthQuery<SmPayApprovalMemo>({
    queryKey: ["/smpay/admin-overview-approval-memo", advertiserId],
    queryFn: (user: RequestAgentUser) =>
      getSmPayAdminOverviewApprovalMemo({ user, advertiserId }),
  });
};

// useSmPayApproval 훅에 전달될 variables 타입 정의 - TODO : 명칭 변경 필요
type SmPayAdminOverviewOperatorDecisionVariables = {
  advertiserId: number;
  params: ParamsSmPayAdminOverviewOperatorDecision;
};

// 광고주 운영 심사 승인/반려 (운영 관리자 전용) (AAG026)
export const useSmPayAdminOverviewOperatorDecision = (
  options?: UseMutationOptions<
    null,
    Error,
    SmPayAdminOverviewOperatorDecisionVariables
  >
) => {
  return useAuthMutation<
    null,
    Error,
    SmPayAdminOverviewOperatorDecisionVariables
  >({
    mutationFn: (variables, user) =>
      postSmPayAdminOverviewOperatorDecision({
        user,
        advertiserId: variables.advertiserId,
        params: variables.params,
      }),
    ...options,
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
