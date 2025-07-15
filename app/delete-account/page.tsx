import { HomeButton } from "@/components/composite/button-components";
import Image from "next/image";

export default function DeleteAccountPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <Image
        src="/images/error-delete.png"
        alt="delete"
        width={100}
        height={100}
      />

      <p className="mt-4 text-[20px] font-medium">계정이 삭제되었습니다.</p>
      <p className="my-6 text-[15px] font-medium">
        SM Pay를 다시 이용하시려면 담당자에게 문의해주세요.
      </p>
      <HomeButton href="/">메인 페이지로 이동</HomeButton>
    </div>
  );
}
