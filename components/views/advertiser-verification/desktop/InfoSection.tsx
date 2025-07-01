import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { NumberInput } from "@/components/composite/input-components";
import Select from "@/components/composite/select-components";
import { ConfirmDialog } from "@/components/composite/modal-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { TooltipHover } from "@/components/composite/tooltip-components";
import { HelpIcon } from "@/components/composite/icon-components";
import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";

import { HOVER_ADVERIFY, TOOLTIP_CONTENT } from "@/constants/hover";

import type { AccountInfo } from "@/types/vertification";
import { ADVERIFY_DIALOG_CONTENT } from "@/constants/dialog";
import {
  useAccountCertification,
  useAccountList,
  useAdvertiserBankAccount,
} from "@/hooks/queries/account";
import LoadingUI from "@/components/common/Loading";

type InfoSectionProps = {
  advertiserId: number;
  chargeAccount: AccountInfo;
  salesAccount: AccountInfo;
  arsCertified: boolean;
  setChargeAccount: (account: AccountInfo) => void;
  setSalesAccount: (account: AccountInfo) => void;
  setArsCertified: (arsCertified: boolean) => void;
};
const InfoSection = ({
  chargeAccount,
  salesAccount,
  arsCertified,
  setChargeAccount,
  setSalesAccount,
  setArsCertified,
}: InfoSectionProps) => {
  const [isCertifiedCharge, setIsCertifiedCharge] = useState(false);
  const [isCertifiedSales, setIsCertifiedSales] = useState(false);

  const [certifiedMessage, setCertifiedMessage] = useState<
    "charge" | "sales" | null
  >(null);

  const [error, setError] = useState<string | null>(null);

  const { data: accountList = [] } = useAccountList();

  const { mutate: accountCertificationChage, isPending: isCertifyingCharge } =
    useAccountCertification({
      onSuccess: () => {
        setIsCertifiedCharge(true);
        setCertifiedMessage("charge");
      },
      onError: (error) => {
        setError("계좌 인증에 실패했습니다.");
        setIsCertifiedCharge(false);
      },
    });
  const { mutate: accountCertificationSales, isPending: isCertifyingSales } =
    useAccountCertification({
      onSuccess: () => {
        setIsCertifiedSales(true);
        setCertifiedMessage("sales");
      },
      onError: (error) => {
        setError("계좌 인증에 실패했습니다.");
        setIsCertifiedSales(false);
      },
    });

  const { mutate: advertiserBankAccount, isPending: isSubmittingBankAccount } =
    useAdvertiserBankAccount({
      onSuccess: () => {
        setArsCertified(true);
      },
    });

  const handleChargeCertification = async () => {
    if (
      !chargeAccount.accountHolder ||
      !chargeAccount.accountNumber ||
      !chargeAccount.bank
    ) {
      setError("입력하지 않은 구간이 있습니다.");
      return;
    }

    accountCertificationChage({
      advertiserId: 1,
      bankCode: chargeAccount.bank,
      accountNumber: chargeAccount.accountNumber,
      accountName: chargeAccount.accountHolder,
    });
  };

  const handleSalesCertification = () => {
    if (
      !salesAccount.accountHolder ||
      !salesAccount.accountNumber ||
      !salesAccount.bank
    ) {
      setError("입력하지 않은 구간이 있습니다.");
      return;
    }

    accountCertificationSales({
      advertiserId: 1,
      bankCode: salesAccount.bank,
      accountNumber: salesAccount.accountNumber,
      accountName: salesAccount.accountHolder,
    });
  };

  const handleARS = () => {
    if (!chargeAccount.isCertified || !salesAccount.isCertified) {
      setError("계좌 인증을 진행해주세요.");
      return;
    }

    advertiserBankAccount({
      advertiserId: 1,
      accounts: [
        {
          bankCode: chargeAccount.bank,
          bankCodeName: chargeAccount.bank,
          bankNumber: chargeAccount.accountNumber,
          name: chargeAccount.accountHolder,
          type: "DEPOSIT",
        },
        {
          bankCode: salesAccount.bank,
          bankCodeName: salesAccount.bank,
          bankNumber: salesAccount.accountNumber,
          name: salesAccount.accountHolder,
          type: "WITHDRAW",
        },
      ],
    });
  };

  return (
    <section className="w-full mt-10 py-6 border-dotted border-gray-400 border-b-2 border-t-2">
      {(isCertifyingCharge || isCertifyingSales) && (
        <LoadingUI title="계좌 인증 중" />
      )}
      {error && (
        <ConfirmDialog
          open
          onConfirm={() => setError(null)}
          content={error}
          cancelDisabled={true}
        />
      )}
      {certifiedMessage && (
        <ConfirmDialog
          open
          onConfirm={() => {
            if (certifiedMessage === "charge") {
              setChargeAccount({ ...chargeAccount, isCertified: true });
            } else {
              setSalesAccount({ ...salesAccount, isCertified: true });
            }

            setCertifiedMessage(null);
          }}
          content={ADVERIFY_DIALOG_CONTENT["certification"]}
          cancelDisabled={true}
        />
      )}
      <div className="mt-4">
        <div className="flex items-center gap-2 pb-4">
          <LabelBullet labelClassName="text-base ">
            충전 계좌 정보 입력
          </LabelBullet>
          <TooltipHover
            triggerContent={<HelpIcon />}
            content={TOOLTIP_CONTENT["charge_account"]}
          />
        </div>

        <Descriptions columns={1}>
          <DescriptionItem
            label={<span className="w-[200px]">충전 계좌 은행 *</span>}
          >
            <Select
              className="max-w-[500px]"
              options={accountList.map((account) => ({
                label: account.name,
                value: account.bankCode,
              }))}
              placeholder="은행 선택"
              value={chargeAccount.bank}
              onChange={(value) =>
                setChargeAccount({ ...chargeAccount, bank: value })
              }
            />
          </DescriptionItem>
          <DescriptionItem
            label={<span className="w-[200px]">충전 계좌 번호 *</span>}
          >
            <NumberInput
              className="max-w-[500px]"
              placeholder="숫자만 연속 입력"
              value={chargeAccount.accountNumber}
              onChange={(value) =>
                setChargeAccount({ ...chargeAccount, accountNumber: value })
              }
            />
          </DescriptionItem>
          <DescriptionItem
            label={<span className="w-[200px]">충전 계좌 예금주명 *</span>}
          >
            <div className="flex gap-2">
              <Input
                className="max-w-[400px]"
                value={chargeAccount.accountHolder}
                onChange={(e) =>
                  setChargeAccount({
                    ...chargeAccount,
                    accountHolder: e.target.value,
                  })
                }
              />
              <Button className="w-[100px]" onClick={handleChargeCertification}>
                계좌 인증 하기
              </Button>
            </div>
          </DescriptionItem>
        </Descriptions>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 pb-4">
          <LabelBullet labelClassName="text-base">
            매출 계좌 정보 입력
          </LabelBullet>
          <TooltipHover
            triggerContent={<HelpIcon />}
            content={HOVER_ADVERIFY["sales"]}
          />
        </div>

        <Descriptions columns={1}>
          <DescriptionItem
            label={<span className="w-[200px]">매출 계좌 은행 *</span>}
          >
            <Select
              options={accountList.map((account) => ({
                label: account.name,
                value: account.bankCode,
              }))}
              placeholder="은행 선택"
              value={salesAccount.bank}
              onChange={(value) =>
                setSalesAccount({ ...salesAccount, bank: value })
              }
            />
          </DescriptionItem>
          <DescriptionItem
            label={<span className="w-[200px]">매출 계좌 번호 *</span>}
          >
            <NumberInput
              className="max-w-[500px]"
              placeholder="숫자만 연속 입력"
              value={salesAccount.accountNumber}
              onChange={(value) =>
                setSalesAccount({ ...salesAccount, accountNumber: value })
              }
            />
          </DescriptionItem>
          <DescriptionItem
            label={<span className="w-[200px]">매출 계좌 예금주명 *</span>}
          >
            <div className="flex gap-2">
              <Input
                className="max-w-[400px]"
                value={salesAccount.accountHolder}
                onChange={(e) =>
                  setSalesAccount({
                    ...salesAccount,
                    accountHolder: e.target.value,
                  })
                }
              />
              <Button className="w-[100px]" onClick={handleSalesCertification}>
                계좌 인증 하기
              </Button>
            </div>
          </DescriptionItem>
        </Descriptions>
      </div>

      <Button
        className="text-center mt-8 w-[400px] h-[50px] font-bold"
        variant="cancel"
        disabled={arsCertified || !isCertifiedCharge || !isCertifiedSales}
        onClick={handleARS}
      >
        {arsCertified ? "ARS 인증 완료" : "ARS 인증"}
      </Button>
    </section>
  );
};

export default InfoSection;
