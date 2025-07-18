import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { CalendarRangeComponent } from "@/components/composite/calendar-component";
import { SelectSearch } from "@/components/composite/select-search";

import { useQuerySmPayAdminChargeRecoveryAdvertiserList as useGetAdvertiserList } from "@/hooks/queries/advertiser";
import { useQuerySmPayAdminChargeRecoveryAgencyList as useGetAgencyList } from "@/hooks/queries/agency";
import type { DateRange } from "react-day-picker";
import {
  getLastMonth,
  getThisMonth,
  getLast7Days,
  getLastWeek,
  getThisWeek,
  getYesterday,
} from "@/utils/format";

type Props = {
  selectedAgency: string;
  selectedAdvertiser: string;
  handleSelectAgency: (value: string) => void;
  handleSelectAdvertiser: (value: string) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
  handleDate: (date: DateRange | undefined) => void;
  handleReset: () => void;
  isNotRecovery: boolean;
  handleRecovery: () => void;
};
const FilterSection = ({
  selectedAgency,
  selectedAdvertiser,
  handleSelectAgency,
  handleSelectAdvertiser,
  startDate,
  endDate,
  handleDate,
  handleReset,
  isNotRecovery,
  handleRecovery,
}: Props) => {
  const { data: advertiserList = [] } = useGetAdvertiserList();
  const { data: agencyList = [] } = useGetAgencyList();

  return (
    <section className="pt-2 pb-5 border-b border-[#656565]">
      <div className="flex gap-2">
        <SelectSearch
          className="w-[200px]"
          options={agencyList?.map((agency) => ({
            label: `${agency.name} | ${agency.representativeName}`,
            value: agency.uniqueCode,
          }))}
          value={selectedAgency}
          onValueChange={handleSelectAgency}
          placeholder="대행사를 선택하세요"
          searchPlaceholder="대행사명, 대표자명을 입력하세요"
        />

        <SelectSearch
          className="w-[200px]"
          options={advertiserList?.map((advertiser) => ({
            label: `${advertiser.id} | ${advertiser.name}`,
            value: advertiser.advertiserId.toString(),
          }))}
          value={selectedAdvertiser}
          onValueChange={handleSelectAdvertiser}
          placeholder="광고주를 선택하세요"
          searchPlaceholder="광고 ID, 광고 계정을 입력하세요"
        />

        <Button variant="cancel" onClick={handleReset}>
          초기화
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

const formatOnlyDate = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};
