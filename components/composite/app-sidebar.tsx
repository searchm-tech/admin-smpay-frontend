import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavDashboard } from "@/components/composite/nav-dashboard";
import Copyright from "@/components/layout/Copyright";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  console.log(state);
  return (
    <Sidebar
      collapsible="icon"
      className="fixed top-[60px] h-[calc(100vh-60px)]"
      {...props}
    >
      <SidebarContent>
        <NavDashboard />
      </SidebarContent>

      {state === "expanded" && (
        <SidebarFooter>
          <Copyright className="py-4" />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
