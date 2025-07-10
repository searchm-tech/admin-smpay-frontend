import { DescriptionItem } from "@/components/composite/description-components";
import { Descriptions } from "@/components/composite/description-components";
import { Modal } from "@/components/composite/modal-components";
import { formatDate } from "@/utils/format";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  description?: string;
  date?: string;
};

const RejectOperationModal = ({
  open,
  onClose,
  onConfirm,
  description,
  date,
}: Props) => {
  return (
    <Modal
      open={open}
      title="심사 반려"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="확인"
      cancelText="닫기"
    >
      <div className="w-[60vw]">
        <p>다음과 같은 사유로 SM Pay 운영 검토가 거절되었습니다.</p>
        <div className="mt-4 rounded-md bg-white">
          <Descriptions columns={1}>
            <DescriptionItem label="운영 검토 거절 일시">
              {formatDate(date || "")}
            </DescriptionItem>
            {/* <DescriptionItem label="심사자">최상위 그룹장명</DescriptionItem> */}
            <DescriptionItem label="거절 사유">
              <div>{description}</div>
            </DescriptionItem>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export default RejectOperationModal;
