import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "@/components/composite/select-components";
import { NumberInput } from "@/components/composite/input-components";

import type { BankInfo } from "@/types/vertification";
import { useBanckCertification } from "@/hooks/queries/bank";
import LoadingUI from "@/components/common/Loading";
import { useBankStore } from "@/store/useBankStore";

type BankProps = {
  chargeBank: BankInfo;
  setChargeAccount: (value: BankInfo) => void;
  handleReset: () => void;
  advertiserId: number;
};

const BankCharge = ({
  chargeBank,
  setChargeAccount,
  handleReset,
  advertiserId,
}: BankProps) => {
  const { bankList } = useBankStore();
  const { mutate: accountCertificationChage, isPending: isCertifyingCharge } =
    useBanckCertification({
      onSuccess: () => {
        alert("계좌 인증이 완료 되었습니다.");
        setChargeAccount({ ...chargeBank, isCertified: true });
      },
      onError: (error) => {
        alert("계좌 인증에 실패했습니다.");
        setChargeAccount({ ...chargeBank, isCertified: false });
      },
    });

  const handleChargeCertification = () => {
    if (
      !chargeBank.accountHolder ||
      !chargeBank.accountNumber ||
      !chargeBank.bank
    ) {
      alert("입력하지 않은 구간이 있습니다.");
      return;
    }

    accountCertificationChage({
      advertiserId,
      bankCode: chargeBank.bank,
      accountNumber: chargeBank.accountNumber,
      accountName: chargeBank.accountHolder,
    });
  };

  return (
    <section className="mt-8 w-full px-4">
      {isCertifyingCharge && <LoadingUI title="계좌 인증 중..." />}
      <div className="flex flex-col gap-4">
        <Label className="text-base font-bold">충전 계좌 정보 입력</Label>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">충전 계좌 은행 *</Label>
          <Select
            options={bankList.map((bank) => ({
              label: bank.name,
              value: bank.bankCode,
            }))}
            placeholder="충전 계좌 은행을 선택해주세요."
            value={chargeBank.bank}
            onChange={(value) =>
              setChargeAccount({ ...chargeBank, bank: value })
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">충전 계좌 은행 *</Label>
          <NumberInput
            className="max-w-[500px]"
            value={chargeBank.accountNumber}
            onChange={(value) =>
              setChargeAccount({ ...chargeBank, accountNumber: value })
            }
          />
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <Label className="text-sm font-medium">충전 계좌 예금주명 *</Label>
          <Input
            className="max-w-[500px]"
            value={chargeBank.accountHolder}
            onChange={(e) =>
              setChargeAccount({
                ...chargeBank,
                accountHolder: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-center gap-2">
          <Button
            className="h-[35px] w-1/2 font-bold"
            onClick={handleChargeCertification}
          >
            계좌 인증하기
          </Button>

          <Button
            className="h-[35px] w-1/2 font-bold"
            variant="cancel"
            onClick={handleReset}
          >
            초기화
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BankCharge;
