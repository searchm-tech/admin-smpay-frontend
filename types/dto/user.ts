import type { TAuthType, UserStatus } from "../user";

export type AccountDto = {
  userId: number;
  userType: TAuthType;
  userName: string;
  status: UserStatus;
  registerDt: string;
  emailAddress: string;
  no: number;
};
