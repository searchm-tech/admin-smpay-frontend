"use client";

import { useEffect } from "react";
import { signOut, getSession } from "next-auth/react";
import { signOutApi } from "@/services/auth";
import { useSessionStore } from "@/store/useSessionStore";

const SignOutView = () => {
  const { clearSession } = useSessionStore();

  useEffect(() => {
    const forceLogout = async () => {
      clearSession();

      try {
        await signOutApi();
      } catch (error) {
        console.error("❌ 서버 로그아웃 실패:", error);
      }

      await signOut({
        callbackUrl: "/sign-in",
        redirect: false,
      });

      const sessionAfter = await getSession();

      // 만약 세션이 남아있다면 강제 조치
      if (sessionAfter && sessionAfter.user) {
        console.warn("⚠️ 세션이 완전히 클리어되지 않음! 강제 조치 실행");
        // 쿠키 강제 삭제
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
      }

      window.location.replace("/sign-in");
    };

    forceLogout();
  }, [clearSession]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-lg font-medium"></p>
        </div>
      </div>
    </div>
  );
};

export default SignOutView;
