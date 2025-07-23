import {
  PropsRequestDecision,
  PropsSmPayAdminOverviewStatusList,
} from "@/hooks/queries/sm-pay";
import { ApiError, get, patch, post, put } from "@/lib/api";
import {
  buildQueryParams,
  convertNoOrderType,
  transformTableResponse,
} from "@/lib/utils";

import type {
  RequestAgentUser,
  UserAgentAdvertiserId,
  WithAdvertiserId,
} from "@/types/api/common";
import {
  RequestSmPayAdvertiserStatus,
  ResponseSmPayAdvertiserStatus,
  ResponseSmPayStatusCount,
  ResponseSmPayAdminAudit,
  RequestSmPayAdminRead,
  ResponseOverviewForm,
  PrePaymentScheduleDto,
  ResponseSmPayChargeRecovery,
  ChargeRecoveryParams,
} from "@/types/api/smpay";
import type {
  ChargeRuleDto,
  SmPayAdvertiserStatusDto,
  SMPayFormHistory,
  OverviewAccountBalanceDto,
  ApprovalMemoDto,
  ReviewerMemoDto,
  AdvertiserDetailDto,
} from "@/types/dto/smpay";

import type { SmPayAdvertiserStautsOrderType } from "@/types/smpay";

import { applyNoAscOrder } from "@/utils/sort";

/**
 * 광고주 최상위 그룹장 참고용 메모 조회(AAG025)
 * - 화면 : SM Pay 관리 > 조회 > 참고용 메모 영역
 */

export const getSmPayDetailApprovalMemo = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<ApprovalMemoDto> => {
  const { agentId, userId } = user;

  try {
    const response = await get<ApprovalMemoDto>(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/approval-memo`
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
  isOperatorRead,
  advertiserId,
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
export const getSmPayAdminOverviewDetail = async (
  params: UserAgentAdvertiserId
): Promise<AdvertiserDetailDto> => {
  try {
    const { agentId, userId, advertiserId } = params;
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
export const getSmPayAdminOverviewApplyFormList = async (
  params: UserAgentAdvertiserId
): Promise<SMPayFormHistory[]> => {
  try {
    const { agentId, userId, advertiserId } = params;
    const response = await get<ResponseOverviewForm[]>(
      `/admin/api/v1/agents/${agentId}/users/${userId}/advertisers/${advertiserId}/apply-form-list`
    );

    const contents: SMPayFormHistory[] = response.map((item, index) => ({
      no: index + 1,
      advertiserCustomerId: item.advertiserCustomerId.toString(),
      advertiserLoginId: item.advertiserLoginId,
      advertiserNickname: item.advertiserNickname,
      advertiserName: item.advertiserName,
      advertiserStatus: item.advertiserStatus,
      registerOrUpdateDt: item.registerDt,
      advertiserFormId: item.advertiserFormId,
      advertiserId: item.advertiserId,
    }));

    return contents;
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
type ReqSmPayAdminOverviewApplyFormDetail = UserAgentAdvertiserId & {
  formId: number;
};

export const getSmPayAdminOverviewApplyFormDetail = async ({
  formId,
  advertiserId,
  agentId,
  userId,
}: ReqSmPayAdminOverviewApplyFormDetail): Promise<ResponseOverviewForm> => {
  try {
    const response = await get<ResponseOverviewForm>(
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

/**
 * 광고주 심사자 참고용 메모 조회(AAG024)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 운영 검토 요청 상세 > 심사자 참고용 메모 영역
 */
export const getSmPayAdminOverviewReviewerMemo = async ({
  user,
  advertiserId,
}: WithAdvertiserId): Promise<ReviewerMemoDto> => {
  const { agentId, userId } = user;

  try {
    const response = await get<ReviewerMemoDto>(
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
}: WithAdvertiserId): Promise<ApprovalMemoDto> => {
  const { agentId, userId } = user;

  try {
    const response = await get<ApprovalMemoDto>(
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
 * 광고주 상태 페이지네이션 조회(AAG031)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 광고주 운영 현황
 */
export const getSmPayAdminOverviewStatusList = async (
  queryParams: PropsSmPayAdminOverviewStatusList
): Promise<ResponseSmPayAdvertiserStatus> => {
  const { page, size, orderType } = queryParams;

  const apiOrderType = convertNoOrderType(
    queryParams.orderType,
    "ADVERTISER_REGISTER"
  );

  const paramsResult = buildQueryParams({
    page,
    size,
    orderType: apiOrderType,
    agentId: queryParams.agentId,
    advertiserId: queryParams.advertiserId,
  });

  try {
    const response = await get<ResponseSmPayAdvertiserStatus>(
      `/admin/api/v1/agents/users/advertisers/status-list?${paramsResult}`
    );

    let content: SmPayAdvertiserStatusDto[] = response.content.map(
      (item, index) => ({
        ...item,
        no: (page - 1) * size + index + 1,
      })
    );

    content = applyNoAscOrder(content, orderType);

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
 * 광고주 상태 갯수 조회(AAG028)
 * - 화면 : [시스템 관리자] SM Pay 관리 > 광고주 운영 현황 > 상태 개수 영역
 */
export const getSmPayAdminOverviewStatusCount =
  async (): Promise<ResponseSmPayStatusCount> => {
    try {
      const response = await get<ResponseSmPayStatusCount>(
        "/admin/api/v1/agents/users/advertisers/status-count-list"
      );
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw error;
    }
  };

// 충전/회수 이력 리스트 조회(AAG034)
export const getSmPayAdminChargeRecoveryList = async (
  reqParams: ChargeRecoveryParams
): Promise<ResponseSmPayChargeRecovery> => {
  const {
    page,
    size,
    agentUniqueCode,
    advertiserCustomerId,
    startDate,
    endDate,
    isNotRecoveryAdvertiser,
  } = reqParams;

  const queryParam = buildQueryParams({ page, size });
  const requestBody = {
    agentUniqueCode,
    advertiserCustomerId: advertiserCustomerId || undefined,
    startDate,
    endDate,
    isNotRecoveryAdvertiser,
  };

  try {
    const response = await post<ResponseSmPayChargeRecovery>(
      `/admin/api/v1/agents/users/advertisers/charge-recovery-list?${queryParam}`,
      requestBody
    );

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};
