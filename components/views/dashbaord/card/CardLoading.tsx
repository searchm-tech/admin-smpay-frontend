import { Loader2 } from "lucide-react";

export function CardLoading() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/20 rounded-xl">
      <Loader2 className="size-12 text-blue-500 animate-spin mb-2" />
      <p className="text-gray-600 font-semibold text-lg">로딩 중</p>
    </div>
  );
}
