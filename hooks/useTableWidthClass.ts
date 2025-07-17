import { useMemo } from "react";

// TODO : 대기
export function useTableWidthClass(width: number, state: string) {
  return useMemo(() => {
    if (state === "expanded" && width > 1440) {
      return "w-[85vw]";
    }
    if (state === "expanded" && width <= 1440) {
      return "max-w-[1200px]";
    }
    if (state === "collapsed" && width > 1440) {
      return "w-[95vw]";
    }
    if (state === "collapsed" && width <= 1440) {
      return "max-w-[1360px]";
    }
    return "w-full";
  }, [width, state]);
}
