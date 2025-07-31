"use client";

import { useMemo } from "react";
import { AppWindow, Smile } from "lucide-react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/composite/app-sidebar";

import Header from "./Header";
import Footer from "./Footer";
import Container from "./Container";
import FormDetailModal from "../views/sm-pay/components/FormDetailModal";
import ChannelTalkBoot from "../common/ChannelTalkBoot";

import { useHistoryFormStore } from "@/store/useHistoryFormStore";
import type { FrontendMenuItem } from "@/utils/menuMapper";
import type { TSMPayUser } from "@/types/user";

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

  // 클라이언트에서 아이콘 복원
  const menuWithIcons = useMemo(() => {
    if (!menuData) return [];
    return menuData.map((item) => ({
      ...item,
      icon: ICON_MAP[item.title] || null,
    }));
  }, [menuData]);

  // persist 미들웨어가 자동으로 토큰을 복원하므로 마이그레이션 로직 제거

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
