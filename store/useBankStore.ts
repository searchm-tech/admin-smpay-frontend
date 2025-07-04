import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bank } from "@/types/api/bank";

type BankStore = {
  bankList: Bank[];
  setBankList: (bankList: Bank[]) => void;
};

export const useBankStore = create<BankStore>()(
  persist(
    (set) => ({
      bankList: [],
      setBankList: (bankList) => set({ bankList }),
    }),
    {
      name: "account",
    }
  )
);
