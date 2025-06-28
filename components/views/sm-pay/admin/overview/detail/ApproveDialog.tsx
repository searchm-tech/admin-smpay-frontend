import LoadingUI from "@/components/common/Loading";
import { Modal } from "@/components/composite/modal-components";
import { useSmPayAdminOverviewOperatorDecision } from "@/hooks/queries/sm-pay";
import type { ParamsSmPayAdminOverviewOperatorDecision } from "@/types/api/smpay";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  params: ParamsSmPayAdminOverviewOperatorDecision & {
    advertiserId: number;
  };
};

const ApproveDialog = ({ open, onClose, onConfirm, params }: Props) => {
  const router = useRouter();
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
      params: { ...params },
    });
  };

  if (loadingOperatorDecision) {
    return <LoadingUI title="운영 검토 중..." />;
  }

  return (
    <Modal
      open={open}
      title="운영 검토 완료"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText="운영 검토 완료 처리"
    >
      <div className="w-[60vw]">
        <p className="mb-4">운영 검토를 완료하시겠습니까?</p>
        <p>
          검토 결과는 대행사 담당자와 최상위 그룹장에게 이메일로 발송됩니다.
        </p>
        <p>검토 완료 후 광고주가 인증하면 SM Pay 운영이 시작됩니다.</p>
      </div>
    </Modal>
  );
};

export default ApproveDialog;
