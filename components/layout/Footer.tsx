import { useState } from "react";
import DocumentComponent from "../common/Document";
import Image from "next/image";

const Footer = () => {
  const [documentType, setDocumentType] = useState<
    "personalInfo" | "termsOfService" | null
  >(null);

  return (
    <footer className="w-full h-[90px] bg-[#EDF0F5] text-[#3C4D60] py-4 border-t border-[#A8A8A8] flex items-center gap-8 px-8">
      {documentType && (
        <DocumentComponent
          type={documentType}
          onClose={() => setDocumentType(null)}
        />
      )}

      <Image src="/images/logo_footer.png" alt="logo" width={112} height={44} />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-8 text-sm font-normal">
          <p
            className="cursor-pointer hover:underline"
            onClick={() => setDocumentType("termsOfService")}
          >
            이용약관
          </p>
          <p
            className="cursor-pointer hover:underline"
            onClick={() => setDocumentType("personalInfo")}
          >
            개인정보처리방침
          </p>
          <p className="cursor-pointer hover:underline">고객센터</p>
        </div>

        <div className="flex items-center gap-8 text-sm font-normal">
          <p>사업자 등록 번호: 211-88-14382</p>
          <p>대표: 박규태</p>
          <p>주소: 서울 강남구 논현로 319, 3층,4층</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
