import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import { NavDashboard } from "@/components/composite/nav-dashboard";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="fixed top-[60px] h-[calc(100vh-60px)]"
      {...props}
    >
      <SidebarContent>
        <NavDashboard />
      </SidebarContent>
    </Sidebar>
  );
}
