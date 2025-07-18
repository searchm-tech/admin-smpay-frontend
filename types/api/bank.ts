export type RequestAccountCertification = {
  advertiserId: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
};

export type Bank = {
  accountId: number;
  bankCode: string;
  name: string;
};

export type BankInfo = {
  bankCode: string;
  bankCodeName: string;
  bankNumber: string;
  name: string;
  type: "DEPOSIT" | "WITHDRAW";
};

// 광고주 동의 > 은행 리스트 조회 > 충전 계좌 인증 > ARS 인증
export type RequestARSBankAccount = {
  accounts: BankInfo[];
  advertiserId: number;
  withdrawAccountId: number;
};

export type RequestARS = {
  advertiserId: number;
  bankCode: string;
  accountNumber: string;
};
