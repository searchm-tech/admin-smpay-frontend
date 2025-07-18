import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import {
  getAdvertiserList,
  postAdvertiserSyncJobStatus,
  postAdvertiserSync,
  delAdvertiserSync,
  getAdvertiserBizMoneyList,
  getAdvertiserListByUserId,
  getSmPayAdminAdvertiserList,
  getSmPayAdminChargeRecoveryAdvertiserList,
} from "@/services/advertiser";

import type {
  RequestAdvertiserList,
  RequestAdvertiserSync,
  RequestAdvertiserSyncStatus,
  ResponseAdvertiserList,
  RequestAdvertiserBizMoneyList,
  ResponseAdvertiserBizMoneyList,
} from "@/types/api/advertiser";
import type { TAdvertiser } from "@/types/adveriser";
import type { AdvertiserDetailDto } from "@/types/dto/smpay";

// 광고주 리스트 페이지네이션 조회 (SAG012) query
// TODO : useAuthQuery 로 변경 필요
export const useQueryAdvertiserList = (
  params: RequestAdvertiserList,
  options?: UseQueryOptions<ResponseAdvertiserList, Error>
) => {
  return useQuery({
    queryKey: ["advertiserList", params],
    queryFn: () => getAdvertiserList(params),
    enabled: !!params.agentId && !!params.userId,
    ...options,
  });
};

// 광고주 데이터 동기화 작업 상태 변경 (SAG015) mutation
// Description :동기화 하기전, IN_PROGRESS 상태로 변경하여, 진행중으로 만들고, 서버에서 성공하면 동기화 api 실행할 것
// TODO : useAuthMutation 으로 변경 필요
export const useMutateAdvertiserSyncJobStatus = (
  options?: UseMutationOptions<null, Error, RequestAdvertiserSyncStatus>
) => {
  return useMutation({
    mutationFn: (params: RequestAdvertiserSyncStatus) =>
      postAdvertiserSyncJobStatus(params),
    ...options,
  });
};

// 광고주 데이터 동기화 (SAG013) mutation
// TODO : useAuthMutation 으로 변경 필요
export const useMutateAdvertiserSync = (
  options?: UseMutationOptions<null, Error, RequestAdvertiserSync>
) => {
  return useMutation({
    mutationFn: (params: RequestAdvertiserSync) => postAdvertiserSync(params),
    ...options,
  });
};

// 광고주 데이터 동기화 해제 (SAG014)
// Description : 동기화 해제는 동기화 된 광고주만 가능하다.
export const useMuateDeleteAdvertiserSync = (
  options?: UseMutationOptions<null, Error, RequestAdvertiserSync>
) => {
  return useMutation<null, Error, RequestAdvertiserSync>({
    mutationFn: (data: RequestAdvertiserSync) => delAdvertiserSync(data),
    ...options,
  });
};

// 광고주 비즈머니 리스트 페이지네이션 조회 (SAG018) query
export const useQueryAdvertiserBizMoneyList = (
  params: RequestAdvertiserBizMoneyList,
  options?: UseQueryOptions<ResponseAdvertiserBizMoneyList, Error>
) => {
  return useQuery({
    queryKey: ["advertiserBizMoneyList", params],
    queryFn: () => getAdvertiserBizMoneyList(params),
    enabled: !!params.agentId && !!params.userId,
    ...options,
  });
};

// 마케터와 연결된 광고주 리스트 조회(SAG038)
export const useQueryAdvertiserListByUserId = (
  params: { agentId: number; userIds: number[] },
  options?: UseQueryOptions<TAdvertiser[], Error>
) => {
  return useQuery<TAdvertiser[], Error>({
    queryKey: ["advertiserListByUserId", params],
    queryFn: () => getAdvertiserListByUserId(params),
    enabled: params.userIds.length > 0 && !!params.agentId,
    ...options,
  });
};

// 신청 이력 있는 광고주 리스트 조회(AAG030) query
export const useQuerySmPayAdminAdvertiserList = (
  options?: UseQueryOptions<AdvertiserDetailDto[], Error>
) => {
  return useQuery<AdvertiserDetailDto[], Error>({
    queryKey: ["smPayAdminAdvertiserList"],
    queryFn: () => getSmPayAdminAdvertiserList(),
    ...options,
  });
};

// 충전/회수 이력 있는 광고주 리스트 조회(AAG033) query
export const useQuerySmPayAdminChargeRecoveryAdvertiserList = (
  options?: UseQueryOptions<AdvertiserDetailDto[], Error>
) => {
  return useQuery<AdvertiserDetailDto[], Error>({
    queryKey: ["smPayAdminChargeRecoveryAdvertiserList"],
    queryFn: () => getSmPayAdminChargeRecoveryAdvertiserList(),
    ...options,
  });
};
