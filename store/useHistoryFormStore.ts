import { create } from "zustand";

type FormState = {
  formId: number;
  advertiserId: number;
};

interface HistoryFormState {
  formState: FormState | null;
  setFormState: (formState: FormState | null) => void;
}

export const useHistoryFormStore = create<HistoryFormState>((set) => ({
  formState: null,
  setFormState: (formState) => set({ formState }),
}));
