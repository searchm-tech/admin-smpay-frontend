import { useState } from "react";
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

type Props = {
  prePaymentSchedule?: PrePaymentSchedule | null;
  type?: "show" | "write";
  handleScheduleChange?: (value: PrePaymentSchedule) => void;
};

const ScheduleSection2 = ({
  prePaymentSchedule,
  type,
  handleScheduleChange,
}: Props) => {
  console.log(prePaymentSchedule);
  return (
    <section>
      <div className="flex items-center gap-2 py-4">
        <LabelBullet labelClassName="text-base font-bold">
          선결제 스케쥴 설정
        </LabelBullet>
        <TooltipHover
          triggerContent={<HelpIcon />}
          content={TOOLTIP_CONTENT["prepayment_schedule_setting"]}
        />
      </div>

      {type === "show" && (
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
      )}

      {type === "write" && (
        <Descriptions columns={1}>
          <DescriptionItem label="충전 스케쥴">
            <span>1일 1회 AM 04:00</span>
          </DescriptionItem>
          <DescriptionItem label="최초 충전 금액 설정">
            <NumberInput
              className="max-w-[500px]"
              value={prePaymentSchedule?.initialAmount}
              onChange={(e) =>
                handleScheduleChange &&
                handleScheduleChange({
                  ...(prePaymentSchedule || {}),
                  initialAmount: Number(e) || 0,
                } as PrePaymentSchedule)
              }
            />
          </DescriptionItem>
          <DescriptionItem label="일 최대 충전 한도">
            <NumberInput
              className="max-w-[500px]"
              value={prePaymentSchedule?.maxChargeLimit}
              onChange={(e) =>
                handleScheduleChange &&
                handleScheduleChange({
                  ...(prePaymentSchedule || {}),
                  maxChargeLimit: Number(e) || 0,
                } as PrePaymentSchedule)
              }
            />
          </DescriptionItem>
        </Descriptions>
      )}
    </section>
  );
};

export default ScheduleSection2;
