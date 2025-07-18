import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  getBankList,
  getAdvertiserMailVerification,
  postBankCertification,
  postARS,
} from "@/services/bank";

import type {
  Bank,
  RequestAccountCertification,
  RequestARSBankAccount,
  RequestARS,
} from "@/types/api/bank";
import {
  postSmPayAdvertiserBankAccount,
  ResponseSmPayAdvertiserBankAccount,
} from "@/services/smpay";

// 은행 리스트 전체 조회(AC001)
export const useBankList = () => {
  return useQuery<Bank[]>({
    queryKey: ["/bank/list"],
    queryFn: () => getBankList(),
  });
};

// 은행 실명 인증 요청(AC002)
export const useBanckCertification = (
  options?: UseMutationOptions<boolean, Error, RequestAccountCertification>
) => {
  return useMutation({
    mutationFn: (params: RequestAccountCertification) =>
      postBankCertification(params),
    ...options,
  });
};

// 광고주 메일 인증 여부 조회(AD001)
export const useAdvertiserMailVerification = (
  advertiserId: number,
  code: string
) => {
  return useQuery<boolean>({
    queryKey: ["/advertiser/mail/verification", advertiserId, code],
    queryFn: () => getAdvertiserMailVerification(advertiserId, code),
  });
};

// 광고주 은행 계좌 등록 및 운영 제출(AD002)
export const useAdvertiserBankAccount = (
  options?: UseMutationOptions<
    ResponseSmPayAdvertiserBankAccount,
    Error,
    RequestARSBankAccount
  >
) => {
  return useMutation({
    mutationFn: (params: RequestARSBankAccount) =>
      postSmPayAdvertiserBankAccount(params),
    ...options,
  });
};

// ARS 인증 및 출금계좌 등록 (AS001)
export const useARS = (
  options?: UseMutationOptions<boolean, Error, RequestARS>
) => {
  return useMutation({
    mutationFn: (params: RequestARS) => postARS(params),
    ...options,
  });
};
