import { LinkTextButton } from "@/components/composite/button-components";
import { ConfirmDialog } from "@/components/composite/modal-components";
import Table from "@/components/composite/table";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Card, CardHeader } from "@/components/ui/card";
import { useQueryDashboardUnclaimedList } from "@/hooks/queries/dashboard";
import { format } from "date-fns";
import { useState } from "react";

const TableUnclaimed = () => {
  const { data: unclaimedList = [], isLoading } =
    useQueryDashboardUnclaimedList();

  const [message, setMessage] = useState<string>("");

  const columns = [
    {
      title: "담당자",
      dataIndex: "user",
      key: "user",
      align: "center" as const,
      render: (user: any) => (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-medium">{user?.name || "-"}</span>
          {user?.loginId && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              {user.loginId}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "광고주",
      dataIndex: "chargeRecoveryHistory",
      key: "advertiser",
      align: "center" as const,
      render: (history: any) => {
        if (history.status === "FAILED ") {
          return (
            <LinkTextButton onClick={() => setMessage(history.failureReason)}>
              {history?.advertiserName || "-"}
            </LinkTextButton>
          );
        }
        return (
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium underline text-blue-600 cursor-pointer">
              {history?.advertiserName || "-"}
            </span>
          </div>
        );
      },
    },
    {
      title: "금액",
      dataIndex: "chargeRecoveryHistory",
      key: "amount",
      align: "center" as const,
      render: (history: any) => (
        <span className="text-sm font-medium text-red-600">
          {history?.paymentAmount?.toLocaleString() || "0"}원
        </span>
      ),
    },
    {
      title: "마지막 회수 시도일",
      dataIndex: "chargeRecoveryHistory",
      key: "lastAttemptDate",
      align: "center" as const,
      render: (history: any) => (
        <span className="text-sm">
          {history?.processedDate
            ? format(new Date(history.processedDate), "yyyy-MM-dd")
            : "-"}
        </span>
      ),
    },
  ];

  return (
    <Card>
      {message && (
        <ConfirmDialog
          open
          content={message}
          onConfirm={() => setMessage("")}
          onClose={() => setMessage("")}
        />
      )}
      <CardHeader>
        <CardTitle className="h-12 flex items-center">
          <span className="text-base font-bold">• 미수 광고주 리스트</span>
          {unclaimedList.length > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              {unclaimedList.length}건
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table
          columns={columns}
          dataSource={unclaimedList.map((item, index) => ({
            key: index,
            ...item,
          }))}
          pagination={false}
          scroll={{ y: 260 }}
          bordered={false}
          size="middle"
          loading={isLoading}
        />
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm flex items-center gap-2">
          <span className="text-blue-500 text-xl">ⓘ</span>
          <div>
            <div>광고비가 회수되지 않은 광고주를 즉시 확인해 주세요.</div>
            <div className="text-xs text-gray-600 mt-1">
              3회 이상 회수 실패 시 광고계정의 상태가 일시중지되며, 광고 비용이
              회수되면 계정 상태는 재개될 수 있습니다.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableUnclaimed;
