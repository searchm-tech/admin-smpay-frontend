"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";

import { GuideBox } from "@/components/common/Box";
import { IconBadge } from "@/components/composite/icon-components";
import { GuideButton } from "@/components/composite/button-components";

import RejectOperationModal from "./RejectOperationModal";

import { useGuideModalStore } from "@/store/useGuideModalStore";
import { RejectDialog } from "../dialog";

export type ViewType = "master-judgement" | "smpay-guide";

type GuidSectionProps = {
  viewType: ViewType;
  className?: string;
  onClick?: () => void;
};

const GuidSection = ({ viewType, className, onClick }: GuidSectionProps) => {
  const { setIsOpen } = useGuideModalStore();

  const GUID_CONTENT: Record<ViewType, React.ReactNode> = {
    "master-judgement": (
      <section className="w-full flex items-center text-[13px]">
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <IconBadge name="CircleAlert" bgColor="#1062FF" />
            <span>SM Pay 신청 도움말</span>
          </div>

          <div className="pl-6 text-[#363C45] space-y-1.5 flex flex-col">
            <span>
              • 광고주의 최근 성과와 판단 지표를 참고해 충전 규칙과 스케쥴을
              설정해 주세요.
            </span>
            <span>
              • [광고 성과 예측 시뮬레이션] 기능을 통해 설정된 규칙이 적용될
              경우의 성과를 예측할 수 있으며, 선결제되는 광고비의 회수 가능성도
              함께 고려해 심사해 주세요.
            </span>
          </div>
        </div>

        <GuideButton onClick={() => setIsOpen(true)}>
          SM Pay 이용 가이드
        </GuideButton>
      </section>
    ),

    "smpay-guide": (
      <div className="w-full flex items-start gap-2 text-[13px]">
        <IconBadge name="CircleAlert" bgColor="#1062FF" size="sm" />

        <div className="w-full flex items-center justify-between">
          <div className="text-[#363C45] flex flex-col gap-1">
            <span>SM Pay 신청 및 운영 절차를 안내해드려요.</span>
            <span>
              각 단계별로 필요한 작업과 담당자가 구분되어 있으니 참고해주세요.
            </span>

            <div className="flex gap-2 mt-2">
              <GuideCard title="서비스 신청" description="(대행사 담당자)" />
              <GuideCard title="심사" description="(최상위 그룹장)" />
              <GuideCard title="운영 검토" description="(SM Pay)" />
              <GuideCard title="광고주 동의" description="(광고주)" />
              <GuideCard title="운영" description="" />
            </div>
          </div>

          <GuideButton onClick={() => setIsOpen(true)}>
            SM Pay 이용 가이드
          </GuideButton>
        </div>
      </div>
    ),
  };

  return <GuideBox className={className}>{GUID_CONTENT[viewType]}</GuideBox>;
};

export default GuidSection;

type GuideCardProps = {
  title: string;
  description: string;
};

const GuideCard = ({ title, description }: GuideCardProps) => {
  return (
    <div className="border border-[#CDCDCD] rounded-[15px] p-2 min-h-11 w-[120px] bg-white text-center">
      <p className="font-bold mb-1 ">{title}</p>
      <p className="text-[#007AFF] text-[11px] font-normal">{description}</p>
    </div>
  );
};

export const RejectDescription = ({
  description,
  date,
}: {
  description: string;
  date: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GuideBox className="bg-[#FFD6D6]">
      {isOpen && (
        <RejectDialog
          description={description}
          date={date}
          onClose={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
        />
      )}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TriangleAlert color="#FF0000" size={18} />
          <span className="text-[#FF0000]">
            광고주의 심사가 반려되었습니다. 반려 사유를 확인하세요.
          </span>
        </div>

        <GuideButton color="#F57272" onClick={() => setIsOpen(true)}>
          심사 반려 사유 확인
        </GuideButton>
      </div>
    </GuideBox>
  );
};

export const RejectOperationDescription = ({
  description,
  date,
}: {
  description: string;
  date: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GuideBox className="bg-[#FFD6D6]">
      <div className="w-full flex items-center justify-between">
        {isOpen && (
          <RejectOperationModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={() => setIsOpen(false)}
            description={description}
            date={date}
          />
        )}
        <div className="flex items-center gap-2">
          <TriangleAlert color="#FF0000" size={18} />
          <span className="text-[#FF0000]">
            SM Pay 운영 검토가 거절되었습니다. 거절 사유를 확인하세요.
          </span>
        </div>

        <GuideButton color="#F57272" onClick={() => setIsOpen(true)}>
          거절 사유 확인
        </GuideButton>
      </div>
    </GuideBox>
  );
};
