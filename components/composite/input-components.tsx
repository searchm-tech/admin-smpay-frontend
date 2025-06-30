"use client";

import { Search, X } from "lucide-react";
import {
  type ChangeEvent,
  useState,
  forwardRef,
  useEffect,
  useRef,
} from "react";
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
  value?: string; // 최초 마운트 시에만 사용
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

// 번호 분리 함수: 02로 시작하면 2-4-4, 아니면 3-4-4
function splitPhone(value: string) {
  const onlyNumber = value.replace(/\D/g, "");
  if (onlyNumber.startsWith("02")) {
    return [
      onlyNumber.slice(0, 2),
      onlyNumber.slice(2, 6),
      onlyNumber.slice(6, 10),
    ];
  } else {
    return [
      onlyNumber.slice(0, 3),
      onlyNumber.slice(3, 7),
      onlyNumber.slice(7, 11),
    ];
  }
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value = "", onChange, className }, ref) => {
    const [initialized, setInitialized] = useState(false);
    const [part1, setPart1] = useState("");
    const [part2, setPart2] = useState("");
    const [part3, setPart3] = useState("");

    // 최초 마운트 시에만 value로 초기화, 이후에는 내부 상태만 사용
    useEffect(() => {
      if (!initialized && value) {
        setPart1(value.slice(0, 3));
        setPart2(value.slice(3, 7));
        setPart3(value.slice(7, 11));
        setInitialized(true);
      }
    }, [value, initialized]);

    const handlePart1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, "").slice(0, 3);
      setPart1(v);
      if (onChange)
        onChange({ ...e, target: { ...e.target, value: v + part2 + part3 } });
    };
    const handlePart2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
      setPart2(v);
      if (onChange)
        onChange({ ...e, target: { ...e.target, value: part1 + v + part3 } });
    };
    const handlePart3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
      setPart3(v);
      if (onChange)
        onChange({ ...e, target: { ...e.target, value: part1 + part2 + v } });
    };

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Input
          maxLength={3}
          value={part1}
          onChange={handlePart1Change}
          className="w-[80px] text-center"
          inputMode="numeric"
          ref={ref}
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
