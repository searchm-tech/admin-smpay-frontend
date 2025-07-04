import { useForm } from "react-hook-form";
import { useState } from "react";
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
import LoadingUI from "@/components/common/Loading";

import {
  Descriptions,
  DescriptionItem,
} from "@/components/composite/description-components";
import { PhoneInput } from "@/components/composite/input-components";
import { LabelBullet } from "@/components/composite/label-bullet";
import { ConfirmDialog, Modal } from "@/components/composite/modal-components";

import { useSmPayAdvertiserUpdate } from "@/hooks/queries/sm-pay";
import { formatBusinessNumber } from "@/utils/format";
import {
  defaultValues,
  formSchema,
  type PropsModal,
  type FormValues,
} from "./constants";

const ModalCreate = ({
  onClose,
  onConfirm,
  advertiserId,
  refetch,
}: PropsModal) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: mutateUpate, isPending } = useSmPayAdvertiserUpdate({
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
    mutateUpate({ advertiserId, params });
  };

  if (isPending) {
    return <LoadingUI title="광고주 정보 등록 중..." />;
  }

  if (isSuccess) {
    return (
      <ConfirmDialog
        open
        content="광고주 정보 등록이 완료되었습니다."
        onClose={handleConfirm}
        onConfirm={handleConfirm}
      />
    );
  }
  return (
    <Modal
      title="광고주 정보 등록"
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
                    <FormItem className="flex gap-4 items-end">
                      <FormControl>
                        <Input
                          className="max-w-[450px]"
                          placeholder="광고주를 구분할 수 있는 이름을 입력하세요."
                          {...field}
                        />
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
                    <FormItem className="flex gap-4 items-end">
                      <FormControl>
                        <Input
                          className="max-w-[450px]"
                          placeholder=""
                          {...field}
                        />
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
                          placeholder="숫자만 연속 입력"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            const formattedValue = formatBusinessNumber(value);
                            field.onChange(value);
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
                    <FormItem className="flex gap-4">
                      <FormControl>
                        <PhoneInput className="w-[450px]" {...field} />
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
                    <FormItem className="flex gap-4 items-end">
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

export default ModalCreate;
