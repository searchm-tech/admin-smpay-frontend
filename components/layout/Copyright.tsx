import { cn } from "@/lib/utils";

type CopyrightProps = {
  className?: string;
};

const Copyright = ({ className }: CopyrightProps) => {
  return (
    <div className={cn("text-center text-xs text-gray-400", className)}>
      <p>© 2025.</p>
      <p>SM Pay. All rights reserved.</p>
    </div>
  );
};

export default Copyright;
