"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Space,
  Tag,
  Button,
  Input,
  Select,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ChargeRecoveryData {
  key: string;
  advertiserId: string;
  advertiserName: string;
  agencyName: string;
  chargeAmount: number;
  recoveryAmount: number;
  remainingAmount: number;
  chargeDate: string;
  dueDate: string;
  status: string;
  paymentMethod: string;
  accountNumber: string;
  bankName: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  department: string;
  manager: string;
  notes: string;
  lastUpdated: string;
}

const ChargeRecoveryView = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ChargeRecoveryData[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 샘플 데이터 생성
  const generateSampleData = (): ChargeRecoveryData[] => {
    const statuses = ["정상", "연체", "완료", "대기"];
    const paymentMethods = ["계좌이체", "카드결제", "현금"];
    const banks = ["신한은행", "국민은행", "우리은행", "하나은행", "기업은행"];

    return Array.from({ length: 50 }, (_, index) => ({
      key: index.toString(),
      advertiserId: `ADV${String(index + 1).padStart(4, "0")}`,
      advertiserName: `광고주${index + 1}`,
      agencyName: `대행사${Math.floor(index / 5) + 1}`,
      chargeAmount: Math.floor(Math.random() * 10000000) + 1000000,
      recoveryAmount: Math.floor(Math.random() * 8000000) + 500000,
      remainingAmount: Math.floor(Math.random() * 5000000) + 100000,
      chargeDate: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      accountNumber: `${Math.floor(Math.random() * 999999999999) + 100000000000}`,
      bankName: banks[Math.floor(Math.random() * banks.length)],
      contactPerson: `담당자${index + 1}`,
      phoneNumber: `010-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
      email: `contact${index + 1}@company.com`,
      department: `부서${Math.floor(index / 10) + 1}`,
      manager: `매니저${Math.floor(index / 15) + 1}`,
      notes: index % 3 === 0 ? "특별 관리 대상" : "",
      lastUpdated: new Date().toISOString().split("T")[0],
    }));
  };

  useEffect(() => {
    setData(generateSampleData());
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "정상":
        return "green";
      case "연체":
        return "red";
      case "완료":
        return "blue";
      case "대기":
        return "orange";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<ChargeRecoveryData> = [
    {
      title: "광고주 ID",
      dataIndex: "advertiserId",
      key: "advertiserId",
      width: 120,
      fixed: "left",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "광고주명",
      dataIndex: "advertiserName",
      key: "advertiserName",
      width: 150,
      fixed: "left",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "대행사명",
      dataIndex: "agencyName",
      key: "agencyName",
      width: 130,
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "충전 금액",
      dataIndex: "chargeAmount",
      key: "chargeAmount",
      width: 130,
      render: (amount) => (
        <Text strong style={{ color: "#1890ff" }}>
          {amount.toLocaleString()}원
        </Text>
      ),
    },
    {
      title: "회수 금액",
      dataIndex: "recoveryAmount",
      key: "recoveryAmount",
      width: 130,
      render: (amount) => (
        <Text style={{ color: "#52c41a" }}>{amount.toLocaleString()}원</Text>
      ),
    },
    {
      title: "잔액",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      width: 120,
      render: (amount) => (
        <Text style={{ color: amount > 1000000 ? "#faad14" : "#52c41a" }}>
          {amount.toLocaleString()}원
        </Text>
      ),
    },
    {
      title: "충전일",
      dataIndex: "chargeDate",
      key: "chargeDate",
      width: 110,
      render: (date) => <Text>{date}</Text>,
    },
    {
      title: "만기일",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 110,
      render: (date) => <Text>{date}</Text>,
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "결제방법",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 110,
      render: (method) => <Text>{method}</Text>,
    },
    {
      title: "계좌번호",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
      render: (account) => <Text code>{account}</Text>,
    },
    {
      title: "은행명",
      dataIndex: "bankName",
      key: "bankName",
      width: 100,
      render: (bank) => <Text>{bank}</Text>,
    },
    {
      title: "담당자",
      dataIndex: "contactPerson",
      key: "contactPerson",
      width: 100,
      render: (person) => <Text>{person}</Text>,
    },
    {
      title: "연락처",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 130,
      render: (phone) => <Text>{phone}</Text>,
    },
    {
      title: "이메일",
      dataIndex: "email",
      key: "email",
      width: 180,
      render: (email) => <Text>{email}</Text>,
    },
    {
      title: "부서",
      dataIndex: "department",
      key: "department",
      width: 100,
      render: (dept) => <Text>{dept}</Text>,
    },
    {
      title: "매니저",
      dataIndex: "manager",
      key: "manager",
      width: 100,
      render: (manager) => <Text>{manager}</Text>,
    },
    {
      title: "비고",
      dataIndex: "notes",
      key: "notes",
      width: 120,
      render: (notes) => (notes ? <Tag color="orange">{notes}</Tag> : "-"),
    },
    {
      title: "최종수정일",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      width: 120,
      render: (date) => <Text type="secondary">{date}</Text>,
    },
    {
      title: "액션",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" type="link">
            상세
          </Button>
          <Button size="small" type="link">
            수정
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  return (
    <div className="p-6 w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <Title level={2}>충전 회수 현황</Title>
        <Text type="secondary">광고주별 충전 및 회수 현황을 관리합니다.</Text>
      </div>

      {/* 검색 및 필터 영역 */}
      <Card className="mb-6">
        <div className="space-y-4">
          {/* 첫 번째 줄 */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px] max-w-[300px]">
              <Text strong>광고주명</Text>
              <Input
                placeholder="광고주명 검색"
                prefix={<SearchOutlined />}
                className="mt-1"
              />
            </div>
            <div className="flex-1 min-w-[120px] max-w-[200px]">
              <Text strong>상태</Text>
              <Select
                placeholder="상태 선택"
                className="w-full mt-1"
                options={[
                  { value: "정상", label: "정상" },
                  { value: "연체", label: "연체" },
                  { value: "완료", label: "완료" },
                  { value: "대기", label: "대기" },
                ]}
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-[300px]">
              <Text strong>기간</Text>
              <RangePicker className="w-full mt-1" />
            </div>
          </div>
          {/* 두 번째 줄 */}
          <div className="flex gap-2">
            <Button type="primary" icon={<SearchOutlined />}>
              검색
            </Button>
            <Button icon={<ReloadOutlined />}>초기화</Button>
          </div>
        </div>
      </Card>

      {/* 테이블 영역 */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div>
            <Text strong>총 {data.length}건</Text>
          </div>
          <Button type="primary" icon={<DownloadOutlined />}>
            엑셀 다운로드
          </Button>
        </div>

        <div className="w-full overflow-hidden">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / 총 ${total}건`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 2800, y: 600 }}
            size="middle"
            bordered
            rowClassName={(record) =>
              record.status === "연체" ? "bg-red-50" : ""
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default ChargeRecoveryView;
