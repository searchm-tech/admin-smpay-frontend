import { useSidebar } from "@/components/ui/sidebar";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar();
  const { width } = useWindowSize();

  const widthClass = useMemo(() => {
    // 매우 큰 모니터 (1920px 초과)
    if (width > 1920) {
      return state === "expanded" ? "max-w-[95vw]" : "max-w-[99vw]";
    }

    // 큰 모니터 (1440px 초과)
    if (width > 1440) {
      return state === "expanded" ? "max-w-[92vw]" : "max-w-[98vw]";
    }

    // 중간 모니터 (1024px 초과)
    if (width > 1024) {
      return state === "expanded" ? "max-w-[88vw]" : "max-w-[97vw]";
    }

    // 작은 모니터 (1024px 이하)
    if (width <= 1024) {
      return state === "expanded" ? "max-w-[85vw]" : "max-w-[96vw]";
    }

    return "max-w-[98vw]";
  }, [width, state]);

  return (
    <div className={cn("flex-1 overflow-y-auto px-4 h-[100vh]", widthClass)}>
      {children}
    </div>
  );
};

export default Container;
