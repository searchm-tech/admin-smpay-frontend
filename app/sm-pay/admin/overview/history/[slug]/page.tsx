import ContentHeader from "@/components/common/ContentHeader";

import type { DashboardSubItem } from "@/types/menu";
import SmPayAdminOverviewHistoryDetailView from "@/components/views/sm-pay/admin/overview/history";

type PageParams = Promise<{ slug: string }>;

export default async function SmPayAdminOverviewHistoryPage({
  params,
}: {
  params: PageParams;
}) {
  const { slug } = await params;

  return (
    <div>
      <ContentHeader title="SM Pay 지난 이력 보기" items={breadcrumbItems} />
      <SmPayAdminOverviewHistoryDetailView id={slug} />
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
