import { AppWindow, ChartSpline, Smile } from "lucide-react";

import type { TResponseMenu } from "@/types/api/menu";

// 메뉴 이름과 아이콘/URL 매핑
const MENU_CONFIG = {
  "SM Pay 관리": {
    icon: AppWindow,
    baseUrl: "/sm-pay",
    subMenus: {
      "SM Pay 운영 검토": "/sm-pay/overview",
      "광고주 운영 현황": "/sm-pay/adversiter-status",
      "충전 회수 현황": "/sm-pay/charge",
    },
  },
  "광고 성과 리포트": {
    icon: ChartSpline,
    baseUrl: "/report",
    subMenus: {
      "계정 보고서": "/report/account",
      "캠페인 보고서": "/report/campaign",
      "광고 그룹 보고서": "/report/ad-group",
      "키워드 보고서": "/report/keyword",
      "검색어 보고서": "/report/search-keyword",
      "전환 보고서": "/report/conversion",
      "매체 보고서": "/report/media",
    },
  },
  // "자동 입찰": {
  //   icon: Target,
  //   baseUrl: "/auto-bidding",
  //   subMenus: {},
  // },
  "계정 관리": {
    icon: Smile,
    baseUrl: "/account",
    subMenus: {
      "부서 관리": "/account/department",
      "회원 관리": "/account/member-management",
      "대행사 관리": "/account/agency-management",
    },
  },
  // "CS 관리": {
  //   icon: Smile,
  //   baseUrl: "/cs",
  //   subMenus: {},
  // },
  // "게시판 관리": {
  //   icon: Eraser,
  //   baseUrl: "/board",
  //   subMenus: {
  //     "공지 관리": "/board/notice",
  //     "FAQ 관리": "/board/faq",
  //   },
  // },
  // "알림 설정": {
  //   icon: AlarmClock,
  //   baseUrl: "/notification",
  //   subMenus: {},
  // },
} as const;

export interface FrontendMenuItem {
  title: string;
  url: string;
  icon?: any;
  isActive: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

// URL 매핑 헬퍼 함수
function getMenuUrl(config: any): string {
  if (typeof config === "string") {
    return config;
  }

  if (typeof config === "object" && config !== null) {
    const url = config.ADMIN || config.MASTER || Object.values(config)[0];
    console.log("Admin URL:", url);
    return url;
  }

  return "";
}

function processMenuItems(menus: TResponseMenu[]): FrontendMenuItem[] {
  return menus
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((menu) => {
      const config = MENU_CONFIG[menu.name as keyof typeof MENU_CONFIG];

      if (!config) {
        console.error(`메뉴 설정을 찾을 수 없습니다: ${menu.name}`);
        return null;
      }

      const frontendMenu: FrontendMenuItem = {
        title: menu.name,
        url: config.baseUrl,
        icon: config.icon,
        isActive: true,
      };

      // 하위 메뉴가 있는 경우
      if (menu.children && menu.children.length > 0) {
        frontendMenu.items = menu.children
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((child) => {
            const subMenuConfig =
              config.subMenus[child.name as keyof typeof config.subMenus];
            return {
              title: child.name,
              url: subMenuConfig
                ? getMenuUrl(subMenuConfig)
                : `${config.baseUrl}/${child.menuId}`,
            };
          });
      }

      return frontendMenu;
    })
    .filter(Boolean) as FrontendMenuItem[];
}

// 재귀적으로 모든 메뉴를 평면화하는 함수
function flattenMenus(menus: TResponseMenu[]): TResponseMenu[] {
  const result: TResponseMenu[] = [];

  for (const menu of menus) {
    result.push(menu);
    if (menu.children && menu.children.length > 0) {
      result.push(...flattenMenus(menu.children));
    }
  }

  return result;
}

export function mapBackendMenuToFrontend(
  backendMenu: TResponseMenu | TResponseMenu[]
): FrontendMenuItem[] {
  // null이나 undefined 체크
  if (!backendMenu) {
    return [];
  }

  // 단일 객체인 경우 배열로 변환
  const menuArray = Array.isArray(backendMenu) ? backendMenu : [backendMenu];

  // 모든 메뉴를 평면화
  const allMenus = flattenMenus(menuArray);

  // 최상위 메뉴들만 필터링 (parentId가 null이거나 0인 것들)
  const topLevelMenus = allMenus.filter(
    (menu) => menu.parentId === null || menu.parentId === 0
  );

  return processMenuItems(topLevelMenus);
}

// 사용자 타입별 메뉴 필터링
export function filterMenuByUserType(
  menus: FrontendMenuItem[]
): FrontendMenuItem[] {
  // 관리자용만 사용하므로 모든 메뉴 반환
  return menus;
}
