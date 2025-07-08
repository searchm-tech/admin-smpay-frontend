import { ApiError, del, get, post } from "@/lib/api";
import type { RequestAgentUser } from "@/types/api/common";
import type {
  TRequestLicenseDelete,
  TResponseLicense,
  TRequestUpdateAdvertiserSyncStatus,
  TResponseAdvertiserSyncJob,
  TRequestLicenseCreateParams,
} from "@/types/api/license";
import type { AdvertiserJobType } from "@/types/license";

type TRequestLicenseCreate = {
  params: TRequestLicenseCreateParams;
  user: RequestAgentUser;
};

// 마케터 API 라이선스 등록 + 수정 (SAG008)
export const postAgentsUserLicense = async ({
  params,
  user,
}: TRequestLicenseCreate): Promise<null> => {
  const { agentId, userId } = user;

  try {
    const response: null = await post(
      `/service/api/v1/agents/${agentId}/users/${userId}/api-license`,
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

// 마케터 API 라이선스 조회 (SAG009)
export const getAgentsUserLicense = async (
  params: RequestAgentUser
): Promise<TResponseLicense> => {
  const { agentId, userId } = params;

  try {
    const response: TResponseLicense = await get(
      `/service/api/v1/agents/${agentId}/users/${userId}/api-license`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

// 마케터 API 라이선스 삭제 (SAG011)
export const deleteAgentsUserLicense = async (
  data: TRequestLicenseDelete
): Promise<null> => {
  const { agentId, userId } = data;

  try {
    const response: null = await del(
      `/service/api/v1/agents/${agentId}/users/${userId}/api-license`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

// 광고주 데이터 동기화 작업 상태 변경 (SAG015)
export const postAdvertiserSyncStatus = async (
  data: TRequestUpdateAdvertiserSyncStatus
): Promise<null> => {
  const { agentId, userId, status, advertiserId } = data;

  try {
    const response: null = await post(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertiser/sync/job-status`,
      { status, advertiserId }
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};

// 광고주 데이터 동기화 작업별 리스트 조회 (SAG016)
type TRequestAdvertiserSyncJobList = {
  user: RequestAgentUser;
  type: AdvertiserJobType;
};

export const getAdvertiserSyncJobList = async ({
  user,
  type,
}: TRequestAdvertiserSyncJobList): Promise<TResponseAdvertiserSyncJob[]> => {
  const { agentId, userId } = user;

  try {
    const response: TResponseAdvertiserSyncJob[] = await get(
      `/service/api/v1/agents/${agentId}/users/${userId}/advertisers-job-type-list?type=${type}`
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};
