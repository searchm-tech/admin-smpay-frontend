import { useState } from "react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import {
  getLastMonth,
  getThisMonth,
  getLast7Days,
  getLastWeek,
  getThisWeek,
  getYesterday,
  formatOnlyDate,
} from "@/utils/format";
import { CalendarRangeComponent } from "@/components/composite/calendar-component";
import ManagementModal from "./modal/ManagementModal";

import type { DateRange } from "react-day-picker";

type Props = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  handleDate: (date: DateRange | undefined) => void;
  handleReset: () => void;
  isNotRecovery: boolean;
  handleRecovery: () => void;
  advertiserId: number;
  handleAdvertiserId: (advertiserId: number) => void;
};
const FilterSection = ({
  startDate,
  endDate,
  handleDate,
  handleReset,
  isNotRecovery,
  handleRecovery,
  advertiserId,
  handleAdvertiserId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = (advertiserIdValue: number) => {
    handleAdvertiserId(advertiserIdValue);
    setIsOpen(false);
  };

  return (
    <section className="pt-2 pb-5 border-b border-[#656565]">
      {isOpen && (
        <ManagementModal
          onClose={() => setIsOpen(false)}
          onConfirm={(advertiserIdValue) => handleConfirm(advertiserIdValue)}
          open={isOpen}
          advertiserId={advertiserId}
        />
      )}

      <div className="flex gap-2">
        <Button variant="cancel" onClick={handleReset}>
          초기화
        </Button>

        <Button variant="gray" onClick={() => setIsOpen(true)}>
          광고주 세부 검색
        </Button>
        <Button
          variant={isNotRecovery ? "gray" : "green"}
          onClick={handleRecovery}
        >
          미수/충전실패 광고주 검색 {isNotRecovery ? "해제" : ""}
        </Button>
      </div>

      <Separator className="my-4" variant="dotted" />

      <div className="flex gap-2">
        <CalendarRangeComponent
          date={{ from: startDate, to: endDate }}
          onChange={(data) => handleDate(data)}
          customText={
            startDate && endDate
              ? `${formatOnlyDate(startDate)} ~ ${formatOnlyDate(endDate)}`
              : "날짜를 선택해주세요"
          }
        />

        <Button variant="cancel" onClick={() => handleDate(getYesterday())}>
          어제
        </Button>
        <Button variant="cancel" onClick={() => handleDate(getThisWeek())}>
          이번주
        </Button>
        <Button variant="cancel" onClick={() => handleDate(getLastWeek())}>
          지난주
        </Button>
        <Button variant="cancel" onClick={() => handleDate(getLast7Days())}>
          최근7일
        </Button>
        <Button variant="cancel" onClick={() => handleDate(getThisMonth())}>
          이번달
        </Button>
        <Button variant="cancel" onClick={() => handleDate(getLastMonth())}>
          지난달
        </Button>
      </div>
    </section>
  );
};

export default FilterSection;
