import { CATEGORIES, SEASONS } from "../types";
import type { Category, Filters, Season } from "../types";
import { useItemsStore } from "../itemsStore";
import { useUiStore } from "../uiStore";
import "../styles/FilterBar.css";

export default function FilterBar() {
  const items = useItemsStore((s) => s.items);
  const filters = useUiStore((s) => s.filters);
  const setFilters = useUiStore((s) => s.setFilters);
  const resetFilters = useUiStore((s) => s.resetFilters);
  // how many items per category, for the chip counts
  const counts: Partial<Record<Category, number>> = {};
  for (const item of items) {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
  }

  // distinct colors that actually exist in the closet
  const colors = [
    ...new Set(items.map((i) => i.color.trim().toLowerCase()).filter(Boolean)),
  ].sort();
  // keep the selected color in the list even if its last item was deleted
  if (filters.color !== "all" && !colors.includes(filters.color)) {
    colors.push(filters.color);
  }

  const isFiltered =
    filters.category !== "all" ||
    filters.season !== "all" ||
    filters.color !== "all" ||
    filters.favoritesOnly;

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters({ ...filters, [key]: value });
  }

  return (
    <section className="filters" aria-label="Filters">
      <div className="filters__row">
        <select
          aria-label="Category"
          value={filters.category}
          onChange={(e) => set("category", e.target.value as Category | "all")}
        >
          <option value="all">All categories ({items.length})</option>
          {/* only categories you own, plus the selected one */}
          {CATEGORIES.filter((c) => counts[c] || c === filters.category).map(
            (c) => (
              <option key={c} value={c}>
                {c} ({counts[c] ?? 0})
              </option>
            ),
          )}
        </select>

        <select
          aria-label="Season"
          value={filters.season}
          onChange={(e) => set("season", e.target.value as Season | "all")}
        >
          <option value="all">Any season</option>
          {SEASONS.filter((s) => s !== "all").map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          aria-label="Color"
          value={filters.color}
          onChange={(e) => set("color", e.target.value)}
        >
          <option value="all">Any color</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          className={`chip ${filters.favoritesOnly ? "chip--active" : ""}`}
          aria-pressed={filters.favoritesOnly}
          onClick={() => set("favoritesOnly", !filters.favoritesOnly)}
        >
          ★ Favorites
        </button>

        {isFiltered && (
          <button className="filters__clear" onClick={resetFilters}>
            Clear filters
          </button>
        )}
      </div>
    </section>
  );
}
