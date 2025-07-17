"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import AdvertiserView from "./advertiser";
import LicenseView from "./license";

import { LabelBullet } from "@/components/composite/label-bullet";
import { TabSwitch } from "@/components/composite/tab-switch";
import { ConfirmDialog } from "@/components/composite/modal-components";
import LoadingUI from "@/components/common/Loading";
import ContentHeader from "@/components/common/ContentHeader";

import { useQueryLicense } from "@/hooks/queries/license";
import { dialogContent } from "./constants";
import { ApiError } from "@/lib/api";

export type TLicenseInfo = {
  userId: number;
  agentId: number;
  customerId: number;
  apiKey: string;
  secretKey: string;
};

const NaverServiceView = () => {
  const { data: session } = useSession(); // TODO : 광고주 동의 이후 수정 필요

  const { isLoading, refetch } = useQueryLicense();

  const [isAdvertiserStep, setIsAdvertiserStep] = useState(false);
  const [licenseInfo, setLicenseInfo] = useState<TLicenseInfo | null>(null);
  const [isNoLicenseDialogOpen, setIsNoLicenseDialogOpen] = useState(false);

  const handleChangeStep = (value: boolean) => {
    if (value) {
      if (!licenseInfo) {
        setIsNoLicenseDialogOpen(true);
        return;
      } else {
        setIsAdvertiserStep(true);
      }
      setIsAdvertiserStep(true);
    } else {
      setIsAdvertiserStep(false);
    }
  };

  // 등록, 수정, 삭제 완료 후, 라이선스 정보 재호출
  const refetchLicense = () => {
    refetch().then((res) => {
      if (res.data) {
        setLicenseInfo({
          userId: res.data.userId,
          agentId: session?.user.agentId ?? 0,
          customerId: res.data.customerId,
          apiKey: res.data.accessLicense,
          secretKey: res.data.secretKey,
        });
        const { error } = res;
        // 데이터가 없을 시, 에러를 response 함.
        if (error instanceof ApiError && error.code === "104") {
          setLicenseInfo(null);
        }
      }
    });
  };

  useEffect(() => {
    if (!session?.user) return;
    refetchLicense();
  }, [session?.user]);

  return (
    <div>
      <ContentHeader
        title={isAdvertiserStep ? "네이버 광고주 등록" : "API 라이선스 등록"}
        items={[]}
      />
      {isLoading && <LoadingUI title="라이선스 정보 로딩 중..." />}
      {isNoLicenseDialogOpen && (
        <ConfirmDialog
          open
          confirmText="확인"
          cancelDisabled
          onConfirm={() => setIsNoLicenseDialogOpen(false)}
          content={dialogContent["no-license"]}
        />
      )}
      <LabelBullet labelClassName="text-base font-bold">정보 등록</LabelBullet>
      <TabSwitch
        value={isAdvertiserStep}
        onValueChange={handleChangeStep}
        leftLabel="API 라이선스 등록"
        rightLabel="광고주 등록"
      />
      {!isAdvertiserStep && (
        <LicenseView
          licenseInfo={licenseInfo}
          refetch={refetchLicense}
          moveToAdvertiser={() => setIsAdvertiserStep(true)}
        />
      )}
      {isAdvertiserStep && <AdvertiserView user={session?.user} />}
    </div>
  );
};

export default NaverServiceView;
