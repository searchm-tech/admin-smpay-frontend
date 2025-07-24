import { useSidebar } from "@/components/ui/sidebar";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { state } = useSidebar();
  const { width } = useWindowSize();

  const widthClass = "max-w-[98vw]";

  return (
    <div className={cn("flex-1 overflow-y-auto px-4 h-[100vh]", widthClass)}>
      {children}
    </div>
  );
};

export default Container;
