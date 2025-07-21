import { DescriptionItem } from "@/components/composite/description-components";
import { Descriptions } from "@/components/composite/description-components";
import { Modal } from "@/components/composite/modal-components";
import { formatDate } from "@/utils/format";

// TODO : 삭제
type Props = {
  onClose: () => void;
  onConfirm: () => void;
  description?: string;
  date?: string;
};

const RejectModal = ({ onClose, onConfirm, description, date }: Props) => {
  return (
    <Modal
      open
      title="심사 반려"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="상세 보기"
      cancelText="닫기"
    >
      <div className="w-[60vw]">
        <p>다음과 같은 사유로 일시중지되었습니다.</p>
        <div className="mt-4 rounded-md bg-white">
          <Descriptions columns={1}>
            <DescriptionItem label="심사 반려 일시">
              {formatDate(date || "")}
            </DescriptionItem>
            <DescriptionItem label="반려 사유">
              <div>{description}</div>
            </DescriptionItem>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export default RejectModal;
