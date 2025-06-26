import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";
import { PhoneInput } from "@/components/composite/input-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { ConfirmDialog, Modal } from "@/components/composite/modal-components";
import LoadingUI from "@/components/common/Loading";

import {
  useSmPayAdvertiserDetail,
  useSmPayAdvertiserUpdate,
} from "@/hooks/queries/sm-pay";

import { formatBusinessNumber } from "@/utils/format";
import { formSchema, type PropsModal, type FormValues } from "./constants";

const ModalEdit = ({
  onClose,
  onConfirm,
  advertiserId,
  refetch,
}: PropsModal) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      representativeName: "",
      representativeNumber: "",
      phoneNumber: "",
      email: "",
    },
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const { data: detailData, isLoading: loadingDetail } =
    useSmPayAdvertiserDetail(advertiserId);
  const { mutate: updateAdvertiserDetail, isPending: loadingUpdate } =
    useSmPayAdvertiserUpdate({
      onSuccess: () => setIsSuccess(true),
    });

  const handleConfirm = () => {
    onConfirm();
    refetch();
  };

  const handleSubmit = (data: FormValues) => {
    const params = {
      name: data.name,
      representativeName: data.representativeName,
      representativeNumber: data.representativeNumber.replace(/-/g, ""),
      phoneNumber: data.phoneNumber,
      email: data.email,
    };

    updateAdvertiserDetail({ advertiserId, params });
  };

  useEffect(() => {
    if (!detailData) return;

    form.reset({
      name: detailData.name,
      representativeName: detailData.representativeName,
      representativeNumber: formatBusinessNumber(
        detailData.businessRegistrationNumber
      ),
      phoneNumber: detailData.phoneNumber,
      email: detailData.emailAddress,
    });
  }, [detailData]);

  if (loadingUpdate) {
    return <LoadingUI title="광고주 정보 등록 중..." />;
  }

  if (loadingDetail) {
    return <LoadingUI title="광고주 정보 조회중..." />;
  }

  if (isSuccess) {
    return (
      <ConfirmDialog
        open
        onClose={handleConfirm}
        onConfirm={handleConfirm}
        content="광고주 정보 변경이 완료되었습니다."
      />
    );
  }

  return (
    <Modal
      title="광고주 정보 변경"
      open
      onClose={onClose}
      cancelDisabled
      confirmDisabled
    >
      <div className="w-[750px]">
        <LabelBullet>광고주 기본 정보</LabelBullet>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Descriptions columns={1} className="mt-4">
              <DescriptionItem label="광고주명 *">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="max-w-[450px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DescriptionItem>
              <DescriptionItem label="대표자명 *">
                <FormField
                  control={form.control}
                  name="representativeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input className="max-w-[450px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DescriptionItem>
              <DescriptionItem label="사업자 등록 번호 *">
                <FormField
                  control={form.control}
                  name="representativeNumber"
                  render={({ field }) => (
                    <FormItem className="flex gap-4 items-end">
                      <FormControl>
                        <Input
                          className="max-w-[450px]"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            const formattedValue = formatBusinessNumber(value);
                            field.onChange(formattedValue);
                          }}
                          maxLength={12}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DescriptionItem>
              <DescriptionItem label="광고주 휴대폰 번호">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex gap-4 items-end">
                      <FormControl>
                        <PhoneInput
                          className="max-w-[450px]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DescriptionItem>
              <DescriptionItem label="광고주 이메일 주소">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="max-w-[450px]"
                          preventSpaces
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DescriptionItem>
            </Descriptions>

            <div className="flex justify-center mt-4 gap-4">
              <Button
                type="button"
                variant="cancel"
                onClick={onClose}
                className="w-[150px]"
              >
                취소
              </Button>
              <Button type="submit" className="w-[150px]">
                등록
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalEdit;
