import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

import {
  getAccountList,
  getAdvertiserMailVerification,
  postAccountCertification,
} from "@/services/account";

import type {
  Account,
  RequestAccountCertification,
  RequestARSBankAccount,
} from "@/types/api/account";
import { postSmPayAdvertiserBankAccount } from "@/services/smpay";

// 은행 리스트 전체 조회(AC001)
export const useAccountList = () => {
  return useQuery<Account[]>({
    queryKey: ["/account/list"],
    queryFn: () => getAccountList(),
  });
};

// 은행 실명 인증 요청(AC002)
export const useAccountCertification = (
  options?: UseMutationOptions<boolean, Error, RequestAccountCertification>
) => {
  return useMutation({
    mutationFn: (params: RequestAccountCertification) =>
      postAccountCertification(params),
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
  options?: UseMutationOptions<null, Error, RequestARSBankAccount>
) => {
  return useMutation({
    mutationFn: (params: RequestARSBankAccount) =>
      postSmPayAdvertiserBankAccount(params),
    ...options,
  });
};
