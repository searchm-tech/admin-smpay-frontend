import { Label } from "@/components/ui/label";

import {
  DescriptionItem,
  Descriptions,
} from "@/components/composite/description-components";
import { LabelBullet } from "@/components/composite/label-bullet";

import type { OverviewApplyAccountDto } from "@/types/dto/smpay";

type Props = {
  accounList: OverviewApplyAccountDto[];
};

const AccountSection = ({ accounList }: Props) => {
  const depositAccount = accounList.find(
    (account) => account.advertiserAccountType === "DEPOSIT"
  );

  const salesAccount = accounList.find(
    (account) => account.advertiserAccountType === "WITHDRAW"
  );
  return (
    <div>
      <section className="w-full flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 py-4">
            <LabelBullet labelClassName="text-base font-bold">
              충전 계좌 정보
            </LabelBullet>
          </div>
          <Descriptions columns={1}>
            <DescriptionItem label="충전 계좌 은행">
              <Label>{depositAccount?.advertiserAccountCodeName}</Label>
            </DescriptionItem>
            <DescriptionItem label="충전 계좌 번호">
              <Label>{depositAccount?.advertiserAccountNumber}</Label>
            </DescriptionItem>
            <DescriptionItem label="충전 계좌 예금주명">
              <Label>{depositAccount?.advertiserAccountName}</Label>
            </DescriptionItem>
          </Descriptions>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 py-4">
            <LabelBullet labelClassName="text-base font-bold">
              매출 계좌 정보
            </LabelBullet>
          </div>
          <Descriptions columns={1}>
            <DescriptionItem label="매출 계좌 은행">
              <Label>{salesAccount?.advertiserAccountCodeName}</Label>
            </DescriptionItem>
            <DescriptionItem label="매출 계좌 번호">
              <Label>{salesAccount?.advertiserAccountNumber}</Label>
            </DescriptionItem>
            <DescriptionItem label="매출 계좌 예금주명">
              <Label>{salesAccount?.advertiserAccountName}</Label>
            </DescriptionItem>
          </Descriptions>
        </div>
      </section>
    </div>
  );
};

export default AccountSection;
