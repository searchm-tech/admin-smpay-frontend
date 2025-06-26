import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  preventSpaces?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      preventSpaces = false,
      onChange,
      onPaste,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (preventSpaces) {
          const noSpace = e.target.value.replace(/\s+/g, "");
          e.target.value = noSpace;
        }
        onChange?.(e);
      },
      [preventSpaces, onChange]
    );

    const handlePaste = React.useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        if (preventSpaces) {
          e.preventDefault();
          const paste = e.clipboardData.getData("text");
          const noSpace = paste.replace(/\s+/g, "");
          const target = e.target as HTMLInputElement;
          target.value = noSpace;
          // onChange 이벤트를 수동으로 트리거
          const changeEvent = new Event("input", { bubbles: true });
          target.dispatchEvent(changeEvent);
        }
        onPaste?.(e);
      },
      [preventSpaces, onPaste]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (preventSpaces && e.key === " ") {
          e.preventDefault();
        }
        onKeyDown?.(e);
      },
      [preventSpaces, onKeyDown]
    );

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-[#8D8D8D] text-[#000000] placeholder:text-[#8D8D8D] disabled:bg-[#D2D2D2]",
          className
        )}
        ref={ref}
        onChange={handleChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
