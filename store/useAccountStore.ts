import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Account } from "@/types/api/account";

type AccountStore = {
  accountList: Account[];
  setAccountList: (accountList: Account[]) => void;
};

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      accountList: [],
      setAccountList: (accountList) => set({ accountList }),
    }),
    {
      name: "account",
    }
  )
);
