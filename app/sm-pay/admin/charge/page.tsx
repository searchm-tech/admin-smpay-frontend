import ContentHeader from "@/components/common/ContentHeader";
import SmPayAdminChargeView from "@/components/views/sm-pay/charge";

import type { DashboardSubItem } from "@/types/menu";

export default function SmPayAdminChargePage() {
  return (
    <div>
      <ContentHeader title="충전 회수 관리" items={breadcrumbItems} />
      <SmPayAdminChargeView />
    </div>
  );
}

const breadcrumbItems: DashboardSubItem[] = [
  {
    title: "SM Pay 관리",
    url: "/sm-pay/admin",
  },
  {
    title: "충전 회수 관리",
    url: "/sm-pay/admin/charge",
  },
];
