"use client";
import { Fragment, useEffect } from "react";

import DesktopView from "./desktop";
import MobilewView from "./mobile";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  useBankList,
  useAdvertiserMailVerification,
} from "@/hooks/queries/bank";
import { ErrorComponent } from "../error";
import { useBankStore } from "@/store/useBankStore";
import LoadingUI from "@/components/common/Loading";

type Props = {
  authCode: string;
  advertiserId: number;
};

const AdvertiserVerificationView = ({ authCode, advertiserId }: Props) => {
  const { device } = useWindowSize();
  const { setBankList } = useBankStore();
  const { refetch } = useBankList();

  const { data: isMailVerified, isPending } = useAdvertiserMailVerification(
    advertiserId,
    authCode
  );

  useEffect(() => {
    refetch().then(({ data }) => {
      setBankList(data || []);
    });

    return () => {
      setBankList([]);
    };
  }, []);

  if (isPending) {
    return <LoadingUI />;
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
