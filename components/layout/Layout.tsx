"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/composite/app-sidebar";

import Header from "./Header";
import Footer from "./Footer";
import Container from "./Container";
import FormDetailModal from "../views/sm-pay/components/FormDetailModal";

import ChannelTalkBoot from "../common/ChannelTalkBoot";

import { useSessionStore } from "@/store/useSessionStore";
import { useHistoryFormStore } from "@/store/useHistoryFormStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { formState, setFormState } = useHistoryFormStore();

  const { setTokens } = useSessionStore();

  const isNoNavPage =
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

  if (isNoNavPage || isErrorPage) {
    return <div>{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isNoNavPage && <ChannelTalkBoot />}

      {formState && (
        <FormDetailModal
          onClose={() => setFormState(null)}
          advertiserId={formState.advertiserId || 0}
          formId={formState.formId || 0}
        />
      )}

      <SidebarProvider className="flex flex-col">
        {!isErrorPage && <Header />}
        <div className="flex flex-1">
          {!isErrorPage && <AppSidebar />}

          <SidebarInset>
            <main className="flex-1 flex flex-col mt-[74px]  overflow-x-hidden">
              <Container>{children}</Container>
              <Footer />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
