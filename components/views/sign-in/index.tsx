"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/composite/input-components";
import CheckboxLabel from "@/components/composite/checkbox-label";

import Title from "@/components/common/Title";
import LoadingUI from "@/components/common/Loading";

import ModalPwdSetting from "./ModalPwdSetting";

import { useSessionStore } from "@/store/useSessionStore";
import { signInApi } from "@/services/auth";
import { getAgencyDomainNameApi } from "@/services/agency";
import { useWindowSize } from "@/hooks/useWindowSize";

import { ApiError } from "@/lib/api";
import { getRedirectPath } from "@/lib/utils";

import { STORAGE_KEYS, createFormSchema, defaultValues } from "./constants";

import type { TSMPayUser } from "@/types/user";

interface SignInViewProps {
  code?: string;
}

const SignInView = ({ code }: SignInViewProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setAccessToken, setRefreshToken } = useSessionStore();
  const { device } = useWindowSize();

  const [loading, setLoading] = useState(false);
  const [pwdModal, setPwdModal] = useState(false);

  const [isRememberUsername, setIsRememberUsername] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const [errMessage, setErrMessage] = useState("");
  const [domainName, setDomainName] = useState("");

  const formSchema = createFormSchema(!!domainName);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  // 토큰 유효성 검사 및 리다이렉트
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      // 세션 로딩 중이면 대기
      if (status === "loading") {
        return;
      }

      try {
        setLoading(true);
        // localStorage에서도 토큰 확인
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedAccessToken && storedRefreshToken) {
          const redirectPath = getRedirectPath(session?.user?.type);
          router.replace(redirectPath);
          return;
        }
      } catch (error) {
        console.error("Token validation error:", error);
        // 에러 발생 시 토큰 클리어
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        await signOut();
      } finally {
        setIsCheckingToken(false);
        setLoading(false);
      }
    };

    checkTokenAndRedirect();
  }, [status, router, session]);

  const handleRememberChange = (checked: boolean) => {
    setIsRememberUsername(checked);
    localStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, checked.toString());

    if (!checked) {
      localStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL);
    }
  };

  async function onSubmit(values: FormValues) {
    if (loading) return;

    try {
      setLoading(true);
      const email = !!domainName
        ? `${values.email}@${domainName}`
        : values.email;

      if (isRememberUsername) {
        localStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, values.email);
      }

      const response = await signInApi({
        id: email,
        password: values.password,
      });

      if (response?.userWithToken) {
        const {
          user: userData,
          accessToken,
          refreshToken,
        } = response.userWithToken;
        const { uniqueCode } = response.agent;

        const user: TSMPayUser & { uniqueCode: string } = {
          id: userData.userId,
          userId: userData.userId,
          agentId: userData.agentId,
          status: userData.status,
          type: userData.type,
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          loginId: userData.loginId,
          uniqueCode: uniqueCode,
        };

        // 권한에 맞는 리다이렉트 경로 설정
        const redirectPath = getRedirectPath(user.type);

        // TODO : next-auth 토큰 갱신 관련하여 학습 후, 토큰 관리를 어떻게 할지 확인 할 것.
        await signIn("credentials", {
          ...user,
          callbackUrl: redirectPath,
        });

        setAccessToken(accessToken.token);
        setRefreshToken(refreshToken.token);
      }
    } catch (error) {
      console.error("onSubmit error", error);
      let message = "로그인 실패";
      if (error instanceof ApiError) {
        console.error("error", error);
        message = error.message;

        if (error.code === "103") {
          router.push(`/error?type=inactive`);
          return;
        }

        if (error.code === "101") {
          setErrMessage("비밀번호가 잘못 되었습니다.");
          return;
        }
      }
      setErrMessage("가입되지 않은 정보입니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const remembered =
        localStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL) === "true";
      setIsRememberUsername(remembered);

      if (remembered) {
        const savedEmail = localStorage.getItem(STORAGE_KEYS.SAVED_EMAIL);
        if (savedEmail) {
          form.setValue("email", savedEmail);
        }
      }
    }
  }, [form]);

  useEffect(() => {
    if (!code) return;

    getAgencyDomainNameApi(code).then((res) => {
      setDomainName(res.domainName);
    });
  }, [code]);

  // 토큰 검사 중이면 로딩 표시
  if (isCheckingToken) {
    return <LoadingUI title="인증 정보 확인 중..." />;
  }

  if (device === "mobile") {
    return <MobileError />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {loading && <LoadingUI title="로그인 중..." />}

      {pwdModal && <ModalPwdSetting onClose={() => setPwdModal(false)} />}

      <div className="max-w-md w-full space-y-8">
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <Image
            src="/images/logo_signin.png"
            alt="logo"
            width={214}
            height={83}
          />
          <p className="text-base font-medium">
            온라인 광고 후부 자동 결제 솔루션
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <InputForm<FormValues>
              control={form.control}
              name="email"
              label={!!domainName ? "아이디" : "이메일"}
              placeholder={
                !!domainName ? "아이디를 입력해주세요" : "이메일을 입력해주세요"
              }
              suffix={domainName ? `@${domainName}` : undefined}
              preventSpaces
            />

            <InputForm<FormValues>
              control={form.control}
              name="password"
              type="password"
              label="비밀번호"
              placeholder="영문, 숫자, 특수문자가 모두 들어간 8-16자"
              preventSpaces
            />

            <div>
              <Button type="submit" className="w-full">
                로그인
              </Button>

              {errMessage && <ErrorMessage message={errMessage} />}
            </div>

            <div className="flex items-center justify-between">
              <CheckboxLabel
                isChecked={isRememberUsername}
                onChange={handleRememberChange}
                label="아이디 저장"
              />
              <span
                className="text-[#545F71] cursor-pointer text-sm"
                onClick={() => setPwdModal(true)}
              >
                비밀번호 재설정
              </span>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignInView;

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <span className="text-red-500 text-sm mt-2 block text-center font-medium">
      {message}
    </span>
  );
};

import Image from "next/image";

// 404 오류 페이지
const MobileError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <Image src="/images/error-page.png" alt="logo" width={100} height={100} />

      <p className="mt-4 text-[20px] font-medium">
        모바일 환경에서는 로그인이 불가능합니다.
      </p>
      <p className="my-6 text-[15px] font-medium">
        PC 환경에서 로그인 해주세요.
      </p>
    </div>
  );
};
