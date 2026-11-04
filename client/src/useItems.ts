import { useCallback, useEffect, useState } from "react";
import { createItem, deleteItem, getItems, updateItem } from "./api";
import type { Item, ItemInput } from "./types";

const getMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Something went wrong";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [busyIds, setBusyIds] = useState<number[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setItems(await getItems());
    } catch (e) {
      setLoadError(getMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addItem(data: ItemInput) {
    setSaving(true);
    setSaveError(null);
    try {
      const created = await createItem(data);
      setItems((prev) => [created, ...prev]);
      return true;
    } catch (e) {
      setSaveError(getMessage(e));
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function editItem(id: number, data: ItemInput) {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await updateItem(id, data);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      return true;
    } catch (e) {
      setSaveError(getMessage(e));
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function withBusy(id: number, action: () => Promise<void>) {
    setBusyIds((prev) => [...prev, id]);
    setActionError(null);
    try {
      await action();
    } catch (e) {
      setActionError(getMessage(e));
    } finally {
      setBusyIds((prev) => prev.filter((x) => x !== id));
    }
  }

  const removeItem = (id: number) =>
    withBusy(id, async () => {
      await deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    });

  const toggleFavorite = (item: Item) =>
    withBusy(item.id, async () => {
      const updated = await updateItem(item.id, {
        name: item.name,
        category: item.category,
        color: item.color,
        season: item.season,
        image_url: item.image_url,
        favorite: !item.favorite,
      });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    });

  return {
    items,
    loading,
    loadError,
    load,
    saving,
    saveError,
    setSaveError,
    busyIds,
    actionError,
    addItem,
    editItem,
    removeItem,
    toggleFavorite,
  };
}
