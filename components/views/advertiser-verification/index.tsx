"use client";
import { Fragment } from "react";

import DesktopView from "./desktop";
import MobilewView from "./mobile";
import { useWindowSize } from "@/hooks/useWindowSize";

type Props = {
  authCode: string;
  advertiserId: number;
};

const AdvertiserVerificationView = ({ authCode, advertiserId }: Props) => {
  const { device } = useWindowSize();

  return (
    <Fragment>
      {device === "desktop" ? <DesktopView /> : <MobilewView />}
    </Fragment>
  );
};

export default AdvertiserVerificationView;
