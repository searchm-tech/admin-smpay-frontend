import { ApiError } from "@/lib/api";
import { get as serverGet } from "@/lib/api/serverApiClient";
import type { TResponseMenu } from "@/types/api/menu";

// 서버용 메뉴 조회 API (MU001)
export const getMenuApiServer = async (
  accessToken: string
): Promise<TResponseMenu> => {
  try {
    const response = await serverGet<TResponseMenu>(
      "/api/v1/menus",
      accessToken
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
};
