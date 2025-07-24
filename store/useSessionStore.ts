// /store/sessionStore.ts
import { create } from "zustand";

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
  initializeFromStorage: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => {
  const prefix = getStoragePrefix();

  return {
    accessToken: null, // 초기값은 null로 설정
    refreshToken: null, // 초기값은 null로 설정
    setAccessToken: (token) => {
      set({ accessToken: token });
      if (typeof window !== "undefined") {
        if (token) {
          localStorage.setItem(`${prefix}accessToken`, token);
        } else {
          localStorage.removeItem(`${prefix}accessToken`);
        }
      }
    },
    setRefreshToken: (token) => {
      set({ refreshToken: token });
      if (typeof window !== "undefined") {
        if (token) {
          localStorage.setItem(`${prefix}refreshToken`, token);
        } else {
          localStorage.removeItem(`${prefix}refreshToken`);
        }
      }
    },
    clearSession: () => {
      set({ accessToken: null, refreshToken: null });
      if (typeof window !== "undefined") {
        localStorage.removeItem(`${prefix}accessToken`);
        localStorage.removeItem(`${prefix}refreshToken`);
      }
    },
    setTokens: (accessToken, refreshToken) => {
      set({ accessToken, refreshToken });
      if (typeof window !== "undefined") {
        if (accessToken) {
          localStorage.setItem(`${prefix}accessToken`, accessToken);
        } else {
          localStorage.removeItem(`${prefix}accessToken`);
        }
        if (refreshToken) {
          localStorage.setItem(`${prefix}refreshToken`, refreshToken);
        } else {
          localStorage.removeItem(`${prefix}refreshToken`);
        }
      }
    },
    initializeFromStorage: () => {
      if (typeof window !== "undefined") {
        const storedAccessToken = localStorage.getItem(`${prefix}accessToken`);
        const storedRefreshToken = localStorage.getItem(
          `${prefix}refreshToken`
        );

        if (storedAccessToken || storedRefreshToken) {
          set({
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken,
          });
        }
      }
    },
  };
});
