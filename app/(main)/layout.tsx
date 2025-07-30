import { getMenuApiServer } from "@/services/menu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MainLayoutClient } from "@/components/layout/MainLayoutClient";
import { mapBackendMenuToFrontend } from "@/utils/menuMapper";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/sign-in");
  }

  const menuData = await getInitialMenuData(session.user.accessToken);

  return (
    <MainLayoutClient menuData={menuData} user={session.user}>
      {children}
    </MainLayoutClient>
  );
}

async function getInitialMenuData(accessToken: string) {
  try {
    // 서버에서 토큰을 포함하여 메뉴 데이터 로드
    const menuData = await getMenuApiServer(accessToken);
    const mappedMenus = mapBackendMenuToFrontend(menuData);

    // 아이콘 함수를 제거하고 구조만 반환 (서버 → 클라이언트 전달용)
    return mappedMenus.map((item) => ({
      title: item.title,
      url: item.url,
      isActive: item.isActive,
      items: item.items,
    }));
  } catch (error) {
    console.error("초기 메뉴 로드 실패:", error);

    const defaultMenu = [
      {
        title: "SM Pay 관리",
        url: "/sm-pay",
        isActive: true,
        items: [
          { title: "SM Pay 운영 검토", url: "/sm-pay/overview" },
          { title: "광고주 운영 현황", url: "/sm-pay/adversiter-status" },
          { title: "충전 회수 현황", url: "/sm-pay/charge" },
        ],
      },
    ];
    return defaultMenu;
  }
}
