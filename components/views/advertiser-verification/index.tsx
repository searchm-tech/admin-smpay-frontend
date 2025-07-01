"use client";
import { Fragment } from "react";

import DesktopView from "./desktop";
import MobilewView from "./mobile";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useAdvertiserMailVerification } from "@/hooks/queries/account";
import { ErrorComponent } from "../error";

type Props = {
  authCode: string;
  advertiserId: number;
};

const AdvertiserVerificationView = ({ authCode, advertiserId }: Props) => {
  const { device } = useWindowSize();

  const { data: isMailVerified } = useAdvertiserMailVerification(
    advertiserId,
    authCode
  );

  if (isMailVerified) {
    return <ErrorComponent message="유효하지 않은 인증 링크입니다." />;
  }

  return (
    <Fragment>
      {device === "desktop" ? (
        <DesktopView advertiserId={advertiserId} />
      ) : (
        <MobilewView />
      )}
    </Fragment>
  );
};

export default AdvertiserVerificationView;
