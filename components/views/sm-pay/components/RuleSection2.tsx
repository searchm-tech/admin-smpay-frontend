"use client";

import { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { NumberInput } from "@/components/composite/input-components";
import { TooltipHover } from "@/components/composite/tooltip-components";
import { LabelBullet } from "@/components/composite/label-bullet";

import { HelpIcon } from "@/components/composite/icon-components";

import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";

import { TOOLTIP_CONTENT } from "@/constants/hover";

import type { ChargeRule } from "@/types/smpay";

type RuleSectionProps = {
  type: "show" | "write";
  upChargeRule: ChargeRule;
  downChargeRule: ChargeRule;
  handleUpChargeRuleChange?: (value: ChargeRule) => void;
  handleDownChargeRuleChange?: (value: ChargeRule) => void;
};
const RuleSection2 = ({
  type,
  upChargeRule,
  downChargeRule,
  handleUpChargeRuleChange,
  handleDownChargeRuleChange,
}: RuleSectionProps) => {
  return (
    <section>
      <div className="flex items-center gap-2 py-4">
        <LabelBullet labelClassName="text-base font-bold">
          충전 규칙 설정
        </LabelBullet>

        <TooltipHover
          triggerContent={<HelpIcon />}
          content={TOOLTIP_CONTENT["charge_rule_setting"]}
        />
      </div>

      {type === "show" && (
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
                    : "정률로"}
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
                    : "정률로"}
                  {downChargeRule.changePercentOrValue}
                  {downChargeRule.boundType === "FIXED_AMOUNT" ? "원" : "%"} 씩
                  감액
                </span>
                합니다.
              </div>
            </div>
          </DescriptionItem>
        </Descriptions>
      )}

      {type === "write" && (
        <Descriptions columns={1}>
          <DescriptionItem label="충전 규칙 설정">
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-2">
                <span className="min-w-[100px]">기준 ROAS가</span>
                <NumberInput
                  className="w-[100px]"
                  value={upChargeRule?.standardRoasPercent}
                  onChange={(e) =>
                    handleUpChargeRuleChange &&
                    handleUpChargeRuleChange({
                      ...upChargeRule,
                      standardRoasPercent: Number(e) || 0,
                    })
                  }
                />
                %
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="min-w-[100px]">
                    <strong>이상</strong>이면 충전 금액을
                  </span>
                  <RadioGroup
                    defaultValue="percent"
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="FIXED_AMOUNT"
                        id="above-flat"
                        checked={upChargeRule?.boundType === "FIXED_AMOUNT"}
                        onClick={() =>
                          handleUpChargeRuleChange &&
                          handleUpChargeRuleChange({
                            ...upChargeRule,
                            boundType: "FIXED_AMOUNT",
                          })
                        }
                      />
                      <Label htmlFor="above-flat">정액으로</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="PERCENTAGE"
                        id="above-rate"
                        checked={upChargeRule?.boundType === "PERCENTAGE"}
                        onClick={() =>
                          handleUpChargeRuleChange &&
                          handleUpChargeRuleChange({
                            ...upChargeRule,
                            boundType: "PERCENTAGE",
                          })
                        }
                      />
                      <Label htmlFor="above-rate">정률로</Label>
                    </div>
                  </RadioGroup>
                  <NumberInput
                    className="w-[100px]"
                    value={upChargeRule?.changePercentOrValue}
                    onChange={(e) =>
                      handleUpChargeRuleChange &&
                      handleUpChargeRuleChange({
                        ...upChargeRule,
                        changePercentOrValue: Number(e) || 0,
                      })
                    }
                  />
                  <span>
                    {upChargeRule?.boundType === "FIXED_AMOUNT" ? "원" : "%"} 씩
                  </span>
                  <span className="text-blue-600">증액하고</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="min-w-[100px]">
                    <strong>미만</strong>이면 충전 금액을
                  </span>
                  <RadioGroup
                    defaultValue="flat"
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="flat"
                        id="below-flat"
                        checked={downChargeRule?.boundType === "FIXED_AMOUNT"}
                        onClick={() =>
                          handleDownChargeRuleChange &&
                          handleDownChargeRuleChange({
                            ...downChargeRule,
                            boundType: "FIXED_AMOUNT",
                          })
                        }
                      />
                      <Label htmlFor="below-flat">정액으로</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <RadioGroupItem
                        value="rate"
                        id="below-rate"
                        checked={downChargeRule?.boundType === "PERCENTAGE"}
                        onClick={() =>
                          handleDownChargeRuleChange &&
                          handleDownChargeRuleChange({
                            ...downChargeRule,
                            boundType: "PERCENTAGE",
                          })
                        }
                      />
                      <Label htmlFor="below-rate">정률로</Label>
                    </div>
                  </RadioGroup>
                  <NumberInput
                    className="w-[100px]"
                    value={downChargeRule.changePercentOrValue}
                    onChange={(e) =>
                      handleDownChargeRuleChange &&
                      handleDownChargeRuleChange({
                        ...downChargeRule,
                        changePercentOrValue: Number(e) || 0,
                      })
                    }
                  />
                  <span>
                    {downChargeRule?.boundType === "FIXED_AMOUNT" ? "원" : "%"}{" "}
                    씩
                  </span>
                  <span className="text-red-600">감액합니다.</span>
                </div>
              </div>
            </div>
          </DescriptionItem>

          <DescriptionItem label="설정 결과">
            <div className="text-sm flex flex-col gap-2 py-4">
              <p>
                기준 ROAS가{" "}
                <span className="font-bold">
                  {upChargeRule.standardRoasPercent}% 이상
                </span>
                이면 충전 금액을{" "}
                <span className="text-blue-600 font-bold">
                  {upChargeRule.boundType === "FIXED_AMOUNT"
                    ? "정액으로"
                    : "정률로"}
                  {upChargeRule.changePercentOrValue}%씩 증액
                </span>
                하고
              </p>
              <p>
                기준 ROAS가{" "}
                <span className="font-bold">
                  {upChargeRule.standardRoasPercent}% 미만
                </span>
                이면 충전 금액을{" "}
                <span className="text-red-600 font-bold">
                  {" "}
                  {downChargeRule.boundType === "FIXED_AMOUNT"
                    ? "정액으로"
                    : "정률로"}{" "}
                  {downChargeRule.changePercentOrValue}%씩 감액
                </span>
                합니다.
              </p>
            </div>
          </DescriptionItem>
        </Descriptions>
      )}
    </section>
  );
};

export default RuleSection2;
