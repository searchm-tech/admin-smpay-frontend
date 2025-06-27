// 광고주 smPay 신청 관리 리스트 조회(SAG022)

import { ApiError, get, patch, post, put } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { RequestAgentUser } from "@/types/api/common";
import {
  AdvertiserDetailDto,
  RequestSmPayAdvertiserApply,
  RequestSmPayAdvertiserDetailPut,
  RequestSmPayAdvertiserStatus,
  RequestSmPayDetail,
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
} from "@/types/api/smpay";

import type {
  DailyStat,
  SmPayScreeningIndicator,
  SmPayDetailDto,
  SmPayReviewerMemo,
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
  const paramsResult = buildQueryParams({
    page: queryParams.page,
    size: queryParams.size,
    keyword: queryParams.keyword,
    orderType: queryParams.orderType,
  });

  try {
    const response = await get<ResponseSmPayAdvertiserStatus>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/status-list?${paramsResult}`
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
}: RequestSmPayDetail): Promise<SmPayDetailDto> => {
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

///service/api/v1/agents/1/users/1/advertisers/1/charge-rule

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
