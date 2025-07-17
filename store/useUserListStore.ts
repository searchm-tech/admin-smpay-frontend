import { create } from "zustand";

interface UserListState {
  userList: number[];
  setUserList: (list: number[]) => void;
  selectAll: (all: number[]) => void;
  clear: () => void;
}

export const useUserListStore = create<UserListState>((set) => ({
  userList: [],
  setUserList: (list) => set({ userList: list }),
  selectAll: (all) => set({ userList: all }),
  clear: () => set({ userList: [] }),
}));
