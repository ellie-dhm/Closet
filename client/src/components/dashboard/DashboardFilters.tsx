import { useDashboardStore } from "../../dashboardStore"; // match your store path

// Reuse your shared lists from types.ts if you export them
const SEASONS = ["spring", "summer", "autumn", "winter"];
const CATEGORIES = [
  "top",
  "bottom",
  "dress",
  "outerwear",
  "shoes",
  "accessory",
  "hijab",
  "abaya",
];

const isoDaysAgo = (days: number) =>
  new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

export default function DashboardFilters() {
  const filters = useDashboardStore((s) => s.filters);
  const setFilters = useDashboardStore((s) => s.setFilters);
  const resetFilters = useDashboardStore((s) => s.resetFilters);

  const hasFilters = Object.values(filters).some(Boolean);

  const presets = [
    { label: "Last 30 days", from: isoDaysAgo(30) },
    { label: "Last 90 days", from: isoDaysAgo(90) },
    { label: "All time", from: "" },
  ];

  return (
    <div className="dash-filters">
      <div className="dash-filters__row">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.season}
          onChange={(e) => setFilters({ season: e.target.value })}
          aria-label="Filter by season"
        >
          <option value="">Any season</option>
          {SEASONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <label className="dash-filters__date">
          From
          <input
            type="date"
            value={filters.from}
            max={filters.to || undefined}
            onChange={(e) => setFilters({ from: e.target.value })}
          />
        </label>

        <label className="dash-filters__date">
          To
          <input
            type="date"
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => setFilters({ to: e.target.value })}
          />
        </label>

        {hasFilters && (
          <button className="filters__clear" onClick={resetFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="dash-filters__row">
        {presets.map((p) => {
          const active = filters.from === p.from && !filters.to;
          return (
            <button
              key={p.label}
              className={`chip ${active ? "chip--active" : ""}`}
              onClick={() => setFilters({ from: p.from, to: "" })}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
