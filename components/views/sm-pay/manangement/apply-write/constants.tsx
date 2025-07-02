import * as z from "zod";
import { BUSINESS_NUMBER_REGEX } from "@/constants/reg";
import { TableParams } from "@/types/table";

export const formSchema = z.object({
  name: z.string().min(1, "사업자명을 입력해주세요"),
  representativeName: z.string().min(1, "대표자명을 입력해주세요"),
  representativeNumber: z.string().min(1, "사업자 등록 번호를 입력해주세요"),
  // .regex(BUSINESS_NUMBER_REGEX, "올바른 사업자 등록 번호 형식이 아닙니다"),
  phoneNumber: z.string().min(1, "휴대폰 번호를 입력해주세요"),
  // .regex(PHONE_REGEX, "올바른 휴대폰 번호 형식이 아닙니다"),
  email: z
    .string()
    .min(1, "이메일 주소를 입력해주세요")
    .email("올바른 이메일 주소 형식이 아닙니다"),
});

export type FormValues = z.infer<typeof formSchema>;

export const defaultValues: FormValues = {
  name: "",
  representativeName: "",
  representativeNumber: "",
  phoneNumber: "",
  email: "",
};

export type PropsModal = {
  onClose: () => void;
  onConfirm: () => void;
  advertiserId: number;
  refetch: () => void;
};

export type ModalInfo = {
  type: "edit" | "create";
  advertiserId: number;
};

export const defaultTable: TableParams = {
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  sortField: "ADVERTISER_REGISTER_DESC",
};
