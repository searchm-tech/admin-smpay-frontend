import ContentHeader from "@/components/common/ContentHeader";
import ReportKeywordView from "@/components/views/report/keyword";
import type { DashboardSubItem } from "@/types/menu";

export default function KeywordReportPage() {
  return (
    <div>
      <ContentHeader title="키워드 보고서" items={breadcrumbItems} />
      <ReportKeywordView />
    </div>
  );
}

const breadcrumbItems: DashboardSubItem[] = [
  {
    title: "광고 성과 리포트",
    url: "/report",
  },
  {
    title: "키워드 보고서",
    url: "/report/keyword",
  },
];
