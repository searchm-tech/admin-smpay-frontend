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

import { useBanckCertification, useARS } from "@/hooks/queries/bank";

import { useBankStore } from "@/store/useBankStore";

import { HOVER_ADVERIFY, TOOLTIP_CONTENT } from "@/constants/hover";
import { ADVERIFY_DIALOG_CONTENT } from "@/constants/dialog";

import type { BankInfo } from "@/types/vertification";

import LoadingUI from "@/components/common/Loading";

type InfoSectionProps = {
  advertiserId: number;
  chargeAccount: BankInfo;
  salesAccount: BankInfo;
  arsCertified: boolean;
  setChargeAccount: (account: BankInfo) => void;
  setSalesAccount: (account: BankInfo) => void;
  setArsCertified: (arsCertified: boolean) => void;
  setWithdrawAccountId: (withdrawAccountId: number) => void;
};
const InfoSection = ({
  advertiserId,
  chargeAccount,
  salesAccount,
  arsCertified,
  setChargeAccount,
  setSalesAccount,
  setArsCertified,
  setWithdrawAccountId,
}: InfoSectionProps) => {
  const { bankList } = useBankStore();
  const [isCertifiedCharge, setIsCertifiedCharge] = useState(false);
  const [isCertifiedSales, setIsCertifiedSales] = useState(false);

  const [certifiedMessage, setCertifiedMessage] = useState<
    "charge" | "sales" | null
  >(null);

  const [message, setMessage] = useState<string | null>(null);

  const { mutate: accountCertificationChage, isPending: isCertifyingCharge } =
    useBanckCertification({
      onSuccess: (res) => {
        if (res === true) {
          setIsCertifiedCharge(true);
          setCertifiedMessage("charge");
        } else {
          setMessage("계좌 인증에 실패했습니다.");
          setIsCertifiedCharge(false);
        }
      },
      onError: (error) => {
        setMessage("계좌 인증에 실패했습니다.");
        setIsCertifiedCharge(false);
      },
    });
  const { mutate: accountCertificationSales, isPending: isCertifyingSales } =
    useBanckCertification({
      onSuccess: () => {
        setIsCertifiedSales(true);
        setCertifiedMessage("sales");
      },
      onError: (error) => {
        setMessage("계좌 인증에 실패했습니다.");
        setIsCertifiedSales(false);
      },
    });

  const { mutate: arsCertification, isPending: isCertifyingARS } = useARS({
    onSuccess: (response) => {
      if (response && response.result) {
        setMessage("ARS 인증이 완료되었습니다.");
        setWithdrawAccountId(response.withdrawAccountId);
        setArsCertified(true);
      } else {
        setMessage("ARS 인증을 실패하였습니다.");
        setArsCertified(false);
      }
    },
    onError: (error) => {
      setMessage("ARS 인증에 실패했습니다.");
      setArsCertified(false);
    },
  });

  const handleChargeCertification = async () => {
    if (
      !chargeAccount.accountHolder ||
      !chargeAccount.accountNumber ||
      !chargeAccount.bank
    ) {
      setMessage("입력하지 않은 구간이 있습니다.");
      return;
    }

    accountCertificationChage({
      advertiserId: Number(advertiserId),
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
      setMessage("입력하지 않은 구간이 있습니다.");
      return;
    }

    accountCertificationSales({
      advertiserId: Number(advertiserId),
      bankCode: salesAccount.bank,
      accountNumber: salesAccount.accountNumber,
      accountName: salesAccount.accountHolder,
    });
  };

  const handleARS = () => {
    if (!chargeAccount.isCertified || !salesAccount.isCertified) {
      setMessage("계좌 인증을 진행해주세요.");
      return;
    }
    arsCertification({
      advertiserId: Number(advertiserId),
      bankCode: salesAccount.bank,
      accountNumber: salesAccount.accountNumber,
    });
  };

  return (
    <section className="w-full mt-10 py-6 border-dotted border-gray-400 border-b-2 border-t-2">
      {isCertifyingARS && <LoadingUI title="ARS 인증 중" />}
      {(isCertifyingCharge || isCertifyingSales) && (
        <LoadingUI title="계좌 인증 중" />
      )}
      {message && (
        <ConfirmDialog
          open
          onConfirm={() => setMessage(null)}
          content={message}
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
              options={bankList.map((account) => ({
                label: account.name,
                value: account.bankCode,
              }))}
              placeholder="은행 선택"
              value={chargeAccount.bank}
              onChange={(value) =>
                setChargeAccount({
                  ...chargeAccount,
                  bank: value,
                  bankName:
                    bankList.find((account) => account.bankCode === value)
                      ?.name || "",
                })
              }
            />
          </DescriptionItem>
          <DescriptionItem
            label={<span className="w-[200px]">충전 계좌 번호 *</span>}
          >
            <Input
              className="max-w-[500px]"
              placeholder="계좌번호 입력"
              value={chargeAccount.accountNumber}
              onChange={(e) => {
                const value = e.target.value;
                // 숫자와 하이픈만 허용
                const filteredValue = value.replace(/[^0-9-]/g, "");
                setChargeAccount({
                  ...chargeAccount,
                  accountNumber: filteredValue,
                });
              }}
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
              className="max-w-[500px]"
              options={bankList.map((account) => ({
                label: account.name,
                value: account.bankCode,
              }))}
              placeholder="은행 선택"
              value={salesAccount.bank}
              onChange={(value) =>
                setSalesAccount({
                  ...salesAccount,
                  bank: value,
                  bankName:
                    bankList.find((account) => account.bankCode === value)
                      ?.name || "",
                })
              }
            />
          </DescriptionItem>
          <DescriptionItem
            label={<span className="w-[200px]">매출 계좌 번호 *</span>}
          >
            <Input
              className="max-w-[500px]"
              placeholder="계좌번호 입력"
              value={salesAccount.accountNumber}
              onChange={(e) => {
                const filteredValue = e.target.value.replace(/[^0-9-]/g, "");
                setSalesAccount({
                  ...salesAccount,
                  accountNumber: filteredValue,
                });
              }}
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
        disabled={!isCertifiedCharge || !isCertifiedSales || arsCertified}
        onClick={handleARS}
      >
        {arsCertified ? "ARS 인증 완료" : "ARS 인증"}
      </Button>
    </section>
  );
};

export default InfoSection;
