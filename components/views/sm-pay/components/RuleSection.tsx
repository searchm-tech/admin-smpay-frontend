"use client";

import { TooltipHover } from "@/components/composite/tooltip-components";
import { LabelBullet } from "@/components/composite/label-bullet";

import { HelpIcon } from "@/components/composite/icon-components";

import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";

import { TOOLTIP_CONTENT } from "@/constants/hover";

import type { ChargeRule } from "@/types/smpay";

type ShowProps = {
  upChargeRule: ChargeRule;
  downChargeRule: ChargeRule;
};
export const RuleSectionShow = ({
  upChargeRule,
  downChargeRule,
}: ShowProps) => {
  return (
    <section>
      <Header />

      <Descriptions columns={1}>
        <DescriptionItem label="충전 규칙 설정">
          <div className="text-sm flex flex-col gap-2 py-4">
            <div>
              기준 ROAS가{" "}
              <span className="font-bold">
                {upChargeRule?.standardRoasPercent}% 이상
              </span>
              이면 충전 금액을{" "}
              <span className="text-blue-600">
                {upChargeRule?.boundType === "FIXED_AMOUNT"
                  ? "정액으로"
                  : "정률로"}{" "}
                {upChargeRule?.changePercentOrValue}
                {upChargeRule?.boundType === "FIXED_AMOUNT" ? "원" : "%"} 씩
                증액
              </span>
              하고
            </div>
            <div>
              기준 ROAS가{" "}
              <span className="font-bold">
                {downChargeRule.standardRoasPercent}% 미만
              </span>
              이면 충전 금액을{" "}
              <span className="text-red-600">
                {downChargeRule.boundType === "FIXED_AMOUNT"
                  ? "정액으로"
                  : "정률로"}{" "}
                {downChargeRule.changePercentOrValue}
                {downChargeRule.boundType === "FIXED_AMOUNT" ? "원" : "%"} 씩
                감액
              </span>
              합니다.
            </div>
          </div>
        </DescriptionItem>
      </Descriptions>
    </section>
  );
};

const Header = () => {
  return (
    <div className="flex items-center gap-2 py-4">
      <LabelBullet labelClassName="text-base font-bold">
        충전 규칙 설정
      </LabelBullet>

      <TooltipHover
        triggerContent={<HelpIcon />}
        content={TOOLTIP_CONTENT["charge_rule_setting"]}
      />
    </div>
  );
};
