"use client";

import ViewList from "./ViewList";

import GuidSection from "@/components/views/sm-pay/components/GuideSection";

const SMPayMasterApplyWriteView = () => {
  return (
    <div className="flex flex-col gap-4">
      <GuidSection viewType="guide" />
      <ViewList />
    </div>
  );
};

export default SMPayMasterApplyWriteView;
