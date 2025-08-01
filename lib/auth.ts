import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 프론트엔드 타입에 따른 쿠키 이름 설정
const getCookieName = () => {
  const frontendType = process.env.NEXT_PUBLIC_FRONTEND_TYPE || "admin";
  return `${frontendType}-next-auth`;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "Login ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const c = credentials as any;
        if (!c?.id) return null;
        return {
          id: c.id,
          email: c.email,
          userId: c.userId,
          agentId: c.agentId,
          loginId: c.loginId,
          status: c.status,
          type: c.type,
          name: c.name,
          phoneNumber: c.phoneNumber,
          uniqueCode: c.uniqueCode,
          accessToken: c.accessToken,
          refreshToken: c.refreshToken,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: getCookieName(),
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as any;
        token.id = Number(u.id);
        token.userId = u.userId;
        token.agentId = u.agentId;
        token.email = u.email;
        token.status = u.status;
        token.type = u.type;
        token.name = u.name;
        token.phoneNumber = u.phoneNumber;
        token.uniqueCode = u.uniqueCode;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
      }

      // trigger 옵션이 'update'인 경우 (updateSession 호출 시)
      if (trigger === "update" && session?.user) {
        const { name, phoneNumber } = session.user;
        // token의 정보를 업데이트
        if (name) token.name = name;
        if (phoneNumber) token.phoneNumber = phoneNumber;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        loginId: token.id.toString(),
        id: token.id,
        agentId: token.agentId,
        userId: token.userId,
        email: token.email,
        status: token.status,
        type: token.type,
        name: token.name || "",
        phoneNumber: token.phoneNumber,
        uniqueCode: token.uniqueCode,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      } as any;
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
};
