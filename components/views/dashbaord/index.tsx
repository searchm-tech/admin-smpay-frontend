"use client";

import { Separator } from "@/components/ui/separator";

import CardSection from "./CardSection";
import GuideSection from "./GuideSection";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";

export default function DashboardView() {
  return (
    <div className="space-y-6 p-4 max-w-[1400px] mx-auto">
      {/* 상단 요약 카드 */}
      <CardSection />

      {/* 안내/가이드 배너 (Alert 대체: Card 사용) */}
      <GuideSection />

      {/* 구분선 */}
      <Separator />

      {/* Chart 섹션 */}
      <ChartSection />

      {/* Table 섹션 */}
      <TableSection />
    </div>
  );
}
