import { create } from "zustand";
import { DEFAULT_FILTERS } from "./types";
import type { Filters, Item } from "./types";
import { useItemsStore } from "./itemsStore";

type UiState = {
  filters: Filters;
  editing: Item | null;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  startEdit: (item: Item) => void;
  cancelEdit: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  filters: DEFAULT_FILTERS,
  editing: null,

  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  startEdit: (item) => {
    useItemsStore.getState().setSaveError(null);
    set({ editing: item });
  },
  cancelEdit: () => {
    useItemsStore.getState().setSaveError(null);
    set({ editing: null });
  },
}));
