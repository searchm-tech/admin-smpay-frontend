import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
} from "@/components/ui/select";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

const Select = ({
  options,
  value = "",
  onChange,
  placeholder = "선택해주세요",
  className = "",
  disabled = false,
}: SelectProps) => {
  return (
    <ShadcnSelect value={value} onValueChange={onChange} disabled={disabled}>
      <ShadcnSelectTrigger className={className} disabled={disabled}>
        <ShadcnSelectValue placeholder={placeholder} />
      </ShadcnSelectTrigger>
      <ShadcnSelectContent>
        {options.map((option: SelectOption) => (
          <ShadcnSelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={
              option.disabled
                ? "text-muted-foreground hover:cursor-not-allowed data-[disabled]:pointer-events-auto"
                : ""
            }
          >
            <span className={option.disabled ? "line-through" : ""}>
              {option.label}
            </span>
            {option.disabled && (
              <span className="ml-2 text-xs no-underline">
                (최상위 그룹장 등록 완료)
              </span>
            )}
          </ShadcnSelectItem>
        ))}
      </ShadcnSelectContent>
    </ShadcnSelect>
  );
};

export default Select;
