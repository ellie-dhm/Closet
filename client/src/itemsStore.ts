import { create } from "zustand";
import { createItem, deleteItem, getItems, updateItem } from "./api";
import type { Item, ItemInput } from "./types";

const getMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Something went wrong";

type ItemsState = {
  items: Item[];
  loading: boolean;
  loadError: string | null;
  saving: boolean;
  saveError: string | null;
  busyIds: number[];
  actionError: string | null;

  load: () => Promise<void>;
  addItem: (data: ItemInput) => Promise<boolean>;
  editItem: (id: number, data: ItemInput) => Promise<boolean>;
  removeItem: (id: number) => Promise<void>;
  toggleFavorite: (item: Item) => Promise<void>;
  setSaveError: (message: string | null) => void;
};

export const useItemsStore = create<ItemsState>((set) => {
  async function withBusy(id: number, action: () => Promise<void>) {
    set((s) => ({ busyIds: [...s.busyIds, id], actionError: null }));
    try {
      await action();
    } catch (e) {
      set({ actionError: getMessage(e) });
    } finally {
      set((s) => ({ busyIds: s.busyIds.filter((x) => x !== id) }));
    }
  }

  return {
    items: [],
    loading: true,
    loadError: null,
    saving: false,
    saveError: null,
    busyIds: [],
    actionError: null,

    setSaveError: (message) => set({ saveError: message }),

    load: async () => {
      set({ loading: true, loadError: null });
      try {
        set({ items: await getItems() });
      } catch (e) {
        set({ loadError: getMessage(e) });
      } finally {
        set({ loading: false });
      }
    },

    addItem: async (data) => {
      set({ saving: true, saveError: null });
      try {
        const created = await createItem(data);
        set((s) => ({ items: [created, ...s.items] }));
        return true;
      } catch (e) {
        set({ saveError: getMessage(e) });
        return false;
      } finally {
        set({ saving: false });
      }
    },

    editItem: async (id, data) => {
      set({ saving: true, saveError: null });
      try {
        const updated = await updateItem(id, data);
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? updated : i)),
        }));
        return true;
      } catch (e) {
        set({ saveError: getMessage(e) });
        return false;
      } finally {
        set({ saving: false });
      }
    },

    removeItem: (id) =>
      withBusy(id, async () => {
        await deleteItem(id);
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
      }),

    toggleFavorite: (item) =>
      withBusy(item.id, async () => {
        const updated = await updateItem(item.id, {
          name: item.name,
          category: item.category,
          color: item.color,
          season: item.season,
          image_url: item.image_url,
          favorite: !item.favorite,
        });
        set((s) => ({
          items: s.items.map((i) => (i.id === item.id ? updated : i)),
        }));
      }),
  };
});
