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

import LoadingUI from "@/components/common/Loading";

import ModalPwdSetting from "./ModalPwdSetting";

import { useSessionStore } from "@/store/useSessionStore";
import { signInApi } from "@/services/auth";
import { useWindowSize } from "@/hooks/useWindowSize";

import { ApiError } from "@/lib/api";

import { STORAGE_KEYS, createFormSchema, defaultValues } from "./constants";

import type { TSMPayUser } from "@/types/user";

const SignInView = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setAccessToken, setRefreshToken } = useSessionStore();
  const { device } = useWindowSize();

  const [loading, setLoading] = useState(false);
  const [pwdModal, setPwdModal] = useState(false);

  const [isRememberUsername, setIsRememberUsername] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const [errMessage, setErrMessage] = useState("");

  const formSchema = createFormSchema();
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

      // 인증되지 않은 상태면 로그인 페이지에 머물기
      if (status === "unauthenticated") {
        setIsCheckingToken(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // useSessionStore에서 토큰 확인 (수정된 부분)
        const { accessToken, refreshToken } = useSessionStore.getState();

        if (accessToken && refreshToken && session?.user?.type) {
          router.replace("/sm-pay/charge");
          return;
        }
      } catch (error) {
        console.error("Token validation error:", error);
        // 에러 발생 시 토큰 클리어
        const { clearSession } = useSessionStore.getState();
        clearSession();
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

      const email = `${values.id}@smpay.co.kr`;

      if (isRememberUsername) {
        localStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, values.id);
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
          email: userData.id.toString(),
          userId: userData.userId,
          agentId: userData.agentId,
          status: userData.status,
          type: userData.type,
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          loginId: userData.loginId,
          uniqueCode: uniqueCode,
          accessToken: accessToken.token,
          refreshToken: refreshToken.token,
        };

        setAccessToken(accessToken.token);
        setRefreshToken(refreshToken.token);

        await signIn("credentials", {
          ...user,
          accessToken: accessToken.token,
          refreshToken: refreshToken.token,
          callbackUrl: "/sm-pay/charge",
        });
      }
    } catch (error) {
      let message = "로그인 실패";
      if (error instanceof ApiError) {
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
          form.setValue("id", savedEmail);
        }
      }
    }
  }, [form]);

  // 토큰 검사 중이면 로딩 표시
  if (isCheckingToken) {
    return <LoadingUI />;
  }

  if (device === "mobile") {
    return <MobileError />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {loading && <LoadingUI />}

      {pwdModal && <ModalPwdSetting onClose={() => setPwdModal(false)} />}

      <div className="max-w-md w-full space-y-8">
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <Image
            src="/images/logo_signin.png"
            alt="logo"
            width={214}
            height={83}
          />
          <p className="text-base font-medium">관리자 모드</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <InputForm<FormValues>
              control={form.control}
              name="id"
              label="아이디"
              placeholder="아이디를 입력해주세요"
              suffix="@smpay.co.kr"
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
