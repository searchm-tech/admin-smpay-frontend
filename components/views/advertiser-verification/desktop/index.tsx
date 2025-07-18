"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import HeaderSection from "./HeaderSection";
import AgreemenSection from "./AgreemenSection";
import InfoSection from "./InfoSection";
import FooterSection from "./FooterSection";

import LoadingUI from "@/components/common/Loading";
import { ConfirmDialog } from "@/components/composite/modal-components";

import { DEFAULT_BANK_INFO, DEFAULT_AGREEMENT_INFO } from "../constants";
import {
  ADVERIFY_DIALOG_CONTENT,
  type AdVerifyDialogStatus,
} from "@/constants/dialog";

import { useAdvertiserBankAccount } from "@/hooks/queries/bank";

import type { BankInfo, AgreementInfo } from "@/types/vertification";

type DesktopViewProps = {
  advertiserId: number;
};

const DesktopView = ({ advertiserId }: DesktopViewProps) => {
  const router = useRouter();

  const { mutate: advertiserBankAccount, isPending: isSubmittingBankAccount } =
    useAdvertiserBankAccount({
      onSuccess: (res) => {
        setOpenDialog("submit");
      },
    });

  const [arsCertified, setArsCertified] = useState(false); // TODO : ARS 하고 false 변경
  const [withdrawAccountId, setWithdrawAccountId] = useState<number>(0);
  console.log("withdrawAccountId", withdrawAccountId);

  const [agreement, setAgreement] = useState<AgreementInfo>(
    DEFAULT_AGREEMENT_INFO
  );
  const [salesAccount, setSalesAccount] = useState<BankInfo>(DEFAULT_BANK_INFO);
  const [chargeAccount, setChargeAccount] =
    useState<BankInfo>(DEFAULT_BANK_INFO);

  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<AdVerifyDialogStatus | null>(
    null
  );

  const handleReset = () => {
    setSalesAccount(DEFAULT_BANK_INFO);
    setChargeAccount(DEFAULT_BANK_INFO);
    setAgreement(DEFAULT_AGREEMENT_INFO);
    setArsCertified(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = () => {
    if (!agreement.agreePrivacy || !agreement.agreeService) {
      setError("필수 동의 항목을 체크해주세요.");
      return;
    }

    if (
      !chargeAccount.accountHolder ||
      !salesAccount.accountHolder ||
      !chargeAccount.accountNumber ||
      !salesAccount.accountNumber ||
      !chargeAccount.bank ||
      !salesAccount.bank
    ) {
      setError("입력하지 않은 구간이 있습니다.");
      return;
    }

    if (!chargeAccount.isCertified || !salesAccount.isCertified) {
      setError("계좌 인증을 진행해주세요.");
      return;
    }

    advertiserBankAccount({
      advertiserId: Number(advertiserId),
      withdrawAccountId: Number(withdrawAccountId),
      accounts: [
        {
          bankCode: chargeAccount.bank,
          bankCodeName: chargeAccount.bankName,
          bankNumber: chargeAccount.accountNumber,
          name: chargeAccount.accountHolder,
          type: "DEPOSIT",
        },
        {
          bankCode: salesAccount.bank,
          bankCodeName: salesAccount.bankName,
          bankNumber: salesAccount.accountNumber,
          name: salesAccount.accountHolder,
          type: "WITHDRAW",
        },
      ],
    });
  };

  return (
    <div className="max-w-[750px] mt-10 h-[1105px] text-center flex flex-col items-center mx-auto">
      {isSubmittingBankAccount && <LoadingUI title="제출 중..." />}
      <HeaderSection />

      <AgreemenSection agreement={agreement} setAgreement={setAgreement} />
      <InfoSection
        advertiserId={advertiserId}
        chargeAccount={chargeAccount}
        salesAccount={salesAccount}
        arsCertified={arsCertified}
        setChargeAccount={setChargeAccount}
        setSalesAccount={setSalesAccount}
        setArsCertified={setArsCertified}
        setWithdrawAccountId={setWithdrawAccountId}
      />
      <FooterSection
        handleReset={handleReset}
        handleSubmit={handleSubmit}
        arsCertified={arsCertified}
      />

      {error && (
        <ConfirmDialog
          open
          onConfirm={() => setError(null)}
          content={error}
          cancelDisabled={true}
        />
      )}
      {openDialog && (
        <ConfirmDialog
          open
          content={ADVERIFY_DIALOG_CONTENT[openDialog]}
          cancelDisabled={true}
          onConfirm={() => {
            setOpenDialog(null);
            router.push("/sign-in");
          }}
        />
      )}
    </div>
  );
};

export default DesktopView;
