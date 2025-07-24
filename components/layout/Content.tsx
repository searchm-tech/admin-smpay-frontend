"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/composite/app-sidebar";
import { ConfirmDialog } from "@/components/composite/modal-components";

import Header from "./Header";
import Footer from "./Footer";
import SmPayGuideModal from "./GuideModal";

import { useGuideModalStore } from "@/store/useGuideModalStore";
import { useSessionStore } from "@/store/useSessionStore";
import ChannelTalkBoot from "../common/ChannelTalkBoot";
import Container from "./Container";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen: isGuideOpen, setIsOpen: setGuideOpen } = useGuideModalStore();

  const { setTokens } = useSessionStore();

  const [isExpireModalOpen, setIsExpireModalOpen] = useState(false);

  const isNoNavPage =
    pathname === "/advertiser-verification" ||
    pathname === "/sign-in" ||
    pathname === "/password-reset" ||
    pathname === "/find-password" ||
    pathname === "/sign-out" ||
    pathname === "/sign-up" ||
    pathname === "/example" ||
    pathname === "/error" ||
    pathname === "/" ||
    pathname === "/deactivate" ||
    pathname === "/delete-account";

  const isErrorPage = pathname === "/not-found" || pathname === "/error";

  const handleCloseExpireModal = () => {
    setIsExpireModalOpen(false);
    router.push("/sign-in");
  };

  useEffect(() => {
    if (!isNoNavPage) {
      const hideGuideModal = localStorage.getItem("hideGuideModal");
      const now = new Date().getTime();

      if (hideGuideModal === "forever") {
        setGuideOpen(false);
        return;
      }

      const isSmPayPath = pathname.includes("/sm-pay/management");

      if (isSmPayPath && (!hideGuideModal || Number(hideGuideModal) < now)) {
        setGuideOpen(true);
      }
    }
  }, [pathname, setGuideOpen, isNoNavPage]);

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

  if (isNoNavPage) {
    return <div>{children}</div>;
  }

  if (isErrorPage) {
    return <div>{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isNoNavPage && <ChannelTalkBoot />}
      {isExpireModalOpen && (
        <ConfirmDialog
          open
          content="세션이 만료되었습니다. 다시 로그인해주세요."
          onClose={handleCloseExpireModal}
          onConfirm={handleCloseExpireModal}
        />
      )}

      {isGuideOpen && <SmPayGuideModal onClose={() => setGuideOpen(false)} />}

      <SidebarProvider className="flex flex-col">
        {!isErrorPage && <Header />}
        <div className="flex flex-1">
          {!isErrorPage && <AppSidebar />}

          <SidebarInset>
            <main className="flex-1 flex flex-col mt-[74px]">
              <Container>{children}</Container>
              <Footer />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
