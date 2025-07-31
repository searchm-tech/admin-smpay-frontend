// /store/sessionStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 프론트엔드 타입에 따른 키 접두사
const getStoragePrefix = () => {
  // 환경변수나 다른 방법으로 프론트엔드 타입 구분
  // 예: NEXT_PUBLIC_FRONTEND_TYPE=admin 또는 service
  const frontendType = process.env.NEXT_PUBLIC_FRONTEND_TYPE || "admin";
  return `${frontendType}_`;
};

interface SessionState {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  clearSession: () => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (token) => {
        set({ accessToken: token });
      },
      setRefreshToken: (token) => {
        set({ refreshToken: token });
      },
      clearSession: () => {
        set({ accessToken: null, refreshToken: null });
      },
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },
    }),
    {
      name: `${getStoragePrefix()}session-storage`,
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage: () => (state) => {
        // console.log("🔄 Session Store 복원 완료:", {
        //   accessToken: state?.accessToken
        //     ? `${state.accessToken.slice(0, 20)}...`
        //     : "null",
        //   refreshToken: state?.refreshToken
        //     ? `${state.refreshToken.slice(0, 20)}...`
        //     : "null",
        // });
      },
    }
  )
);
