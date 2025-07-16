import ContentHeader from "@/components/common/ContentHeader";
import ReportAdGroupView from "@/components/views/report/ad-group";
import type { DashboardSubItem } from "@/types/menu";

export default function AdGroupReportPage() {
  return (
    <div>
      <ContentHeader title="광고 그룹 보고서" items={breadcrumbItems} />
      <ReportAdGroupView />
    </div>
  );
}

const breadcrumbItems: DashboardSubItem[] = [
  {
    title: "광고 성과 리포트",
    url: "/report",
  },
  {
    title: "광고 그룹 보고서",
    url: "/report/ad-group",
  },
];
