// src/api/axios.ts
import axios, { AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import { signOut } from "next-auth/react";
import { postRefreshTokenApi } from "@/services/auth";
import { useSessionStore } from "@/store/useSessionStore";
import type { ApiResponse } from "@/types/api";

// 커스텀 에러 클래스
export class ApiError extends Error {
  code: string;
  result: any;

  constructor(code: string, message: string, result?: any) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.result = result;
  }
}

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/core`,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

// axios-retry 설정
axiosRetry(apiClient, {
  retries: 0, // 재시도 없음
  retryDelay: (retryCount) => {
    return retryCount * 1000; // 각 재시도마다 1초씩 증가
  },
  // TODO : 네트워크가 여러번 실행되는경우 - 그때  사용
  // retryCondition: (error) => {
  //   // 500번대 서버 에러나 네트워크 에러일 때만 재시도
  //   return (
  //     axiosRetry.isNetworkOrIdempotentRequestError(error) ||
  //     (error.response?.status ?? 0) >= 500
  //   );
  // },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
  },
});

// // API 요청 카운터 : 네트워크가 여러번 실행되는경우 - 그때  사용
// let requestCount = 0;
// const MAX_REQUESTS = 5;

// // 요청 인터셉터
// apiClient.interceptors.request.use(
//   (config) => {
//     if (requestCount >= MAX_REQUESTS) {
//       return Promise.reject(new Error("API 요청 횟수 초과"));
//     }
//     requestCount++;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 요청 인터셉터 (항상 최신 세션의 accessToken 사용)
apiClient.interceptors.request.use(
  (config) => {
    if (config.url?.includes("/token/refresh")) {
      return config;
    }

    const { accessToken } = useSessionStore.getState();

    // TODO : 디버깅용 로그 (필요시 활성화) - sentry 적용
    // console.log('🔑 Current token:', accessToken?.slice(0, 20) + '...');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 토큰 갱신 중복 방지를 위한 변수들
let isRefreshing = false;
let refreshTokenPromise: Promise<any> | null = null;

// 응답 인터셉터 (토큰 만료 시 재발급 및 세션 동기화)
apiClient.interceptors.response.use(
  (response) => {
    // Blob 다운로드 예외처리
    if (response.config.responseType === "blob") {
      return response;
    }
    if (response?.data?.code === "80") {
      // 권한 없음 - 직접 모달 처리를 위해 전역 이벤트 발생
      window.dispatchEvent(
        new CustomEvent("authError", {
          detail: { code: "80", message: "인가권한이 없는 화면입니다." },
        })
      );
      const { code, message, result } = response.data;
      throw new ApiError(code, message, result);
    }

    if (response.data && response.data.code !== "0") {
      const error = new ApiError(
        response.data.code,
        response.data.message,
        response.data.result
      );
      return Promise.reject(error);
    }
    return response.data;
  },
  async (error) => {
    if (error.response?.data?.code === "70") {
      const { refreshToken, setTokens } = useSessionStore.getState();

      if (!refreshToken) {
        const { clearSession } = useSessionStore.getState();
        await signOut({ callbackUrl: "/sign-in" });
        clearSession();
        return Promise.reject(error);
      }

      // 이미 토큰 갱신 중이면 기존 Promise를 재사용
      if (isRefreshing && refreshTokenPromise) {
        try {
          await refreshTokenPromise;
          // 토큰 갱신이 완료되면 원래 요청을 재시도
          return apiClient.request(error.config);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // 토큰 갱신 시작
      isRefreshing = true;
      refreshTokenPromise = postRefreshTokenApi({ refreshToken })
        .then((res) => {
          setTokens(res.accessToken.token, res.refreshToken.token);
          return res;
        })
        .catch(async (err) => {
          const { clearSession } = useSessionStore.getState();
          await signOut({ callbackUrl: "/sign-in" });
          clearSession();
          throw err;
        })
        .finally(() => {
          isRefreshing = false;
          refreshTokenPromise = null;
        });

      try {
        await refreshTokenPromise;
        // 토큰 갱신 성공 시 원래 요청 재시도
        return apiClient.request(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // if (error.response?.data?.code === "60") {
    //   const { clearSession } = useSessionStore.getState();
    //   await signOut({ callbackUrl: "/sign-in" });
    //   clearSession();
    //   return Promise.reject(error);
    // }

    if (error.response && error.response.data) {
      const { code, message, result } = error.response.data;
      throw new ApiError(code, message, result);
    }
    return Promise.reject(error);
  }
);

export const get = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = (await apiClient.get(url, config)) as ApiResponse<T>;
    return res.result;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("UNKNOWN", error.message);
  }
};

export const post = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = (await apiClient.post(url, data, config)) as ApiResponse<T>;
    return res.result;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("UNKNOWN", error.message);
  }
};

export const postBlob = async (
  url: string,
  data?: any,
  config?: any
): Promise<Blob> => {
  const response = await apiClient.post(url, data, {
    ...config,
    responseType: "blob",
  });
  return response.data;
};

export const patch = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = (await apiClient.patch(url, data, config)) as ApiResponse<T>;
    return res.result;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("UNKNOWN", error.message);
  }
};

export const put = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = (await apiClient.put(url, data, config)) as ApiResponse<T>;
    return res.result;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("UNKNOWN", error.message);
  }
};

export const del = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = (await apiClient.delete(url, config)) as ApiResponse<T>;
    return res.result;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("UNKNOWN", error.message);
  }
};

export default apiClient;
