import LoadingUI from "@/components/common/Loading";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "@/components/composite/select-components";
import { Separator } from "@/components/ui/separator";

import { NumberInput } from "@/components/composite/input-components";

import { useBankStore } from "@/store/useBankStore";
import { useBanckCertification } from "@/hooks/queries/bank";

import type { BankInfo } from "@/types/vertification";

type Props = {
  salesBank: BankInfo;
  setSalesBank: (account: BankInfo) => void;
  handleReset: () => void;
  handleARS: () => void;
  arsCertified: boolean;
  advertiserId: number;
};

const AccountSale = ({
  salesBank,
  setSalesBank,
  handleReset,
  handleARS,
  arsCertified,
  advertiserId,
}: Props) => {
  const { bankList } = useBankStore();

  const { mutate: bankCertificationSales, isPending: isCertifyingSales } =
    useBanckCertification({
      onSuccess: (res) => {
        if (res === true) {
          setSalesBank({ ...salesBank, isCertified: true });
          alert("계좌 인증이 완료 되었습니다.");
        } else {
          setSalesBank({ ...salesBank, isCertified: false });
          alert("계좌 인증에 실패했습니다.");
        }
      },
      onError: (error) => {
        setSalesBank({ ...salesBank, isCertified: false });
        alert("계좌 인증에 실패했습니다.");
      },
    });

  const handleSalesCertification = () => {
    if (
      !salesBank.accountHolder ||
      !salesBank.accountNumber ||
      !salesBank.bank
    ) {
      alert("입력하지 않은 구간이 있습니다.");
      return;
    }

    bankCertificationSales({
      advertiserId,
      bankCode: salesBank.bank,
      accountNumber: salesBank.accountNumber,
      accountName: salesBank.accountHolder,
    });
  };

  return (
    <section className="mt-4 w-full px-4">
      {isCertifyingSales && <LoadingUI />}
      <div className="flex flex-col gap-4">
        <Label className="text-base font-bold">매출 계좌 정보</Label>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">매출 계좌 은행 *</Label>
          <Select
            options={bankList.map((bank) => ({
              label: bank.name,
              value: bank.bankCode,
            }))}
            placeholder="충전 계좌 은행을 선택해주세요."
            value={salesBank.bank}
            onChange={(value) => setSalesBank({ ...salesBank, bank: value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">매출 계좌 번호 *</Label>
          <Input
            className="max-w-[500px]"
            value={salesBank.accountNumber}
            onChange={(e) => {
              const filteredValue = e.target.value.replace(/[^0-9-]/g, "");
              setSalesBank({ ...salesBank, accountNumber: filteredValue });
            }}
          />
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <Label className="text-sm font-medium">매출 계좌 예금주 *</Label>
          <Input
            className="max-w-[500px]"
            value={salesBank.accountHolder}
            onChange={(e) =>
              setSalesBank({
                ...salesBank,
                accountHolder: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-center gap-2">
          <Button
            className="h-[35px] w-1/2 font-bold"
            onClick={handleSalesCertification}
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

        <Separator className="border-black border-[0.5px]" />

        <Button
          className="h-[40px] w-full bg-[#9BA5B7] font-bold text-lg"
          onClick={handleARS}
          disabled={arsCertified}
        >
          {arsCertified ? "ARS 인증 완료" : "ARS 인증하기"}
        </Button>
      </div>
    </section>
  );
};

export default AccountSale;
