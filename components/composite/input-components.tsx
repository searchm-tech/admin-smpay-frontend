"use client";

import { Search, X } from "lucide-react";
import { type ChangeEvent, useState, forwardRef, useEffect } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Form Input
interface InputFormProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  suffix?: string;
  error?: string;
  showError?: boolean;
  preventSpaces?: boolean; // 띄어쓰기 방지 옵션 추가
}

function InputForm<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  suffix,
  error,
  showError = true,
  preventSpaces = false,
}: InputFormProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                type={type}
                className={`h-12 text-base ${
                  fieldState.error
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                } ${suffix ? "pr-32" : ""}`}
                placeholder={placeholder}
                {...field}
                onChange={
                  preventSpaces
                    ? (e) => {
                        const noSpace = e.target.value.replace(/\s+/g, "");
                        field.onChange(noSpace);
                      }
                    : field.onChange
                }
                onPaste={
                  preventSpaces
                    ? (e) => {
                        e.preventDefault();
                        const paste = e.clipboardData.getData("text");
                        const noSpace = paste.replace(/\s+/g, "");
                        field.onChange(noSpace);
                      }
                    : undefined
                }
                onKeyDown={
                  preventSpaces
                    ? (e) => {
                        // 스페이스바 입력 방지
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }
                    : undefined
                }
              />
              {suffix && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {suffix}
                </div>
              )}
            </div>
          </FormControl>
          {showError && (
            <>
              {error && field.value.length === 0 && (
                <div className="text-sm text-red-500 mt-1">{error}</div>
              )}
              <FormMessage className="text-sm text-red-500" />
            </>
          )}
        </FormItem>
      )}
    />
  );
}

// 검색 input
interface SearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const searchClass =
  "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground";

const SearchInput = ({
  value,
  onChange,
  placeholder,
  className,
  onKeyDown,
}: SearchInputProps) => {
  return (
    <div className={cn("relative w-full bg-white", className)}>
      <Input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder || "검색어를 입력해주세요."}
        className="pr-8"
      />

      {value ? (
        <X
          className={cn(searchClass, "cursor-pointer")}
          onClick={() =>
            onChange?.({
              target: { value: "" },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
      ) : (
        <Search className={searchClass} />
      )}
    </div>
  );
};

// phone input
interface PhoneInputProps {
  value?: string; // 전체 전화번호 "01012345678"
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = "", onChange, className }, ref) => {
    // 최초 value로부터만 초기값 분리, 이후에는 각 part가 독립적으로 동작
    const [part1, setPart1] = useState(value.slice(0, 3));
    const [part2, setPart2] = useState(value.slice(3, 7));
    const [part3, setPart3] = useState(value.slice(7, 11));

    // value가 외부에서 바뀔 때만 3개로 분리해서 세팅 (직접 입력 시에는 영향 없음)
    useEffect(() => {
      setPart1(value.slice(0, 3));
      setPart2(value.slice(3, 7));
      setPart3(value.slice(7, 11));
    }, [value]);

    // 각 인풋의 onChange는 해당 인풋만 변경, 3개를 합쳐서 onChange로 전달
    const handlePart1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const onlyNumber = e.target.value.replace(/\D/g, "").slice(0, 3);
      setPart1(onlyNumber);
      if (onChange) {
        onChange({
          ...e,
          target: { ...e.target, value: onlyNumber + part2 + part3 },
        });
      }
    };
    const handlePart2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const onlyNumber = e.target.value.replace(/\D/g, "").slice(0, 4);
      setPart2(onlyNumber);
      if (onChange) {
        onChange({
          ...e,
          target: { ...e.target, value: part1 + onlyNumber + part3 },
        });
      }
    };
    const handlePart3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const onlyNumber = e.target.value.replace(/\D/g, "").slice(0, 4);
      setPart3(onlyNumber);
      if (onChange) {
        onChange({
          ...e,
          target: { ...e.target, value: part1 + part2 + onlyNumber },
        });
      }
    };

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Input
          maxLength={3}
          value={part1}
          onChange={handlePart1Change}
          className="w-[80px] text-center"
          inputMode="numeric"
          ref={ref} // ref를 첫 번째 input에 연결
        />
        <span>-</span>
        <Input
          maxLength={4}
          value={part2}
          onChange={handlePart2Change}
          className="w-[80px] text-center"
          inputMode="numeric"
        />
        <span>-</span>
        <Input
          maxLength={4}
          value={part3}
          onChange={handlePart3Change}
          className="w-[80px] text-center"
          inputMode="numeric"
        />
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

// 숫자 입력 input
interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: string | number;
  onChange: (value: string) => void;
}

function NumberInput({ value, onChange, ...rest }: NumberInputProps) {
  return (
    <Input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
      {...rest}
    />
  );
}

// TODO : displayName 형식으로 모두 변경?
// suffix 있는 input
interface InputWithSuffixProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
  containerClassName?: string;
  preventSpaces?: boolean;
}

const InputWithSuffix = forwardRef<HTMLInputElement, InputWithSuffixProps>(
  ({ className, suffix, containerClassName, preventSpaces, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        <Input
          className={cn("pr-32", className)}
          ref={ref}
          {...props}
          preventSpaces={preventSpaces}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

InputWithSuffix.displayName = "InputWithSuffix";

export { InputForm, SearchInput, PhoneInput, NumberInput, InputWithSuffix };
