"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn, getAuthType } from "@/lib/utils";
import { useQueryMenu } from "@/hooks/queries/menu";
import {
  mapBackendMenuToFrontend,
  filterMenuByUserType,
} from "@/utils/menuMapper";

export function NavDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();

  const { data: session } = useSession();
  const { data: backendMenu } = useQueryMenu();

  const handleClick = (url: string, isHasSubMenu: boolean) => {
    if (state === "collapsed") {
      toggleSidebar();
      return;
    }

    if (isHasSubMenu) {
      return;
    }

    router.push(url);
  };

  const menuType = useMemo(() => {
    if (!session) return "agency";
    if (!session.user) return "agency";
    return getAuthType(session.user.type);
  }, [session]);

  const menuItems = useMemo(() => {
    if (!session?.user) return [];
    if (backendMenu && session?.user) {
      const mappedMenus = mapBackendMenuToFrontend(backendMenu);
      const filteredMenus = filterMenuByUserType(mappedMenus);
      return filteredMenus;
    }

    // 백엔드 메뉴가 없으면 공통 메뉴
    return [];
  }, [backendMenu, session?.user, menuType]);

  return (
    <SidebarGroup className="h-full w-full bg-[var(--sidebar)] py-4 relative">
      <SidebarMenu>
        {menuItems.map((item) =>
          item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="cursor-pointer"
                    isSelected={item.items?.some(
                      (subItem) => subItem.url === pathname
                    )}
                    onClick={() =>
                      handleClick(item.url, (item.items?.length || 0) > 0)
                    }
                  >
                    {item.icon && <item.icon />}
                    <span className="font-medium group-data-[collapsible=icon]:hidden transition-opacity duration-300">
                      {item.title}
                    </span>
                    {state !== "collapsed" && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isSubActive = pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubActive}
                            className={cn("cursor-pointer h-9 px-4 rounded-xl")}
                          >
                            <a href={subItem.url}>
                              <span className="group-data-[collapsible=icon]:hidden transition-opacity duration-300">
                                {subItem.title}
                              </span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.isActive}
              >
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleClick(item.url, false)}
                >
                  {item.icon && <item.icon />}
                  <span className="group-data-[collapsible=icon]:hidden transition-opacity duration-300">
                    {item.title}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
