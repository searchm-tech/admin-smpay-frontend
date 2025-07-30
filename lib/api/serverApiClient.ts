// lib/api/server.ts (새 파일)
import axios from "axios";

// 서버 전용 API 클라이언트
const serverApiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/core`,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 서버 전용 get 함수 (토큰을 파라미터로 받음)
export const get = async <T = any>(
  url: string,
  accessToken: string
): Promise<T> => {
  try {
    const response = await serverApiClient.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.code !== "0") {
      throw new Error(response.data.message);
    }

    return response.data.result;
  } catch (error: any) {
    console.error("서버 API 호출 실패:", error);
    throw error;
  }
};
