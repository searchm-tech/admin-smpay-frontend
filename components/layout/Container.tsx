import { cn } from "@/lib/utils";

const Container = ({ children }: { children: React.ReactNode }) => {
  const widthClass = "max-w-[98vw]";

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden px-4 h-[100vh]",
        widthClass
      )}
    >
      {children}
    </div>
  );
};

export default Container;
