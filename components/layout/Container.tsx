import { useSidebar } from "@/components/ui/sidebar";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar();
  const { width } = useWindowSize();

  const widthClass = useMemo(() => {
    if (width > 1440) {
      return state === "expanded" ? "max-w-[89vw]" : "max-w-[98vw]";
    }

    if (width <= 1440) {
      return state === "expanded" ? "max-w-[85vw]" : "max-w-[97vw]";
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
