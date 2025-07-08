import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAuthMutation } from "../useAuthMutation";
import { useAuthQuery } from "../useAuthQuery";

import {
  deleteAgentsUserLicense,
  getAdvertiserSyncJobList,
  getAgentsUserLicense,
  postAdvertiserSyncStatus,
  postAgentsUserLicense,
} from "@/services/license";

import type {
  TRequestLicenseDelete,
  TResponseAdvertiserSyncJob,
  TRequestUpdateAdvertiserSyncStatus,
  TResponseLicense,
  TRequestLicenseCreateParams,
} from "@/types/api/license";

import { RequestAgentUser } from "@/types/api/common";
import { AdvertiserJobType } from "@/types/license";

// 마케터 API 라이선스 등록 + 수정 (SAG008) mutate
export const useMuateLicense = (
  options?: UseMutationOptions<null, Error, TRequestLicenseCreateParams>
) => {
  return useAuthMutation<null, Error, TRequestLicenseCreateParams>({
    mutationFn: (variables, user) =>
      postAgentsUserLicense({ params: variables, user }),
    ...options,
  });
};

// 마케터 API 라이선스 삭제 (SAG011) mutate
export const useMuateDeleteLicense = (
  options?: UseMutationOptions<null, Error, TRequestLicenseDelete>
) => {
  return useMutation<null, Error, TRequestLicenseDelete>({
    mutationFn: (data: TRequestLicenseDelete) => deleteAgentsUserLicense(data),
    ...options,
  });
};

// 광고주 데이터 동기화 작업별 리스트 조회 (SAG016) query
export const useQueryAdvertiserSyncJobList = (type: AdvertiserJobType) => {
  return useAuthQuery<TResponseAdvertiserSyncJob[]>({
    queryKey: ["advertiserSyncJobList"],
    queryFn: (user: RequestAgentUser) =>
      getAdvertiserSyncJobList({ user, type }),
    initialData: [],
  });
};

// 광고주 데이터 동기화 작업별 리스트 조회 (SAG016) mutate
export const useMuateAdvertiserSyncStatus = (
  options?: UseMutationOptions<null, Error, TRequestUpdateAdvertiserSyncStatus>
) => {
  return useMutation<null, Error, TRequestUpdateAdvertiserSyncStatus>({
    mutationFn: (data: TRequestUpdateAdvertiserSyncStatus) =>
      postAdvertiserSyncStatus(data),
    ...options,
  });
};

// 마케터 API 라이선스 조회 (SAG009) query
export const useQueryLicense = () => {
  return useAuthQuery<TResponseLicense>({
    queryKey: ["license"],
    queryFn: (user: RequestAgentUser) => getAgentsUserLicense(user),
  });
};
