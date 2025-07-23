import { useRouter } from "next/navigation";
import { type ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DescriptionItem,
  Descriptions,
} from "@/components/composite/description-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { ConfirmDialog } from "@/components/composite/modal-components";
import Select from "@/components/composite/select-components";
import { InputWithSuffix } from "@/components/composite/input-components";

import LoadingUI from "@/components/common/Loading";
import { DescriptionPwd } from "@/components/common/Box";

import {
  useMutationAgencySendMail,
  useQueryAgencyAll,
} from "@/hooks/queries/agency";

import { getUsersNameCheckApi } from "@/services/user";

import { EMAIL_REGEX } from "@/constants/reg";
import {
  DialogContent,
  DialogContentEmail,
  DialogContentTypeEmail,
  type DialogContentType,
} from "./constant";

import type { TAgency } from "@/types/agency";
import type { RequestGroupMasterInvite } from "@/types/api/user";

const MailSendSection = () => {
  const router = useRouter();

  const { data: agencyAllDto = [] } = useQueryAgencyAll();

  const { mutate: mutateGroupMasterSendMail, isPending: loadingGrpSendMail } =
    useMutationAgencySendMail({
      onSuccess: () => resetSuccess(),
      onError: (error) => setFailDialog(error.message),
    });

  const [selectedAgency, setSelectedAgency] = useState<TAgency | null>(null);
  const [emailId, setEmailId] = useState("");
  const [name, setName] = useState("");
  const [enableEmailId, setEnableEmailId] = useState(false);

  const [dialog, setDialog] = useState<DialogContentType | null>(null);
  const [failDialog, setFailDialog] = useState("");
  const [dialogEmail, setDialogEmail] = useState<DialogContentTypeEmail | null>(
    null
  );
  const [checkNameLoading, setCheckNameLoading] = useState(false);

  const resetSuccess = () => {
    setDialog("success");

    setSelectedAgency(null);
    setEmailId("");
    setName("");
    setEnableEmailId(false);
  };

  const handleEmailIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailId(e.target.value);
  };

  const handleEmailCheck = async () => {
    if (checkNameLoading) return;

    if (!emailId) {
      setDialog("check-email-empty");
      return;
    }

    if (!selectedAgency) {
      setDialog("agency-select");
      return;
    }

    if (!EMAIL_REGEX.test(`${emailId}@${selectedAgency?.domainName}`)) {
      setDialog("check-email-regex");
      return;
    }

    try {
      const emailAddress = `${emailId}@${selectedAgency?.domainName}`;

      setCheckNameLoading(true);
      const response = await getUsersNameCheckApi(emailAddress);

      // response가 true면 중복, false면 사용 가능
      if (!response) {
        setEnableEmailId(true);
        setDialogEmail("available-email");
      } else {
        setEnableEmailId(false);
        setDialogEmail("duplicate-email");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCheckNameLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!emailId) {
      setDialog("check-email-empty");
      return;
    }

    if (!name) {
      setDialog("name-empty");
      return;
    }

    if (!enableEmailId) {
      setDialog("nameCheck");
      return;
    }

    /**
     * 시스템 관리자
     * - 대행사 선택 필수
     * - 대행사 최상위 그룹장 회원 초대 메일 발송
     */
    if (!selectedAgency) {
      setDialog("agency-select");
      return;
    }

    const params: RequestGroupMasterInvite = {
      userType: "AGENCY_GROUP_MASTER", // user.type,
      agentId: Number(selectedAgency.agentId),
      name,
      emailAddress: `${emailId}@${selectedAgency.domainName}`,
    };

    mutateGroupMasterSendMail(params);
  };

  const handleAgencySelect = (value: string) => {
    const findAgency = agencyAllDto.find(
      (agentDto) => agentDto.agent.agentId.toString() === value
    );

    if (findAgency) {
      setSelectedAgency(findAgency.agent);
    }
  };

  return (
    <section className="py-4">
      {(loadingGrpSendMail || checkNameLoading) && <LoadingUI />}

      {dialog && (
        <ConfirmDialog
          open
          onClose={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
          title={dialog === "success" ? "전송 완료" : "오류"} // TODO : 노출 되는지 확인 필요
          content={DialogContent[dialog]}
        />
      )}
      {dialogEmail && (
        <ConfirmDialog
          open
          onClose={() => setDialogEmail(null)}
          onConfirm={() => setDialogEmail(null)}
          title="중복 체크" // TODO : 노출 되는지 확인 필요
          content={DialogContentEmail[dialogEmail]}
        />
      )}

      {failDialog && (
        <ConfirmDialog
          open
          onClose={() => setFailDialog("")}
          onConfirm={() => setFailDialog("")}
          title="오류" // TODO : 노출 되는지 확인 필요
          content={failDialog}
        />
      )}

      <LabelBullet className="mb-4" labelClassName="text-base font-bold">
        회원 정보
      </LabelBullet>
      <Descriptions columns={1} bordered>
        <DescriptionItem label="대행사 선택 *">
          <Select
            className="max-w-[500px]"
            value={selectedAgency?.agentId.toString()}
            onChange={handleAgencySelect}
            options={agencyAllDto.map((agentDto) => ({
              label: `${agentDto.agent.name} | ${agentDto.agent.representativeName}`,
              value: agentDto.agent.agentId.toString(),
              disabled: agentDto.isMasterAccount,
            }))}
          />
        </DescriptionItem>
        <DescriptionItem label="회원 구분 *">최상위 그룹장</DescriptionItem>
        <DescriptionItem label="성명 *">
          <Input
            className="max-w-[500px]"
            placeholder="성명을 입력해주세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DescriptionItem>

        <DescriptionItem label="발송될 이메일 주소 *">
          <div className="flex items-center gap-2">
            <InputWithSuffix
              className="max-w-[500px]"
              placeholder={
                selectedAgency
                  ? "이메일 주소를 입력해주세요."
                  : "대행사를 선택해주세요."
              }
              value={emailId}
              onChange={handleEmailIdChange}
              disabled={!selectedAgency || enableEmailId}
              suffix={selectedAgency ? `@${selectedAgency.domainName}` : ""}
              preventSpaces
            />

            <Button
              variant="outline"
              onClick={handleEmailCheck}
              disabled={enableEmailId}
            >
              {enableEmailId ? "중복 체크 완료" : "중복 체크"}
            </Button>

            {enableEmailId && (
              <Button
                onClick={() => {
                  setEmailId("");
                  setEnableEmailId(false);
                }}
              >
                초기화
              </Button>
            )}
          </div>
        </DescriptionItem>
      </Descriptions>

      <div className="bg-[rgba(0,0,0,0.02)] h-[70px] flex items-center px-4 mt-2">
        <DescriptionPwd />
      </div>

      <div className="w-full flex justify-center gap-6 py-6">
        <Button className="w-[150px]" onClick={handleSubmit}>
          확인
        </Button>
        <Button
          variant="cancel"
          className="w-[150px]"
          onClick={() => router.push("/account")}
        >
          뒤로가기
        </Button>
      </div>
    </section>
  );
};

export default MailSendSection;
