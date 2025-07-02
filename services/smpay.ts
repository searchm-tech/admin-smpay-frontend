// 광고주 smPay 신청 관리 리스트 조회(SAG022)

import {
  PropsRequestDecision,
  WithAdvertiserIdAndAgentIdAndUserId,
} from "@/hooks/queries/sm-pay";
import { ApiError, get, patch, post, put } from "@/lib/api";
import { buildQueryParams, transformTableResponse } from "@/lib/utils";
import { AccountInfo, RequestARSBankAccount } from "@/types/api/account";
import type { RequestAgentUser } from "@/types/api/common";
import {
  AdvertiserDetailDto,
  RequestSmPayAdvertiserApply,
  RequestSmPayAdvertiserDetailPut,
  RequestSmPayAdvertiserStatus,
  RequestFormId,
  RequestSmPayRead,
  ParamsSmPayApproval,
  RequestSmPayWrite,
  ResponseSmPayAdvertiserApply,
  ResponseSmPayAdvertiserStatIndicator,
  ResponseSmPayAdvertiserStatus,
  ResponseSmPayAudit,
  ResponseSmPayStatusCount,
  WithAdvertiserId,
  ChargeRuleDto,
  PrePaymentScheduleDto,
  ResponseSmPayAdminAudit,
  RequestSmPayAdminRead,
  UserAgentAdvertiserId,
  OverviewForm,
} from "@/types/api/smpay";

import type {
  DailyStat,
  SmPayScreeningIndicator,
  SmPayDetailDto,
  SmPayReviewerMemo,
  SmPayAdvertiserStautsOrderType,
  OverviewApplyListDto,
  SmPayApprovalMemo,
  OverviewAccountBalanceDto,
} from "@/types/smpay";

//

/**
 * 광고주 상태 갯수 조회(SAG020) API
 * - 화면 : [대행사] SM Pay 관리 > 상태 개수 영역
 */
export const getSmPayStatusCountList = async (
  params: RequestAgentUser
): Promise<ResponseSmPayStatusCount> => {
  const { agentId, userId } = params;
  try {
    const response = await get<ResponseSmPayStatusCount>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/status-count-list`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 상태 리스트 페이지네이션 조회(SAG019)
 * - 화면 : [대행사] SM Pay 관리 > 목록 리스트
 */
export const getSmPayAdvertiserStatusList = async ({
  user,
  queryParams,
}: RequestSmPayAdvertiserStatus): Promise<ResponseSmPayAdvertiserStatus> => {
  const { agentId, userId } = user;

  const { page, size, orderType } = queryParams;
  // NO_ 정렬 조건을 ADVERTISER_REGISTER로 변환
  let apiOrderType = queryParams.orderType;
  const isNoSort = queryParams.orderType.startsWith("NO");

  if (isNoSort) {
    apiOrderType = queryParams.orderType.replace(
      "NO",
      "ADVERTISER_REGISTER"
    ) as SmPayAdvertiserStautsOrderType;
  }

  const paramsResult = buildQueryParams({
    page: queryParams.page,
    size: queryParams.size,
    keyword: queryParams.keyword,
    orderType: apiOrderType,
  });

  try {
    const response = await get<ResponseSmPayAdvertiserStatus>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/status-list?${paramsResult}`
    );

    let content = response.content.map((item, index) => ({
      ...item,
      no: (page - 1) * size + index + 1,
    }));

    if (orderType === "NO_ASC") {
      content = content.reverse();
    }

    return {
      ...response,
      content,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 smPay 신청 관리 리스트 조회(SAG022)
 * - 화면 : [대행사] SM Pay 관리 > 목록 리스트
 */
export const getSmPayAdvertiserApplyList = async ({
  user,
  queryParams,
}: RequestSmPayAdvertiserApply): Promise<ResponseSmPayAdvertiserApply> => {
  const { agentId, userId } = user;
  const paramsResult = buildQueryParams({
    page: queryParams.page,
    size: queryParams.size,
    keyword: queryParams.keyword,
    orderType: queryParams.orderType,
  });

  try {
    const response = await get<ResponseSmPayAdvertiserApply>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers-apply-list?${paramsResult}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 detail 조회(SAG024)
 * - 화면 : [대행사] SM Pay 관리 > 목록 리스트 > 정보 변경 모달
 */
export const getSmPayAdvertiserDetail = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<AdvertiserDetailDto> => {
  const { agentId, userId } = user;

  try {
    const response = await get<AdvertiserDetailDto>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/details`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 detail 등록 및 수정(SAG023)
 * - 화면 : [대행사] SM Pay 관리 > 목록 리스트 > 정보 등록, 변경 모달
 */
export const putSmPayAdvertiserDetail = async ({
  user,
  advertiserId,
  params,
}: RequestSmPayAdvertiserDetailPut): Promise<null> => {
  const { agentId, userId } = user;
  const response = await put<null>(
    `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/details`,
    params
  );
  return response;
};

/**
 * 광고주 성과 기반 참고용 심사 지표 조회(28일)(SAG028)
 * - 화면 : IndicatorsJudementSection
 */
export const getSmPayAdvertiserStatIndicator = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<ResponseSmPayAdvertiserStatIndicator> => {
  const { agentId, userId } = user;

  try {
    const response = await get<ResponseSmPayAdvertiserStatIndicator>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/stat-indicator`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

// /core/service/api/v1/agents/1/users/1/advertisers/1/daily-stat

/**
 * 광고주 일 별 성과 조회(28일)(SAG027)
 * - 화면 : IndicatorModal
 */
export const getSmPayAdvertiserDailyStat = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<DailyStat[]> => {
  const { agentId, userId } = user;

  try {
    const response = await get<DailyStat[]>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/daily-stat`
    );
    return response?.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 smPay 등록(SAG029) API
 * - 화면 : SM Pay 신청
 */
export const postSmPay = async ({
  user,
  advertiserId,
  params,
}: RequestSmPayWrite): Promise<null> => {
  const { agentId, userId } = user;

  try {
    const response = await post<null>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/form`,
      params
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 smPay 신청 이력 상세 조회(SAG026) api
 * 화면 > SM Pay 신청 상세
 */

export const getSmPayDetail = async ({
  user,
  advertiserId,
  formId,
}: RequestFormId): Promise<SmPayDetailDto> => {
  const { agentId, userId } = user;

  try {
    const response = await get<SmPayDetailDto>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/form/${formId}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 smPay 신청 이력 리스트 조회(SAG025)
 */
export const getSmPayApplyList = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<SmPayDetailDto[]> => {
  const { agentId, userId } = user;

  try {
    const response = await get<SmPayDetailDto[]>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/apply-form-list?`
    );

    return response.map((item, index) => ({
      ...item,
      no: index + 1,
    }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};
/**
 * 광고주 심사 관리 리스트 조회(최상위 그룹장 전용)(SAG030)
 * - 화면 : [최상위 그룹장] > 심사 요청 목록
 */

export const getSmPayAuditList = async ({
  user,
  queryParams,
}: RequestSmPayAdvertiserStatus): Promise<ResponseSmPayAudit> => {
  const { agentId, userId } = user;
  const paramsResult = buildQueryParams({
    page: queryParams.page,
    size: queryParams.size,
    keyword: queryParams.keyword,
    orderType: queryParams.orderType,
  });

  try {
    const response = await get<ResponseSmPayAudit>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/audit/list?${paramsResult}`
    );

    const { page, size, orderType } = queryParams;

    let content = response.content.map((item, index) => ({
      ...item,
      no: (page - 1) * size + index + 1,
    }));

    if (orderType === "NO_ASC") {
      content = content.reverse();
    }

    return {
      ...response,
      content,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 심사 목록 읽음, 미읽음 상태 변경 (최상위 그룹장 전용)(SAG031)
 * 화면 : SM Pay 심사 상세
 */
export const patchSmPayRead = async ({
  user,
  advertiserId,
  isApprovalRead,
}: RequestSmPayRead): Promise<null> => {
  const { agentId, userId } = user;

  try {
    const response = await patch<null>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/alarm?isApprovalRead=${isApprovalRead}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 심사 지표 조회 (최상위 그룹장 전용)(SAG032)
 * - 화면 : 심사요청 상세 > 심사 지표 영역
 */
export const getSmPayAdvertiserScreeningIndicator = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<SmPayScreeningIndicator> => {
  const { agentId, userId } = user;

  try {
    const response = await get<SmPayScreeningIndicator>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/screening-indicator`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 심사자 참고용 메모 조회 (최상위 그룹장 전용)(SAG035)
 * - 화면 : 심사요청 상세 > 심사자 참고용 메모 영역
 */

export const getSmPayAdvertiserReviewerMemo = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<SmPayReviewerMemo> => {
  const { agentId, userId } = user;

  try {
    const response = await get<SmPayReviewerMemo>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/reviewer-memo`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

// /service/api/v1/agents/1/users/1/advertisers/1/reviewer-decision

/**
 * 광고주 심상 승인 /거절 (최상위 그룹장 전용)(SAG036)
 */

type SmPayApprovalVariables = {
  user: RequestAgentUser;
  advertiserId: number;
  params: ParamsSmPayApproval;
};

export const postSmPayApproval = async ({
  user,
  advertiserId,
  params,
}: SmPayApprovalVariables): Promise<null> => {
  const { agentId, userId } = user;

  try {
    const response = await post<null>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/reviewer-decision`,
      params
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 충전 규칙 조회 (최상위 그룹장 전용)(SAG033)
 * - 화면 : 심사요청 상세 > 충전 규칙 영역
 */
export const getSmPayAdvertiserChargeRule = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<ChargeRuleDto[]> => {
  const { agentId, userId } = user;

  try {
    const response = await get<ChargeRuleDto[]>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/charge-rule`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

// /service/api/v1/agents/1/users/1/advertisers/1/pre-payment-schedule

/**
 * 광고주 선결제 스케줄 조회 (최상위 그룹장 전용)(SAG034)
 * - 화면 : 심사요청 상세 > 선결제 스케줄 영역
 */

export const getSmPayAdvertiserPrePaymentSchedule = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<PrePaymentScheduleDto> => {
  const { agentId, userId } = user;

  try {
    const response = await get<PrePaymentScheduleDto>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/pre-payment-schedule`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 심사 관리 리스트 조회 (운영 관리자 전용) (AAG018)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 목록
 */

export const getSmPayAdminAuditList = async ({
  user,
  queryParams,
}: RequestSmPayAdvertiserStatus): Promise<ResponseSmPayAdminAudit> => {
  const { agentId, userId } = user;

  // NO_ 정렬 조건을 ADVERTISER_REGISTER로 변환
  let apiOrderType = queryParams.orderType;
  const isNoSort = queryParams.orderType.startsWith("NO");

  if (isNoSort) {
    apiOrderType = queryParams.orderType.replace(
      "NO",
      "ADVERTISER_REGISTER"
    ) as SmPayAdvertiserStautsOrderType;
  }

  const paramsResult = buildQueryParams({
    page: queryParams.page,
    size: queryParams.size,
    keyword: queryParams.keyword,
    orderType: apiOrderType,
  });

  try {
    const response = await get<ResponseSmPayAdminAudit>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/audit/list?${paramsResult}`
    );
    const result = transformTableResponse(response, queryParams);

    // NO_ASC 정렬인 경우 순서 뒤집기 (화면 노출용 번호)
    if (queryParams.orderType === "NO_ASC") {
      return {
        ...result,
        content: result.content.reverse(),
      };
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 충전 규칙 조회(AAG023)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세 - 충전 규칙 영역
 */
export const getSmPayAdminOverviewChargeRule = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<ChargeRuleDto[]> => {
  const { agentId, userId } = user;

  try {
    const response = await get<ChargeRuleDto[]>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/charge-rule`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 선결제 스케줄 조회(AAG024)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세 - 선결제 스케줄 영역
 */
export const getSmPayAdminOverviewPrePaymentSchedule = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<PrePaymentScheduleDto> => {
  const { agentId, userId } = user;

  try {
    const response = await get<PrePaymentScheduleDto>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/pre-payment-schedule`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 심사 목록 읽음, 미읽음 상태 변경 (운영 관리자 전용) (AAG019)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세
 */
export const patchSmPayAdminOverviewAlarm = async ({
  user,
  advertiserId,
  isOperatorRead,
}: RequestSmPayAdminRead): Promise<null> => {
  const { agentId, userId } = user;

  try {
    const response = await patch<null>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/alarm?isOperatorRead=${isOperatorRead}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 detail 조회 (AAG020)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세
 */
export const getSmPayAdminOverviewDetail = async ({
  advertiserId,
  agentId,
  userId,
}: WithAdvertiserIdAndAgentIdAndUserId): Promise<AdvertiserDetailDto> => {
  try {
    const response = await get<AdvertiserDetailDto>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/details`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 smPay 신청 이력 리스트 조회 (AAG021)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세 > 신청 이력 리스트
 * - requestPath : agentId, userId, advertiserId (광고주)
 */
export const getSmPayAdminOverviewApplyFormList = async ({
  advertiserId,
  agentId,
  userId,
}: UserAgentAdvertiserId): Promise<OverviewApplyListDto[]> => {
  try {
    const response = await get<OverviewApplyListDto[]>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/apply-form-list`
    );
    return response.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 smPay 신청 이력 상세 조회(AAG022)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세 > 신청 이력 상세
 */

type RequestSmPayAdminOverviewApplyFormDetail = {
  advertiserId: number;
  formId: number;
  agentId: number;
  userId: number;
};

export const getSmPayAdminOverviewApplyFormDetail = async ({
  advertiserId,
  formId,
  agentId,
  userId,
}: RequestSmPayAdminOverviewApplyFormDetail): Promise<OverviewForm> => {
  try {
    const response = await get<OverviewForm>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/form/${formId}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

// /core/admin/api/v1/agents/1/users/1/advertisers/1/reviewer-memo

/**
 * 광고주 심사자 참고용 메모 조회(AAG024)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세 > 심사자 참고용 메모 영역
 */

export const getSmPayAdminOverviewReviewerMemo = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<SmPayReviewerMemo> => {
  const { agentId, userId } = user;

  try {
    const response = await get<SmPayReviewerMemo>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/reviewer-memo`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 최상위 그룹장 참고용 메모 조회(AAG025)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세 >  참고용 메모 영역
 */
export const getSmPayAdminOverviewApprovalMemo = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<SmPayApprovalMemo> => {
  const { agentId, userId } = user;

  try {
    const response = await get<SmPayApprovalMemo>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/approval-memo`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 운영 심사 승인/반려(AAG026)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세
 * - requestPath : adverUserId, adverAgentId
 */
export const postSmPayAdminOverviewOperatorDecision = async ({
  agentId,
  userId,
  advertiserId,
  params,
}: PropsRequestDecision): Promise<null> => {
  console.log("agentId", agentId);
  console.log("userId", userId);
  console.log("advertiserId", advertiserId);
  console.log("params", params);
  const {
    decisionType,
    chargeRule,
    prePaymentSchedule,
    reviewerMemo,
    approvalMemo,
    rejectStatusMemo,
  } = params;

  const requestParams = {
    decisionType,
    chargeRule,
    prePaymentSchedule,
    reviewerMemo,
    approvalMemo,
    rejectStatusMemo,
  };
  try {
    const response = await post<null>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/operator-decision`,
      requestParams
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 운영 계좌 잔액 조회(AAG027)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세 > 운영 계좌 잔액 영역
 */
export const getSmPayAdminOverviewAccountBalance = async ({
  userId,
  agentId,
}: RequestAgentUser): Promise<OverviewAccountBalanceDto> => {
  try {
    const response = await get<OverviewAccountBalanceDto>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/calculate-account-balance`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 동의 이메일, 문자발송(SAG037)
 * - 화면 : [대행사] SM Pay 관리 > 목록 리스트 > 광고주 동의 전송 버튼
 */
export const postSmPayAdvertiserAgreeNotification = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<null> => {
  const { agentId, userId } = user;

  try {
    const response = await post<null>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/send-agree-notification`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

/**
 * 광고주 은행 계좌 등록 및 운영 제출(AD002)
 * - 화면 : 광고주 동의 > ARS 인증 버튼
 */
export const postSmPayAdvertiserBankAccount = async ({
  advertiserId,
  accounts,
}: RequestARSBankAccount): Promise<null> => {
  try {
    const response = await post<null>(
      `/api/v1/advertisers/${advertiserId}/register-account`,
      { accounts: [...accounts] }
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};
