"use client";
import { Fragment, useEffect } from "react";

import DesktopView from "./desktop";
import MobilewView from "./mobile";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  useAccountList,
  useAdvertiserMailVerification,
} from "@/hooks/queries/account";
import { ErrorComponent } from "../error";
import { useAccountStore } from "@/store/useAccountStore";
import LoadingUI from "@/components/common/Loading";

type Props = {
  authCode: string;
  advertiserId: number;
};

const AdvertiserVerificationView = ({ authCode, advertiserId }: Props) => {
  const { device } = useWindowSize();
  const { setAccountList } = useAccountStore();
  const { refetch } = useAccountList();

  const { data: isMailVerified, isPending } = useAdvertiserMailVerification(
    advertiserId,
    authCode
  );

  useEffect(() => {
    refetch().then(({ data }) => {
      setAccountList(data || []);
    });

    return () => {
      setAccountList([]);
    };
  }, []);

  if (isPending) {
    return <LoadingUI title="인증 중..." />;
  }

  if (!isMailVerified) {
    return <ErrorComponent message="유효하지 않은 인증 링크입니다." />;
  }

  return (
    <Fragment>
      {device === "desktop" ? (
        <DesktopView advertiserId={advertiserId} />
      ) : (
        <MobilewView advertiserId={advertiserId} />
      )}
    </Fragment>
  );
};

export default AdvertiserVerificationView;
