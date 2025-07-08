import NextAuth from "next-auth";
import type { TSMPayUser, UserType } from "./user";

export type UserWithUniqueCode = TSMPayUser & { uniqueCode: string };

declare module "next-auth" {
  interface Session {
    user: UserWithUniqueCode;
  }

  interface User extends UserWithUniqueCode {}
}

declare module "next-auth/jwt" {
  interface JWT extends UserWithUniqueCode {
    accessToken: string;
    refreshToken: string;
  }
}
