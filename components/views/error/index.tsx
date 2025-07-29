"use client";

import { HomeButton } from "@/components/composite/button-components";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const ErrorView = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="my-5 w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full bg-gray-100 flex items-center justify-center">
        <Image src="/images/error.png" alt="logo" width={100} height={100} />
      </div>
      <p className="text-[20px] font-medium">
        {errorType[type as keyof typeof errorType].title}
      </p>
      <p className="my-8 text-[15px] font-medium">
        {errorType[type as keyof typeof errorType].description}
      </p>
      <HomeButton href="/sign-out">메인 페이지로 이동</HomeButton>
    </div>
  );
};

export default ErrorView;

const errorType = {
  expire: {
    title: "인증 메일의 유호기간이 만료되었습니다.",
    description: (
      <>
        <p>인증 메일은 발송 후 7일(3일) 동안만 유효합니다.</p>
        <p>새로운 인증 메일이 필요하시면 담당자에게 재발송을 요청해주세요.</p>
      </>
    ),
  },
  inactive: {
    title: "계정이 비활성화 또는 삭제되었습니다.",
    description: (
      <>
        <p>SM Pay를 다시 이용하시려면 담당자에게 문의해주세요.</p>
      </>
    ),
  },
  delete: {
    title: "계정이 삭제 되었습니다.",
    description: (
      <>
        <p>SM Pay를 다시 이용하시려면 담당자에게 문의해주세요.</p>
      </>
    ),
  },
};

type Props = {
  type?: keyof typeof viewType;
  message?: string;
};
const ErrorComponent = ({ type, message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <Image
        src="/images/error-expire.png"
        alt="expire"
        width={100}
        height={100}
      />

      {message && <div className="my-6 text-[15px] font-medium">{message}</div>}
      {type && viewType[type]}
      <HomeButton href="/sign-in">로그인 페이지로 이동</HomeButton>
    </div>
  );
};

export { ErrorComponent };

export const viewType = {
  "expiration-login": (
    <>
      <p className="text-[20px] font-medium">로그인 인증이 만료되었습니다.</p>
      <p className="my-8 text-[15px] font-medium">
        사용자의 보안을 위해 일정 시간 동안 활동이 없어 자동 로그아웃되었습니다.
        <br />
        <br />
        다시 로그인하여 서비를 이용해주세요.
      </p>
    </>
  ),

  "expiration-mail": (
    <>
      <p className="text-[20px] font-medium">
        인증메일의 유효기간이 만료되었습니다.
      </p>
      <p className="my-8 text-[15px] font-medium">
        인증 메일은 발송 후 7일(3일) 동안만 유효합니다.
        <br />
        새로운 인증 메일이 필요하시면 담당자에게 재발송을 요청해주세요.
      </p>
    </>
  ),
};
