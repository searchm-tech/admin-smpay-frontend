import { useState } from "react";
import DocumentComponent from "../common/Document";

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

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 text-sm font-normal">
          <p>주식회사 써치엠</p>
          <p>|</p>
          <p>대표: 박규태</p>
          <p>|</p>
          <p>주소: 서울 강남구 논현로 319, 3층,4층</p>
        </div>
        <div className="flex items-center gap-4 text-sm font-normal">
          <p>사업자 등록 번호: 211-88-14382</p>
          <p>|</p>
          <p>통신판매업 신고번호: 제 2008-서울강남-1564호</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
