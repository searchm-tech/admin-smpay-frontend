import { NumberInput } from "@/components/composite/input-components";
import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";
import { HelpIcon } from "@/components/composite/icon-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { TooltipHover } from "@/components/composite/tooltip-components";

import { TOOLTIP_CONTENT } from "@/constants/hover";

import type { PrePaymentSchedule } from "@/types/smpay";

const Header = () => {
  return (
    <div className="flex items-center gap-2 py-4">
      <LabelBullet labelClassName="text-base font-bold">
        선결제 스케쥴 설정
      </LabelBullet>
      <TooltipHover
        triggerContent={<HelpIcon />}
        content={TOOLTIP_CONTENT["prepayment_schedule_setting"]}
      />
    </div>
  );
};

type ShowProps = {
  prePaymentSchedule: PrePaymentSchedule;
};

export const ScheduleSectionShow = ({ prePaymentSchedule }: ShowProps) => {
  return (
    <section>
      <Header />

      <Descriptions columns={1}>
        <DescriptionItem label="일 최대 충전 한도">
          <span>1일 1회 AM 04:00</span>
        </DescriptionItem>
        <DescriptionItem label="최초 충전 금액 설정">
          <span className="text-blue-600">
            {prePaymentSchedule?.initialAmount.toLocaleString()}원
          </span>
        </DescriptionItem>
        <DescriptionItem label="일 최대 충전 한도">
          <span className="text-blue-600">
            {prePaymentSchedule?.maxChargeLimit.toLocaleString()}원
          </span>
        </DescriptionItem>
      </Descriptions>
    </section>
  );
};

type WriteProps = {
  prePaymentSchedule: PrePaymentSchedule;
  handleScheduleChange: (value: PrePaymentSchedule) => void;
};

export const ScheduleSectionWrite = ({
  prePaymentSchedule,
  handleScheduleChange,
}: WriteProps) => {
  return (
    <section>
      <Header />

      <Descriptions columns={1}>
        <DescriptionItem label="충전 스케쥴">
          <span>1일 1회 AM 04:00</span>
        </DescriptionItem>
        <DescriptionItem label="최초 충전 금액 설정">
          <div className="flex items-center gap-2">
            <NumberInput
              className="max-w-[500px]"
              value={prePaymentSchedule?.initialAmount || undefined}
              placeholder="10,000원 이상 입력해주세요."
              onChange={(e) =>
                handleScheduleChange &&
                handleScheduleChange({
                  ...(prePaymentSchedule || {}),
                  initialAmount: Number(e) || 0,
                } as PrePaymentSchedule)
              }
            />
            원
          </div>
        </DescriptionItem>

        <DescriptionItem label="일 최대 충전 한도">
          <div className="flex items-center gap-2">
            <NumberInput
              className="max-w-[500px]"
              placeholder="최초 충전금액 이상으로 입력해주세요."
              value={prePaymentSchedule?.maxChargeLimit || undefined}
              onChange={(e) =>
                handleScheduleChange &&
                handleScheduleChange({
                  ...(prePaymentSchedule || {}),
                  maxChargeLimit: Number(e) || 0,
                } as PrePaymentSchedule)
              }
            />
            원
          </div>
        </DescriptionItem>
      </Descriptions>
    </section>
  );
};
