import { useRouter } from "next/navigation";
import { type ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  InputWithSuffix,
  PhoneInput,
} from "@/components/composite/input-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import {
  DescriptionItem,
  Descriptions,
} from "@/components/composite/description-components";
import Select from "@/components/composite/select-components";
import { ConfirmDialog } from "@/components/composite/modal-components";

import LoadingUI from "@/components/common/Loading";
import { DescriptionPwd } from "@/components/common/Box";

import { useQueryAgencyAll } from "@/hooks/queries/agency";
import { useMutationAgencyGroupMaster } from "@/hooks/queries/user";
import { getUsersNameCheckApi } from "@/services/user";

import { EMAIL_REGEX, PASSWORD_REGEX } from "@/constants/reg";

import { DialogContent, type DialogContentType } from "./constant";

import type { TAgency } from "@/types/agency";
import type { RequestAgencyGroupMasterDirect } from "@/types/api/user";

const DirectRegistSection = () => {
  const router = useRouter();

  const { data: agencyAllDto = [] } = useQueryAgencyAll();
  const {
    mutate: mutateAddGroupMasterDirect,
    isPending: isPendingAddGroupMasterDirect,
  } = useMutationAgencyGroupMaster({
    onSuccess: () => resetSuccess(),
    onError: (error) => setFailDialog(error.message),
  });

  const [selectedAgency, setSelectedAgency] = useState<TAgency | null>(null);
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [failDialog, setFailDialog] = useState("");
  const [dialog, setDialog] = useState<DialogContentType | null>(null);
  const [enableEmailId, setEnableEmailId] = useState(false);
  const [checkNameLoading, setCheckNameLoading] = useState(false);
  const [nameCheckResult, setNameCheckResult] = useState<
    "duplicate" | "available" | ""
  >("");

  const resetSuccess = () => {
    setDialog("success-direct");
    setSelectedAgency(null);
    setEmailId("");
    setName("");
    setPhone("");
    setPassword("");
    setPasswordConfirm("");
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
      setCheckNameLoading(true);
      const response = await getUsersNameCheckApi(
        `${emailId}@${selectedAgency?.domainName}`
      );
      setNameCheckResult(response ? "duplicate" : "available");
    } catch (error) {
    } finally {
      setCheckNameLoading(false);
    }
  };

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement>,
    target: "password" | "passwordConfirm"
  ) => {
    if (target === "password") {
      setPassword(e.target.value);
    } else {
      setPasswordConfirm(e.target.value);
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

    if (!password || !passwordConfirm) {
      setDialog("password-empty");
      return;
    }

    if (!enableEmailId) {
      setDialog("nameCheck");
      return;
    }

    if (
      !PASSWORD_REGEX.test(password) ||
      !PASSWORD_REGEX.test(passwordConfirm)
    ) {
      setDialog("password-regex");
      return;
    }

    if (password !== passwordConfirm) {
      setDialog("password-confirm");
      return;
    }

    if (phone && phone.length !== 11) {
      setDialog("phone-regex");
      return;
    }

    if (!selectedAgency) {
      setDialog("agency-select");
      return;
    }

    // 시스템 관리자 일 경우, 최상위 그룹장 직접 등록
    const data: RequestAgencyGroupMasterDirect = {
      userType: "AGENCY_GROUP_MASTER",
      agentId: Number(selectedAgency.agentId),
      name,
      emailAddress: `${emailId}@${selectedAgency.domainName}`,
      password,
      phoneNumber: phone,
    };
    mutateAddGroupMasterDirect(data);
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
      {(isPendingAddGroupMasterDirect || checkNameLoading) && <LoadingUI />}

      {dialog && (
        <ConfirmDialog
          open
          onClose={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
          title={dialog === "success-direct" ? "전송 완료" : "오류"} // TODO : 노출 되는지 확인 필요
          content={DialogContent[dialog]}
        />
      )}

      {nameCheckResult === "duplicate" && (
        <ConfirmDialog
          open
          onClose={() => {
            setNameCheckResult("");
            setEnableEmailId(false);
          }}
          onConfirm={() => {
            setNameCheckResult("");
            setEnableEmailId(false);
          }}
          title="중복 체크" // TODO : 노출 되는지 확인 필요
          content="이미 존재하는 이메일 주소입니다."
        />
      )}

      {nameCheckResult === "available" && (
        <ConfirmDialog
          open
          onClose={() => {
            setNameCheckResult("");
            setEnableEmailId(true);
          }}
          onConfirm={() => {
            setNameCheckResult("");
            setEnableEmailId(true);
          }}
          title="중복 체크" // TODO : 노출 되는지 확인 필요
          content="사용 가능한 이메일 주소입니다."
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
        <DescriptionItem label="이메일 주소 *">
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
            <Button variant="outline" onClick={handleEmailCheck}>
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

      <DescriptionPwd />

      <Descriptions columns={1}>
        <DescriptionItem label="비밀번호 *">
          <Input
            type="password"
            className="max-w-[500px]"
            value={password}
            onChange={(e) => handlePasswordChange(e, "password")}
            placeholder="영문, 숫자, 특수문자가 모두 들어간 8-16자"
            preventSpaces
          />
        </DescriptionItem>
        <DescriptionItem label="비밀번호 확인 *">
          <Input
            type="password"
            className="max-w-[500px]"
            value={passwordConfirm}
            onChange={(e) => handlePasswordChange(e, "passwordConfirm")}
            placeholder="영문, 숫자, 특수문자가 모두 들어간 8-16자"
            preventSpaces
          />
        </DescriptionItem>
        <DescriptionItem label="연락처">
          <PhoneInput
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </DescriptionItem>
      </Descriptions>

      <div className="w-full flex justify-center gap-6 py-6">
        <Button className="w-[150px]" onClick={handleSubmit}>
          확인
        </Button>
        <Button
          variant="cancel"
          className="w-[150px]"
          onClick={() => router.push("/account/member-management")}
        >
          뒤로가기
        </Button>
      </div>
    </section>
  );
};

export default DirectRegistSection;
