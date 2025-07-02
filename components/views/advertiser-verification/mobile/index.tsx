"use client";

import { Fragment, useState } from "react";

import HeaderSection from "@/components/views/advertiser-verification/mobile/HeaderSection";
import AgreemenSection from "@/components/views/advertiser-verification/mobile/AgreemenSection";
import AccountCharge from "@/components/views/advertiser-verification/mobile/AccountCharge";
import AccountSale from "@/components/views/advertiser-verification/mobile/AccountSale";

import { MobileTitle } from "@/components/common/Title";
import FinishView from "./FinishView";

import { useAccountStore } from "@/store/useAccountStore";
import { DEFAULT_AGREEMENT_INFO } from "../constants";
import type { AccountInfo, AgreementInfo } from "@/types/vertification";
import { useAdvertiserBankAccount, useARS } from "@/hooks/queries/account";
import LoadingUI from "@/components/common/Loading";

type Props = {
  advertiserId: number;
};

const MobilewView = ({ advertiserId }: Props) => {
  const { accountList } = useAccountStore();

  const { mutate: advertiserBankAccount, isPending: isSubmittingBankAccount } =
    useAdvertiserBankAccount({
      onSuccess: () => {
        setStep(3);
      },
    });

  const { mutate: arsCertification, isPending: isCertifyingARS } = useARS({
    onSuccess: (response) => {
      if (response) {
        alert("ARS 인증이 완료되었습니다.");
        setArsCertified(true);
      } else {
        alert("ARS 인증을 실패하였습니다.");
        setArsCertified(false);
      }
    },
    onError: (error) => {
      alert("ARS 인증에 실패했습니다.");
      setArsCertified(false);
    },
  });

  const [step, setStep] = useState(1);

  const [arsCertified, setArsCertified] = useState(false); // TODO : ARS 하고 false 변경
  const [agreement, setAgreement] = useState<AgreementInfo>(
    DEFAULT_AGREEMENT_INFO
  );
  const [salesAccount, setSalesAccount] =
    useState<AccountInfo>(DEFAULT_ACCOUNT_INFO);
  const [chargeAccount, setChargeAccount] =
    useState<AccountInfo>(DEFAULT_ACCOUNT_INFO);

  const handleNext = () => {
    if (!agreement.agreePrivacy || !agreement.agreeService) {
      alert("필수 동의 항목을 체크해주세요.");
      return;
    }

    if (!chargeAccount.isCertified) {
      alert("충전 계좌 인증을 진행해주세요.");
      return;
    }

    if (
      !chargeAccount.accountHolder ||
      !chargeAccount.accountNumber ||
      !chargeAccount.bank
    ) {
      alert("충전 계좌 정보를 입력해주세요.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = () => {
    if (!arsCertified) {
      alert("ARS 인증을 진행해주세요.");
      return;
    }

    if (!agreement.agreePrivacy || !agreement.agreeService) {
      alert("필수 동의 항목을 체크해주세요.");
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
      alert("입력하지 않은 구간이 있습니다.");
      return;
    }

    advertiserBankAccount({
      advertiserId: Number(advertiserId),
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

  const handleChargeReset = () => {
    setChargeAccount(DEFAULT_ACCOUNT_INFO);
    setAgreement(DEFAULT_AGREEMENT_INFO);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleARS = () => {
    if (!chargeAccount.isCertified || !salesAccount.isCertified) {
      alert("계좌 인증을 진행해주세요.");
      return;
    }
    arsCertification({
      advertiserId: Number(advertiserId),
      bankCode: salesAccount.bank,
      accountNumber: salesAccount.accountNumber,
    });
  };

  if (isCertifyingARS) {
    return <LoadingUI title="ARS 인증 중..." />;
  }

  if (isSubmittingBankAccount) {
    return <LoadingUI title="제출 중..." />;
  }

  return (
    <div className="flex flex-col items-center justify-between h-full min-h-[100vh]">
      {step !== 3 && (
        <div className="w-full flex flex-col items-center justify-center">
          <MobileTitle />
          {step === 1 && (
            <Fragment>
              <HeaderSection />
              <AgreemenSection
                agreement={agreement}
                setAgreement={setAgreement}
              />
              <AccountCharge
                chargeAccount={chargeAccount}
                setChargeAccount={setChargeAccount}
                handleReset={handleChargeReset}
                accountList={accountList}
                advertiserId={advertiserId}
              />
            </Fragment>
          )}

          {step === 2 && (
            <AccountSale
              salesAccount={salesAccount}
              setSalesAccount={setSalesAccount}
              handleReset={() => setSalesAccount(DEFAULT_ACCOUNT_INFO)}
              handleARS={handleARS}
              arsCertified={arsCertified}
              accountList={accountList}
              advertiserId={advertiserId}
            />
          )}
        </div>
      )}

      {step === 1 && <NextButton onNext={handleNext} />}
      {step === 2 && (
        <PrevSumbitButton onPrev={() => setStep(1)} onSubmit={handleSubmit} />
      )}

      {step === 3 && <FinishView />}
    </div>
  );
};

export default MobilewView;

const NextButton = ({ onNext }: { onNext: () => void }) => {
  return (
    <div
      className="w-full h-[40px] bg-[#F6BE2C] text-white font-bold text-lg mt-10 flex items-center justify-center cursor-pointer"
      onClick={onNext}
    >
      다음으로
    </div>
  );
};

const PrevSumbitButton = ({
  onPrev,
  onSubmit,
}: {
  onPrev: () => void;
  onSubmit: () => void;
}) => {
  return (
    <div className="flex w-full">
      <div
        className="w-full h-[40px] bg-[#BABABA] text-white font-bold text-lg mt-10 flex items-center justify-center cursor-pointer"
        onClick={onPrev}
      >
        이전으로
      </div>
      <div
        className="w-full h-[40px] bg-[#F6BE2C] text-white font-bold text-lg mt-10 flex items-center justify-center cursor-pointer"
        onClick={onSubmit}
      >
        제출하기
      </div>
    </div>
  );
};

const DEFAULT_ACCOUNT_INFO: AccountInfo = {
  bank: "",
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  isCertified: false,
};
