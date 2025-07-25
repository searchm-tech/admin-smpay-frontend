"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/store/useSessionStore";

export default function StoreInitializer() {
  const initializeFromStorage = useSessionStore(
    (state) => state.initializeFromStorage
  );

  useEffect(() => {
    // 클라이언트 사이드에서 localStorage에서 토큰 초기화
    initializeFromStorage();
  }, [initializeFromStorage]);

  return null; // 이 컴포넌트는 렌더링하지 않음
}
