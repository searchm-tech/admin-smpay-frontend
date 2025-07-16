import ContentHeader from "@/components/common/ContentHeader";
import ReportCampaignView from "@/components/views/report/campain";
import type { DashboardSubItem } from "@/types/menu";

export default function CampaignReportPage() {
  return (
    <div>
      <ContentHeader title="캠페인 보고서" items={breadcrumbItems} />
      <ReportCampaignView />
    </div>
  );
}

const breadcrumbItems: DashboardSubItem[] = [
  {
    title: "광고 성과 리포트",
    url: "/report",
  },
  {
    title: "캠페인 보고서",
    url: "/report/campaign",
  },
];
