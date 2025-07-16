import Table from "@/components/composite/table";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Card, CardHeader } from "@/components/ui/card";

const TableUnclaimed = () => {
  return (
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
  );
};

export default TableUnclaimed;
