import ContentHeader from "@/components/common/ContentHeader";
import SMPayManagementHistoryView from "@/components/views/sm-pay/manangement/history";

import type { Metadata } from "next";
import type { DashboardSubItem } from "@/types/menu";

type PageParams = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  return {
    title: `SM-Pay 지난 이력 상세 : ${params.slug}`,
  };
}

export default function SMPayManagementHistoryPage({
  params,
}: {
  params: PageParams;
}) {
  return (
    <div>
      <ContentHeader title="SM Pay 지난 이력 보기" items={breadcrumbItems} />
      <SMPayManagementHistoryView id={params.slug} />
    </div>
  );
}

const breadcrumbItems: DashboardSubItem[] = [
  {
    title: "SM Pay",
    url: "/sm-pay/management",
  },
  {
    title: "SM Pay관리",
    url: "/sm-pay/management",
  },
  {
    title: "SM Pay 지난 이력",
    url: "/sm-pay/management/history/[slug]",
  },
];
