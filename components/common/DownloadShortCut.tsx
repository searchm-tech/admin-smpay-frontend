import { Fragment, useState } from "react";
import { ExternalLink } from "lucide-react";
import { ConfirmDialog } from "@/components/composite/modal-components";
import { useQueryAgencyDomainName } from "@/hooks/queries/agency";

type Props = {
  code: string;
};
const ShortcutButton = ({ code }: Props) => {
  const { data: agencyInfo } = useQueryAgencyDomainName(code);
  const [error, setError] = useState<string>("");

  const handleDownloadShortcut = () => {
    if (!agencyInfo) {
      setError("대행사 정보를 찾을 수 없습니다.");
      return;
    }

    const url =
      process.env.NEXT_PUBLIC_ENV === "production"
        ? `https://smpay.co.kr/sign-in?code=${code}`
        : `https://dev.smpay.co.kr/sign-in?code=${code}`;

    const filename = `${agencyInfo.name}.url`;
    const content = `[InternetShortcut]\nURL=${url}`;

    const blob = new Blob([content], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Fragment>
      {error && (
        <ConfirmDialog
          open
          content={error}
          cancelDisabled
          onConfirm={() => setError("")}
        />
      )}
      <button
        onClick={handleDownloadShortcut}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
      >
        <ExternalLink size={14} />
        <span>바로가기</span>
        <span className="text-blue-500">+</span>
      </button>
    </Fragment>
  );
};

export default ShortcutButton;
