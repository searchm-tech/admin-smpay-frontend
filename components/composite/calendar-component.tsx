import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

interface CalendarRangePopoverProps {
  date: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  customText?: string;
}

function CalendarRangeComponent({
  date,
  onChange,
  placeholder = "날짜를 선택해주세요",
  className,
  customText,
}: CalendarRangePopoverProps) {
  const outputText = useMemo(() => {
    if (customText) return customText;
    if (date?.from && date?.to) {
      return `${format(date.from, "yyyy-MM-dd")} ~ ${format(date.to, "yyyy-MM-dd")}`;
    }
    if (date?.from) {
      return format(date.from, "yyyy-MM-dd");
    }
    return placeholder;
  }, [customText, date, placeholder]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] pl-3 text-left font-normal border-[#8D8D8D] bg-transparent hover:bg-transparent hover:text-[#6F6F6F]",
            !date?.from && "text-muted-foreground",
            className
          )}
        >
          {outputText}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white shadow-lg z-50"
        align="start"
      >
        <Calendar
          mode="range"
          selected={date}
          onSelect={onChange}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { CalendarRangeComponent };
