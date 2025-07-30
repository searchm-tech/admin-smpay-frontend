import ChannelTalkBoot from "@/components/common/ChannelTalkBoot";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ChannelTalkBoot />
      {children}
    </div>
  );
}
