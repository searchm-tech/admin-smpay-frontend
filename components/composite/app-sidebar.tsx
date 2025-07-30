import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavDashboard } from "@/components/composite/nav-dashboard";
import Copyright from "@/components/layout/Copyright";

import type { FrontendMenuItem } from "@/utils/menuMapper";

export function AppSidebar({
  menuData,
  ...props
}: React.ComponentProps<typeof Sidebar> & { menuData?: FrontendMenuItem[] }) {
  const { state } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="fixed top-[60px] h-[calc(100vh-60px)]"
      {...props}
    >
      <SidebarContent>
        <NavDashboard menuData={menuData} />
      </SidebarContent>

      {state === "expanded" && (
        <SidebarFooter>
          <Copyright className="py-4" />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
