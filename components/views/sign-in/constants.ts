import { z } from "zod";
import { COMPANY_REGEX, PASSWORD_REGEX_ADD } from "@/constants/reg";

export const STORAGE_KEYS = {
  REMEMBER_EMAIL: "remember_email",
  SAVED_EMAIL: "saved_email",
} as const;

export const ERROR_MESSAGES = {
  id: {
    required: "아이디를 입력해주세요.",
    invalid: "영문, 숫자만 입력 가능합니다.",
    minLength: "아이디는 최소 4자 이상이어야 합니다.",
  },
  password: {
    required: "비밀번호를 입력해주세요.",
    invalid: "영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.",
  },
} as const;

/**
 * @description 로그인 form 스키마 생성

 * @returns 로그인 form 스키마
 */
export const createFormSchema = () => {
  return z.object({
    id: z
      .string()
      .min(4, {
        message: ERROR_MESSAGES.id.minLength,
      })
      .regex(COMPANY_REGEX, {
        message: ERROR_MESSAGES.id.invalid,
      }),
    password: z
      .string()
      .min(1, { message: ERROR_MESSAGES.password.required })
      .regex(PASSWORD_REGEX_ADD, {
        message: ERROR_MESSAGES.password.invalid,
      }),
  });
};

export const defaultValues = {
  id: "",
  password: "",
};
