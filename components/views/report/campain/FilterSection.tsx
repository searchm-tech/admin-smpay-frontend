import { useState } from "react";
import { FileDown } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/composite/input-components";
import { CalendarRangeComponent } from "@/components/composite/calendar-component";
import { formatDate } from "../ad-group/constants";
import type { DateRange } from "react-day-picker";

import {
  getLast7Days,
  getLastMonth,
  getLastWeek,
  getThisMonth,
  getThisWeek,
  getYesterday,
} from "./constants";
import ManagementModal from "../modal/ManagementModal";
import type { TableParams } from "@/types/table";
import { postCampaignReportExcel } from "@/services/report";
import { useSession } from "next-auth/react";
import { useUserListStore } from "@/store/useUserListStore";
import { ConfirmDialog } from "@/components/composite/modal-components";

type Props = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  handleDate: (date: DateRange | undefined) => void;
  handleReset: () => void;
  handleAdvertiserIds: (advertiserIds: number[]) => void;
  advertiserIds: number[];
};
const FilterSection = ({
  startDate,
  endDate,
  handleDate,
  handleReset,
  handleAdvertiserIds,
  advertiserIds,
}: Props) => {
  const { data: session } = useSession();
  const { userList } = useUserListStore();

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadExcel = async () => {
    if (!session) return;

    if (userList.length === 0) {
      setError("광고주 세부 검색에서 마케터를 선택해주세요");
      return;
    }

    const blob = await postCampaignReportExcel(session.user, {
      userIds: userList,
      startDate: startDate ? formatDate(startDate) : "",
      endDate: endDate ? formatDate(endDate) : "",
    });

    // 다운로드 트리거
    const fileName = "report.xlsx";
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="pt-2 pb-5 border-b border-[#656565]">
      {error && (
        <ConfirmDialog
          open
          onConfirm={() => setError(null)}
          content={error}
          confirmText="확인"
          cancelDisabled
        />
      )}
      <ManagementModal
        open={isOpen}
        advertiserIds={advertiserIds}
        onClose={() => setIsOpen(false)}
        onConfirm={(advertiserIdsValue) => {
          handleAdvertiserIds(advertiserIdsValue);
          setIsOpen(false);
        }}
      />

      <div className="flex gap-2">
        <Button variant="gray" onClick={() => setIsOpen(true)}>
          광고주 세부 검색
        </Button>

        <Button variant="cancel" onClick={handleReset}>
          초기화
        </Button>
      </div>

      <Separator className="my-4" variant="dotted" />

      <div className="flex gap-2">
        <CalendarRangeComponent
          date={{ from: startDate, to: endDate }}
          onChange={(data) => handleDate(data)}
          customText={
            startDate && endDate
              ? `${formatDate(startDate)} ~ ${formatDate(endDate)}`
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
        <Button variant="cancel" size="icon" onClick={handleDownloadExcel}>
          <FileDown />
        </Button>
      </div>
    </section>
  );
};

export default FilterSection;
