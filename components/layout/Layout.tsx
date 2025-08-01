"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import Footer from "./Footer";
import Container from "./Container";
import ChannelTalkBoot from "../common/ChannelTalkBoot";

import { useSessionStore } from "@/store/useSessionStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const { setTokens } = useSessionStore();

  const isErrorPage = pathname === "/not-found" || pathname === "/error";

  useEffect(() => {
    // 기존 localStorage에서 토큰을 store로 마이그레이션 (한 번만 실행)
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      // 마이그레이션 후 기존 키 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }, [setTokens]);

  if (isErrorPage) {
    return <div>{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ChannelTalkBoot />

      <main className="flex-1 flex flex-col mt-[74px]  overflow-x-hidden">
        <Container>{children}</Container>
        <Footer />
      </main>
    </div>
  );
}
