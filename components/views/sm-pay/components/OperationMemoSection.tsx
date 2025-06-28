import { Textarea } from "@/components/ui/textarea";

import { HelpIcon } from "@/components/composite/icon-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { TooltipHover } from "@/components/composite/tooltip-components";

import MemoBox from "@/components/common/MemoBox";

import { TOOLTIP_CONTENT } from "@/constants/hover";

import type { ChangeEvent } from "react";
type Props = {
  type?: "show" | "write";
  text?: string;
  handleChange?: (text: string) => void;
};

const OperationMemoSection = ({ type, text, handleChange }: Props) => {
  const handleMemoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    handleChange?.(e.target.value);
  };

  return (
    <section>
      <div className="flex items-center gap-2 py-4">
        <LabelBullet labelClassName="text-base font-bold">
          운영 검토 시 참고용 메모
        </LabelBullet>

        <TooltipHover
          triggerContent={<HelpIcon />}
          content={TOOLTIP_CONTENT["operation_reference_memo"]}
        />
      </div>

      {type === "write" && (
        <Textarea
          value={text}
          size={10}
          onChange={handleMemoChange}
          placeholder="SM Pay 운영 검토 시 참고해야 할 사항을 500자 이내로 입력해주세요."
        />
      )}

      {type === "show" && <MemoBox text={text || ""} />}
    </section>
  );
};

export default OperationMemoSection;
