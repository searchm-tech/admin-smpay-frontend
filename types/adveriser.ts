export type TAdvertiser = {
  advertiserId: number;
  customerId: number;
  id: string;
  nickname: string;
  name: string;
  isAdvertiserRegister: boolean;
  syncType: TSyncType;
  jobStatus: AdvertiserSyncStatus;
  isBizMoneySync: boolean;
  description: string;
  isLossPrivilege: boolean;
  registerOrUpdateDt: string;
};

export type TSyncType = "SYNC" | "UNSYNC" | "FAIL";

// BEFORE_PROGRESS: 작업 실행 전, IN_PROGRESS: 작업 중, DONE: 작업 완료
export type AdvertiserSyncStatus =
  | "IN_PROGRESS"
  | "BEFORE_PROGRESS"
  | "DONE"
  | "STOP";
