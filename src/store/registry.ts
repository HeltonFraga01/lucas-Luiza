import { create } from "zustand";
import { GiftFilters } from "@/types";

interface RegistryStore {
  filters: GiftFilters;
  setFilter: <K extends keyof GiftFilters>(key: K, value: GiftFilters[K]) => void;
  resetFilters: () => void;
}

const defaultFilters: GiftFilters = {
  category: "Todos",
  showPurchased: true,
  onlyMostWanted: false,
};

export const useRegistryStore = create<RegistryStore>((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
