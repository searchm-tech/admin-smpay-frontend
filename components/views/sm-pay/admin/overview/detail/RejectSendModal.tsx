import { useRouter } from "next/navigation";
import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import LoadingUI from "@/components/common/Loading";
import { Modal } from "@/components/composite/modal-components";
import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";
import { useSmPayAdminOverviewOperatorDecision } from "@/hooks/queries/sm-pay";

import type { ParamsSmPayAdminOverviewOperatorDecision } from "@/types/api/smpay";

type RejectSendModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  params: ParamsSmPayAdminOverviewOperatorDecision & {
    advertiserId: number;
  };
};

const RejectSendModal = ({
  open,
  onClose,
  onConfirm,
  params,
}: RejectSendModalProps) => {
  const router = useRouter();
  const [rejectReason, setRejectReason] = useState("");

  const { mutate: postOperatorDecision, isPending: loadingOperatorDecision } =
    useSmPayAdminOverviewOperatorDecision({
      onSuccess: () => router.push(`/sm-pay/admin/overview`),
      onError: (error) => {
        console.error(error);
      },
    });

  const handleConfirm = () => {
    postOperatorDecision({
      advertiserId: Number(params.advertiserId),
      params: { ...params, rejectStatusMemo: rejectReason },
    });
  };

  if (loadingOperatorDecision) {
    return <LoadingUI title="운영 검토 중..." />;
  }

  return (
    <Modal
      open={open}
      title="운영 검토 거절"
      onClose={onClose}
      onConfirm={handleConfirm}
    >
      <div className="w-[80vw]">
        <div>
          <p className="mb-4">운영 검토를 거절하시겠습니까?</p>
          <p>거절 사유를 입력해주세요.</p>
          <p>
            입력하신 내용은 최상위 그룹장과 담당자가 확인 할 수 있으며, 재신청
            시 참고 자료로 활용됩니다.
          </p>
        </div>
        <Descriptions className="mt-4" columns={1}>
          <DescriptionItem label="거절 사유 입력">
            <Textarea
              rows={8}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </DescriptionItem>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default RejectSendModal;
