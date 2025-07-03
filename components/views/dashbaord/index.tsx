"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Chart from "@/components/common/Chart";
import { TabSwitch } from "@/components/composite/tab-switch";
import Chart2 from "@/components/common/Chart2";
import Table from "@/components/composite/table";

const stats = [
  {
    title: "전체 광고주 현황",
    value: "50",
    unit: "명",
    sub: "7일 평균 ROAS",
    subValue: "200%",
    icon: "💙",
    iconBg: "bg-blue-100",
  },
  {
    title: "SM Pay 광고주",
    value: "50",
    unit: "명",
    sub: "7일 평균 ROAS",
    subValue: "400%",
    icon: "🟡",
    iconBg: "bg-yellow-100",
  },
  {
    title: "전일 충전 금액",
    value: "543,210",
    unit: "원",
    icon: "👜",
    iconBg: "bg-orange-100",
  },
  {
    title: "전일 회수 금액",
    value: "543,210",
    unit: "원",
    icon: "💼",
    iconBg: "bg-indigo-100",
  },
];

const advertiserOptions = [
  { value: "all", label: "전체 광고주" },
  { value: "sm-pay", label: "SM Pay 광고주" },
];

export default function DashboardView() {
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("all");

  return (
    <div className="space-y-6 p-4">
      {/* 상단 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="relative rounded-xl shadow bg-white p-6 flex flex-col justify-between min-h-[180px]"
          >
            {/* 상단: 타이틀과 아이콘 */}
            <div className="flex justify-between items-center w-full">
              <span className="text-lg font-bold">{stat.title}</span>
              <span
                className={`w-12 h-12 flex items-center justify-center rounded-full ${stat.iconBg}`}
              >
                <span className="text-2xl">{stat.icon}</span>
              </span>
            </div>
            {/* 하단: 값, 단위, 부가정보 */}
            <div className="mt-8 flex flex-col items-start">
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-extrabold">{stat.value}</span>
                {stat.unit && (
                  <span className="text-lg font-semibold mb-1">
                    {stat.unit}
                  </span>
                )}
              </div>
              {stat.sub && (
                <div className="mt-1 text-xs text-gray-400 flex items-center space-x-1">
                  <span>{stat.sub}</span>
                  <span className="font-bold">{stat.subValue}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* 안내/가이드 배너 (Alert 대체: Card 사용) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>SM Pay - 이용 가이드</CardTitle>
          </CardHeader>
          <CardContent>
            중소사업자를 위한 스마트한 광고비 관리 솔루션! <br />
            이용 가이드를 참고해 쉽게 시작해보세요.
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>네이버 마케팅 / 광고주 등록</CardTitle>
          </CardHeader>
          <CardContent>
            SM Pay 서비스를 이용하려면 먼저 네이버 마케터 라이선스 등록과 광고주
            계정 등록을 완료해주세요.
          </CardContent>
        </Card>
      </div>

      {/* 구분선 */}
      <Separator />

      {/* 광고비/성과 추이 섹션 */}

      <section className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <TabSwitch
              value={selectedAdvertiser === "all"}
              onValueChange={(value) => {
                if (value) {
                  setSelectedAdvertiser("all");
                } else {
                  setSelectedAdvertiser("sm-pay");
                }
              }}
              leftLabel="전체 광고주"
              rightLabel="SM Pay 광고주"
            />
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAdvertiser}
              onValueChange={setSelectedAdvertiser}
              className="flex gap-4 my-4"
            >
              {advertiserOptions.map((opt) => (
                <div key={opt.value} className="flex items-center gap-1">
                  <RadioGroupItem value={opt.value} id={opt.value} />
                  <Label htmlFor={opt.value}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>

            <Chart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="h-12 flex items-center">
              <span className="text-base font-bold">광고 성과 추이</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart2 />
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="h-12 flex items-center">
              <span className="text-base font-bold">• 추천 광고주 리스트</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { title: "회원명", dataIndex: "member", align: "center" },
                { title: "광고주", dataIndex: "advertiser", align: "center" },
                { title: "일 평균 ROAS", dataIndex: "roas", align: "center" },
                {
                  title: "월 평균 전환매출",
                  dataIndex: "monthlySales",
                  align: "center",
                },
                {
                  title: "일 평균 소진 광고비",
                  dataIndex: "dailyCost",
                  align: "center",
                },
              ]}
              dataSource={[
                {
                  key: 1,
                  member: "그룹원명",
                  advertiser: "광고주명",
                  roas: "400%",
                  monthlySales: "100,000원",
                  dailyCost: "100,000원",
                },
                {
                  key: 2,
                  member: "",
                  advertiser: "광고주명",
                  roas: "400%",
                  monthlySales: "100,000원",
                  dailyCost: "100,000원",
                },
                {
                  key: 3,
                  member: "그룹원명",
                  advertiser: "광고주명",
                  roas: "400%",
                  monthlySales: "100,000원",
                  dailyCost: "100,000원",
                },
                {
                  key: 4,
                  member: "",
                  advertiser: "광고주명",
                  roas: "400%",
                  monthlySales: "100,000원",
                  dailyCost: "100,000원",
                },
                {
                  key: 5,
                  member: "",
                  advertiser: "광고주명",
                  roas: "400%",
                  monthlySales: "100,000원",
                  dailyCost: "100,000원",
                },
              ]}
              pagination={false}
              scroll={{ y: 260 }}
              bordered={false}
              size="middle"
            />
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm flex items-center gap-2">
              <span className="text-blue-500 text-xl">ⓘ</span>
              <span>SM Pay 서비스를 지금 바로 신청해 보세요.</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="h-12 flex items-center">
              <span className="text-base font-bold">• 미수 광고주 리스트</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              columns={[
                { title: "회원명", dataIndex: "member", align: "center" },
                { title: "광고주", dataIndex: "advertiser", align: "center" },
                { title: "금액", dataIndex: "amount", align: "center" },
                {
                  title: "최근 상환일",
                  dataIndex: "latestRefundDate",
                  align: "center",
                },
              ]}
              dataSource={[
                {
                  key: 1,
                  member: "그룹원명",
                  advertiser: "광고주명",
                  amount: "100,000원",
                  latestRefundDate: "2025-01-01",
                },
                {
                  key: 2,
                  member: "",
                  advertiser: "광고주명",
                  amount: "100,000원",
                  latestRefundDate: "2025-01-01",
                },
                {
                  key: 3,
                  member: "그룹원명",
                  advertiser: "광고주명",
                  amount: "100,000원",
                  latestRefundDate: "2025-01-01",
                },
                {
                  key: 4,
                  member: "",
                  advertiser: "광고주명",
                  amount: "100,000원",
                  latestRefundDate: "2025-01-01",
                },
                {
                  key: 5,
                  member: "",
                  advertiser: "광고주명",
                  amount: "100,000원",
                  latestRefundDate: "2025-01-01",
                },
              ]}
              pagination={false}
              scroll={{ y: 260 }}
              bordered={false}
              size="middle"
            />
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm flex items-center gap-2">
              <span className="text-blue-500 text-xl">ⓘ</span>
              <span>SM Pay 서비스를 지금 바로 신청해 보세요.</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
