"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { AppWindow, Smile } from "lucide-react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/composite/app-sidebar";

import Header from "./Header";
import Footer from "./Footer";
import Container from "./Container";
import FormDetailModal from "../views/sm-pay/components/FormDetailModal";
import ChannelTalkBoot from "../common/ChannelTalkBoot";

import { useSessionStore } from "@/store/useSessionStore";
import { useHistoryFormStore } from "@/store/useHistoryFormStore";
import { FrontendMenuItem } from "@/utils/menuMapper";
import { TSMPayUser } from "@/types/user";

interface MainLayoutClientProps {
  menuData?: FrontendMenuItem[];
  user?: TSMPayUser;
  children: React.ReactNode;
}

// 클라이언트에서 아이콘 매핑
const ICON_MAP: Record<string, any> = {
  "SM Pay 관리": AppWindow,
  "계정 관리": Smile,
};

export function MainLayoutClient({
  menuData,
  user,
  children,
}: MainLayoutClientProps) {
  const { formState, setFormState } = useHistoryFormStore();
  const { setTokens } = useSessionStore();

  // 클라이언트에서 아이콘 복원
  const menuWithIcons = useMemo(() => {
    if (!menuData) return [];
    return menuData.map((item) => ({
      ...item,
      icon: ICON_MAP[item.title] || null,
    }));
  }, [menuData]);

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

  return (
    <div className="flex flex-col min-h-screen">
      <ChannelTalkBoot />

      {formState && (
        <FormDetailModal
          onClose={() => setFormState(null)}
          advertiserId={formState.advertiserId || 0}
          formId={formState.formId || 0}
        />
      )}

      <SidebarProvider className="flex flex-col">
        <Header user={user} />
        <div className="flex flex-1">
          <AppSidebar menuData={menuWithIcons} />
          <SidebarInset>
            <main className="flex-1 flex flex-col mt-[74px] overflow-x-hidden">
              <Container>{children}</Container>
              <Footer />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
