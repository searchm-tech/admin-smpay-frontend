import ContentHeader from "@/components/common/ContentHeader";
import SMPayMasterApplyWriteForm from "@/components/views/sm-pay/manangement/apply-write/form";
import type { DashboardSubItem } from "@/types/menu";
import type { Metadata } from "next";

type PageParams = {
  slug: string;
};

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  return {
    title: `SM-Pay 신청 : ${params.slug}`,
  };
}

export default function SMPayApplyWriteFormPage({
  params,
}: {
  params: PageParams;
}) {
  const breadcrumbItems: DashboardSubItem[] = [
    {
      title: "SM Pay",
      url: "/sm-pay/management",
    },
    {
      title: "SM Pay관리",
      url: "/sm-pay/management",
    },
    {
      title: "SM Pay 신청",
      url: `/sm-pay/management/apply-write/${params.slug}`,
    },
  ];

  return (
    <div>
      <ContentHeader title="SM Pay 신청서 작성" items={breadcrumbItems} />
      <SMPayMasterApplyWriteForm id={Number(params.slug)} />
    </div>
  );
}
