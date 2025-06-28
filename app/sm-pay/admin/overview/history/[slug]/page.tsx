import ContentHeader from "@/components/common/ContentHeader";

import type { Metadata } from "next";
import type { DashboardSubItem } from "@/types/menu";

export default function SmPayAdminOverviewHistoryPage() {
  return (
    <div>
      <ContentHeader title="SM Pay 지난 이력 보기" items={breadcrumbItems} />
    </div>
  );
}

const breadcrumbItems: DashboardSubItem[] = [
  {
    title: "SM Pay d",
    url: "/sm-pay",
  },
  {
    title: "SM Pay 운영 검토",
    url: "/sm-pay/admin/overview",
  },
  {
    title: "SM Pay 운영 검토 지난 이력",
    url: "/sm-pay/admin/overview/history/[slug]",
  },
];
