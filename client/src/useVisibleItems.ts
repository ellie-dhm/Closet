import { useMemo } from "react";
import { useItemsStore } from "./itemsStore";
import { useUiStore } from "./uiStore";

export function useVisibleItems() {
  const items = useItemsStore((s) => s.items);
  const filters = useUiStore((s) => s.filters);

  return useMemo(
    () =>
      items.filter((item) => {
        if (filters.category !== "all" && item.category !== filters.category)
          return false;
        // an item marked "all" is a year-round piece, so it matches every season
        if (
          filters.season !== "all" &&
          item.season !== filters.season &&
          item.season !== "all"
        )
          return false;
        if (
          filters.color !== "all" &&
          item.color.trim().toLowerCase() !== filters.color
        )
          return false;
        if (filters.favoritesOnly && !item.favorite) return false;
        return true;
      }),
    [items, filters],
  );
}
