import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  DescriptionItem,
  Descriptions,
  SubDescItem,
} from "@/components/composite/description-components";
import { HelpIcon } from "@/components/composite/icon-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { TooltipHover } from "@/components/composite/tooltip-components";
import { useSmPayAdminOverviewAccountBalance } from "@/hooks/queries/sm-pay";

import { TOOLTIP_CONTENT } from "@/constants/hover";

import type { OverviewAccountBalanceDto } from "@/types/smpay";

type Props = {
  advertiserId: number;
  initialAmount: number;
};

// SM Pay 계좌 계산 함수
interface SmPayAccountCalculation {
  currentBalance: number; // 현재 운영 잔액
  currentDailyUsing: number; // 현재 일 소진 금액
  approvalExpectedDaily: number; // 승인 시 예상 일 소진 금액
  expectedDailyAmount: number; // 예상 일 소진 금액 (총합)
  expectedOperatingDays: number; // 예상 운영 가능 일수
}

const calculateSmPayAccount = (
  accountData?: OverviewAccountBalanceDto,
  estimatedApprovalDaily: number = 0
): SmPayAccountCalculation => {
  if (!accountData) {
    return {
      currentBalance: 0,
      currentDailyUsing: 0,
      approvalExpectedDaily: 0,
      expectedDailyAmount: 0,
      expectedOperatingDays: 0,
    };
  }

  // 1. 기본 데이터
  const currentBalance = accountData.balance;
  const currentDailyUsing = accountData.dailyUsingAmount;

  // 2. 승인 시 예상 일 소진 금액 (현재는 임시값, 추후 실제 계산 로직 적용)
  const approvalExpectedDaily = estimatedApprovalDaily;

  // 3. 총 예상 일 소진 금액
  const expectedDailyAmount = currentDailyUsing + approvalExpectedDaily;

  // 4. 예상 운영 가능 일수 (소수점 1자리)
  const expectedOperatingDays =
    expectedDailyAmount > 0
      ? Math.round((currentBalance / expectedDailyAmount) * 10) / 10
      : 0;

  return {
    currentBalance,
    currentDailyUsing,
    approvalExpectedDaily,
    expectedDailyAmount,
    expectedOperatingDays,
  };
};

const OperationAccountStatusSection = ({
  advertiserId,
  initialAmount,
}: Props) => {
  const { data: accountInfo } =
    useSmPayAdminOverviewAccountBalance(advertiserId);

  // 계산된 값들을 메모이제이션
  const calculatedData = useMemo(() => {
    const estimatedApprovalDaily = accountInfo?.balance || 0;

    return calculateSmPayAccount(accountInfo, estimatedApprovalDaily);
  }, [accountInfo]);

  // initialAmount + calculatedData.currentDailyUsing = 승인 시 예상 일 소진 금액
  const totalExpectedDailyAmount =
    initialAmount + calculatedData.currentDailyUsing;

  return (
    <section>
      <div className="flex items-center gap-4 py-4">
        <LabelBullet labelClassName="text-base font-bold">
          SM Pay 운영 계좌 현황
        </LabelBullet>
        <TooltipHover
          triggerContent={<HelpIcon />}
          content={TOOLTIP_CONTENT["operation_account_status"]}
        />
      </div>

      <Descriptions columns={1} styles={{ label: { width: 250 } }}>
        <DescriptionItem label="현재 운영 잔액">
          <div className="flex items-center gap-2">
            <Label className="w-1/2">
              {calculatedData.currentBalance.toLocaleString()}원
            </Label>
            <SubDescItem>
              SM Pay 총 운영 가능 잔액 (2025년 5월 28일 AM06:00시 기준)
            </SubDescItem>
          </div>
        </DescriptionItem>
        <DescriptionItem label="현재일 소진 금액">
          <div className="flex items-center gap-2">
            <Label className="w-1/2">
              {calculatedData.currentDailyUsing.toLocaleString()}원
            </Label>
            <SubDescItem>
              현재 운영 중인 광고주의 총 데일리 소진 금액 합산
            </SubDescItem>
          </div>
        </DescriptionItem>
        <DescriptionItem label="승인 시 예상 일 소진 금액">
          <div className="flex items-center gap-2">
            <Label className="w-1/2">
              {totalExpectedDailyAmount.toLocaleString()}원
            </Label>
            <SubDescItem>승인 시 추가로 증가하는 일 소진 금액</SubDescItem>
          </div>
        </DescriptionItem>
        <DescriptionItem label="일 소진 금액">
          <div className="flex items-center gap-2">
            <Label className="w-1/2">+{initialAmount.toLocaleString()}원</Label>
            <SubDescItem>
              현재 광고주 승인 시 추가로 예상되는 데일리 소진 금액
            </SubDescItem>
          </div>
        </DescriptionItem>
        <DescriptionItem label="예상 일 소진 기준 운영 가능 일수">
          <div className="flex items-center gap-2">
            <Label className="w-1/2">
              약 {calculatedData.expectedOperatingDays}일
            </Label>
            <SubDescItem>
              현재 운영 잔액 ÷ 예상 총 일 소진 금액 (소수점 1자리까지 표기)
            </SubDescItem>
          </div>
        </DescriptionItem>
      </Descriptions>
    </section>
  );
};

export default OperationAccountStatusSection;
