import Table from "@/components/composite/table";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";

import { useQueryDashboardRecommendedAdvertiserList as useRecommendList } from "@/hooks/queries/dashboard";

import type { AdvertiserRecommendDto } from "@/types/dto/dashboard";
import type { TableProps } from "@/types/table";

const TableRecommend = () => {
  const { data: advertiserRecommendList, isLoading } = useRecommendList();

  const columns: TableProps<AdvertiserRecommendDto>["columns"] = [
    { title: "회원명", dataIndex: "userName", align: "center" },
    { title: "광고주", dataIndex: "advertiser", align: "center" },
    { title: "일 평균 ROAS", dataIndex: "dailyAvgRoas", align: "center" },
    {
      title: "월 평균 전환매출",
      dataIndex: "monthlyAvgConvAmt",
      align: "center",
    },
    { title: "일 평균 소진 광고비", dataIndex: "dailyCost", align: "center" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="h-12 flex items-center">
          <span className="text-base font-bold">• 추천 광고주 리스트</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={advertiserRecommendList}
          pagination={false}
          scroll={{ y: 260 }}
          bordered={false}
          size="middle"
          loading={isLoading}
        />
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm flex items-center gap-2">
          <span className="text-blue-500 text-xl">ⓘ</span>
          <span>SM Pay 서비스를 지금 바로 신청해 보세요.</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableRecommend;
