import { HelpIcon } from "@/components/composite/icon-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { TooltipHover } from "@/components/composite/tooltip-components";

import MemoBox from "@/components/common/MemoBox";

import { TOOLTIP_CONTENT } from "@/constants/hover";

type Props = {
  text?: string;
};

const OperationMemoSection = ({ text }: Props) => {
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

      <MemoBox text={text || ""} />
    </section>
  );
};

export default OperationMemoSection;
