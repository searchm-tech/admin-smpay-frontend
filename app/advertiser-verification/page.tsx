import AdvertiserVerificationView from "@/components/views/advertiser-verification";

export default function AdvertiserVerificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const authCode = searchParams.code as string;
  const advertiserId = searchParams.advertiserId as string;

  return (
    <AdvertiserVerificationView
      authCode={authCode}
      advertiserId={Number(advertiserId)}
    />
  );
}
