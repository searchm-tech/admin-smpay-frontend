export type RequestAgentUser = {
  agentId: number;
  userId: number;
};

// Auth AgentUser 타입에 advertiserId 추가
export type WithAdvertiserId = {
  user: RequestAgentUser;
  advertiserId: number;
};

// Auth가 아닌
export type UserAgentAdvertiserId = {
  agentId: number;
  userId: number;
  advertiserId: number;
};

export type RequestWithPagination = {
  page: number;
  size: number;
  keyword: string;
};

export type ResponseWithPagination = {
  page: number;
  size: number;
  totalCount: number;
};
