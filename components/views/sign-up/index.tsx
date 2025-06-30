"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/composite/input-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { ConfirmDialog } from "@/components/composite/modal-components";
import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";

import Title from "@/components/common/Title";
import LoadingUI from "@/components/common/Loading";
import { DescriptionPwd } from "@/components/common/Box";

import { ErrorComponent } from "../error";

import ModalSuccess from "./ModalSuccess";

import { userAuthTypeMap } from "@/utils/status";
import { PASSWORD_REGEX } from "@/constants/reg";

import {
  useQueryMailVerify,
  useMutationAgentsUsersPw,
} from "@/hooks/queries/user";

import type { RequestUserPwd } from "@/types/api/user";

interface SignUpViewProps {
  agentCode: string;
  userCode: string;
}

const SignUpView = ({ agentCode, userCode }: SignUpViewProps) => {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [result, setResult] = useState<boolean>(false);

  const isEnabled = !!agentCode && !!userCode;

  const {
    data: mailVerify,
    isLoading,
    error,
  } = useQueryMailVerify({ agentCode, userCode }, { enabled: isEnabled });

  const { mutate: agentsUsersPw, isPending: isAgentsUsersPwLoading } =
    useMutationAgentsUsersPw({
      onSuccess: () => setResult(true),
    });

  const onSubmit = () => {
    if (!mailVerify) return;
    if (!password || !passwordConfirm) {
      setErrorMessage("필수 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setErrorMessage(
        "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상으로 입력해주세요."
      );
      return;
    }

    // if (phone.length !== 11) {
    //   setErrorMessage("올바른 형식의 전화번호를 입력해주세요.");
    //   return;
    // }

    const phoneNumber = phone.replace(/[^0-9]/g, "");

    const params: RequestUserPwd = {
      agentId: mailVerify.user.agentId,
      userId: mailVerify.user.userId,
      password,
      phone: phoneNumber,
      type: "REGISTER",
    };
    agentsUsersPw(params);
  };

  if (isLoading) return <LoadingUI />;

  if (error) return <ErrorComponent message={error.message} />;

  if (!mailVerify?.isVerified) {
    return <ErrorComponent message="유효하지 않은 인증 링크입니다." />;
  }

  return (
    <div className="w-full max-w-[1024px] flex flex-col gap-5 mx-auto my-10 overflow-y-auto py-4">
      {result && (
        <ModalSuccess
          onClose={() => {
            router.push("/sign-in");
            setResult(false);
          }}
        />
      )}

      {errorMessage && (
        <ConfirmDialog
          open
          onConfirm={() => setErrorMessage("")}
          onClose={() => setErrorMessage("")}
          content={errorMessage}
        />
      )}

      {isAgentsUsersPwLoading && (
        <LoadingUI title="회원가입 중입니다. 잠시만 기다려주세요." />
      )}

      <Title />
      <div className="mx-auto text-center text-[#545F71] font-extrabold flex flex-col gap-2">
        <span>SM Pay를 이용해주셔서 감사합니다.</span>
        <span>비밀번호를 설정하고 회원가입을 완료해주세요.</span>
      </div>
      <div className="">
        <LabelBullet labelClassName="text-base font-bold">
          회원 정보
        </LabelBullet>
        <Descriptions bordered columns={1}>
          <DescriptionItem label="대행사명">
            {mailVerify.agent.name}
          </DescriptionItem>
          <DescriptionItem label="회원 구분">
            {userAuthTypeMap[mailVerify.user.type]}
          </DescriptionItem>
          <DescriptionItem label="성명">{mailVerify.user.name}</DescriptionItem>
          <DescriptionItem label="부서명">
            주식회사 {mailVerify.agent.name} /
          </DescriptionItem>
          <DescriptionItem label="이메일주소">
            name@{mailVerify.agent.domainName}
          </DescriptionItem>
        </Descriptions>
        <DescriptionPwd />
        <Descriptions bordered columns={1}>
          <DescriptionItem label="비밀번호 *">
            <Input
              className="max-w-[500px]"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              preventSpaces
            />
          </DescriptionItem>
          <DescriptionItem label="비밀번호 확인 *">
            <Input
              className="max-w-[500px]"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
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
      </div>

      <div className="flex justify-center gap-2">
        <Button className="w-[150px]" onClick={onSubmit}>
          확인
        </Button>
        <Button
          variant="cancel"
          className="w-[150px]"
          onClick={() => router.back()}
        >
          취소
        </Button>
      </div>

      {errorMessage && (
        <span className="text-red-500 text-center text-sm">{errorMessage}</span>
      )}
    </div>
  );
};

export default SignUpView;
