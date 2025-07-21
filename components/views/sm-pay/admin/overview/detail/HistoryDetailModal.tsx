"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/composite/modal-components";
import LoadingUI from "@/components/common/Loading";

import StatIndicatorSection from "../../../components/StatIndicatorSection";
import { RuleSectionShow } from "../../../components/RuleSection";
import { ScheduleSectionShow } from "../../../components/ScheduleSection";
import JudgementMemoSection from "../../../components/JudgementMemoSection";
import OperationMemoSection from "../../../components/OperationMemoSection";

import { RejectDialog } from "../../../manangement/dialog";

import { useSmPayAdminOverviewApplyFormDetail } from "@/hooks/queries/sm-pay";
import { useSearchParams } from "next/navigation";
import {
  AdvertiserDescriptionDto,
  AdvertiserDetailDto,
} from "@/types/dto/smpay";
import { LabelBullet } from "@/components/composite/label-bullet";
import {
  DescriptionItem,
  Descriptions,
} from "@/components/composite/description-components";
import { Label } from "@/components/ui/label";
import { SmPayAdvertiserStatusLabel } from "@/constants/status";
import { useQueryAgencyDetail } from "@/hooks/queries/agency";
import { formatBusinessNumber, formatPhoneNumber } from "@/utils/format";
import { ChargeRule } from "@/types/smpay";
import { useQueryAdminUserInfo } from "@/hooks/queries/user";

type Props = {
  onClose: () => void;
  advertiserId: number;
  formId: number;
};

const HistoryDetailModal = ({ onClose, advertiserId, formId }: Props) => {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const userId = searchParams.get("userId");

  const [isReject, setIsReject] = useState(false);
  const [upChargeRule, setUpChargeRule] = useState<ChargeRule>({
    standardRoasPercent: 0,
    rangeType: "UP",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
  });
  const [downChargeRule, setDownChargeRule] = useState<ChargeRule>({
    standardRoasPercent: 0,
    rangeType: "DOWN",
    boundType: "FIXED_AMOUNT",
    changePercentOrValue: 0,
  });

  const { data: userInfo } = useQueryAdminUserInfo({
    userId: Number(userId),
  });

  const { data: formInfo, isPending: loading } =
    useSmPayAdminOverviewApplyFormDetail(
      Number(advertiserId),
      Number(formId),
      Number(agentId),
      Number(userId)
    );

  const { data: agencyData } = useQueryAgencyDetail(Number(agentId) || 0);

  const prePaymentSchedule = {
    initialAmount: formInfo?.initialAmount || 0,
    maxChargeLimit: formInfo?.maxChargeLimit || 0,
    minChargeLimit: formInfo?.minChargeLimit || 0,
  };

  const statIndicator = {
    operationPeriod: formInfo?.advertiserOperationPeriod || 0,
    dailyAverageRoas: formInfo?.advertiserDailyAverageRoas || 0,
    monthlyConvAmt: formInfo?.advertiserMonthlyConvAmt || 0,
    dailySalesAmt: formInfo?.advertiserDailySalesAmt || 0,
    recommendRoas: formInfo?.advertiserRecommendRoasPercent || 0,
  };

  const advertiserData: AdvertiserDetailDto = {
    advertiserId: formInfo?.advertiserId || 0,
    userId: Number(userId),
    customerId: formInfo?.advertiserCustomerId || 0,
    agentId: Number(agentId),
    id: formInfo?.advertiserId.toString() || "",
    nickName: formInfo?.advertiserNickname || "",
    name: formInfo?.advertiserName || "",
    representativeName: formInfo?.advertiserRepresentativeName || "",
    businessRegistrationNumber: "",
    phoneNumber: formInfo?.advertiserPhoneNumber || "",
    emailAddress: formInfo?.advertiserEmailAddress || "",
    status: formInfo?.advertiserStatus || "UNSYNC_ADVERTISER",
    roleId: 0,
    isLossPrivileges: false,
    advertiserFormId: formInfo?.advertiserFormId || 0,
    description: {
      description: "",
      descriptionType: "REJECT",
    } as unknown as AdvertiserDescriptionDto,
  };

  useEffect(() => {
    if (formInfo) {
      const upChargeRuleData = formInfo.chargeRules.find(
        (rule) => rule.rangeType === "UP"
      );
      const downChargeRuleData = formInfo.chargeRules.find(
        (rule) => rule.rangeType === "DOWN"
      );

      if (upChargeRuleData) {
        setUpChargeRule({
          standardRoasPercent: formInfo?.advertiserStandardRoasPercent || 0,
          rangeType: upChargeRuleData.rangeType,
          boundType: upChargeRuleData.boundType,
          changePercentOrValue: upChargeRuleData.changePercentOrValue,
        });
      }
      if (downChargeRuleData) {
        setDownChargeRule({
          standardRoasPercent: formInfo?.advertiserStandardRoasPercent || 0,
          rangeType: downChargeRuleData.rangeType,
          boundType: downChargeRuleData.boundType,
          changePercentOrValue: downChargeRuleData.changePercentOrValue,
        });
      }
    }
  }, [formInfo]);

  return (
    <Modal
      open
      onClose={onClose}
      onConfirm={onClose}
      title="SM Pay 지난 이력 상세"
      cancelDisabled
      confirmText="뒤로"
    >
      <div className="w-[85vw] h-[80vh] overflow-y-auto">
        {loading && <LoadingUI title="SM Pay 정보 조회 중..." />}

        {isReject && (
          <RejectDialog
            description={formInfo?.advertiserRejectDescription || ""}
            date={formInfo?.updateDt || ""}
            onClose={() => setIsReject(false)}
            onConfirm={() => setIsReject(false)}
          />
        )}

        <div>
          <section>
            <div className="flex items-center gap-4 py-4">
              <LabelBullet labelClassName="text-base font-bold">
                광고주 상태
              </LabelBullet>
            </div>

            <Descriptions columns={1}>
              <DescriptionItem label="광고주 상태">
                <Label>
                  {advertiserData &&
                    SmPayAdvertiserStatusLabel[advertiserData.status]}
                </Label>
              </DescriptionItem>
            </Descriptions>
          </section>

          <section className="w-full flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 py-4">
                <LabelBullet labelClassName="text-base font-bold">
                  대행사 및 대행사 담당자 기본 정보
                </LabelBullet>
              </div>
              <Descriptions columns={1}>
                <DescriptionItem label="대행사명">
                  <Label>{agencyData?.agent.name}</Label>
                </DescriptionItem>
                <DescriptionItem label="대표자 명">
                  <Label>{agencyData?.agent.representativeName}</Label>
                </DescriptionItem>
                <DescriptionItem label="담당자 명">
                  <Label>{userInfo?.name}</Label>
                </DescriptionItem>
                <DescriptionItem label="담당자 이메일 주소">
                  <Label>{userInfo?.id}</Label>
                </DescriptionItem>
                <DescriptionItem label="담당자 연락처">
                  <Label>
                    {formatPhoneNumber(userInfo?.phoneNumber || "")}
                  </Label>
                </DescriptionItem>
              </Descriptions>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-4 py-4">
                <LabelBullet labelClassName="text-base font-bold">
                  광고주 기본 정보
                </LabelBullet>
              </div>
              <Descriptions columns={1}>
                <DescriptionItem label="광고주명">
                  <Label>{advertiserData?.name}</Label>
                </DescriptionItem>
                <DescriptionItem label="대표자명">
                  <Label>{advertiserData?.representativeName}</Label>
                </DescriptionItem>
                <DescriptionItem label="사업자 등록번호">
                  <Label>
                    {formatBusinessNumber(
                      advertiserData?.businessRegistrationNumber || ""
                    )}
                  </Label>
                </DescriptionItem>
                <DescriptionItem label="광고주 휴대폰 번호">
                  <Label>
                    {formatPhoneNumber(advertiserData?.phoneNumber || "")}
                  </Label>
                </DescriptionItem>
                <DescriptionItem label="광고주 이메일 주소">
                  <Label>{advertiserData?.emailAddress}</Label>
                </DescriptionItem>
              </Descriptions>
            </div>
          </section>
        </div>

        <StatIndicatorSection
          advertiserId={advertiserId}
          statIndicator={statIndicator}
        />

        <RuleSectionShow
          upChargeRule={upChargeRule}
          downChargeRule={downChargeRule}
        />
        <ScheduleSectionShow prePaymentSchedule={prePaymentSchedule} />
        <JudgementMemoSection type="show" text={formInfo?.reviewerMemo || ""} />
        <OperationMemoSection type="show" text={formInfo?.approvalMemo || ""} />
      </div>
    </Modal>
  );
};

export default HistoryDetailModal;
