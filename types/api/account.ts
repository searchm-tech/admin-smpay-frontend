export type RequestAccountCertification = {
  advertiserId: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
};

// TODO : 타입 다른 곳으로 옮기기
export type Account = {
  accountId: number;
  bankCode: string;
  name: string;
};

// TODO : 타입 다른 곳으로 옮기기
export type AccountInfo = {
  bankCode: string;
  bankCodeName: string;
  bankNumber: string;
  name: string;
  type: "DEPOSIT" | "WITHDRAW";
};

export type RequestARSBankAccount = {
  accounts: AccountInfo[];
  advertiserId: number;
};

export type RequestARS = {
  advertiserId: number;
  bankCode: string;
  accountNumber: string;
};
