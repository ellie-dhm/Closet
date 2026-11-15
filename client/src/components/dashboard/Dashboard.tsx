import { useEffect } from "react";
import { SearchX } from "lucide-react";
import { useDashboardStore } from "../../dashboardStore";
import StatCard from "./StatCard";
import CategoryDonut from "./CategoryDonut";
import SeasonBar from "./SeasonBar";
import GrowthLine from "./GrowthLine";
import DashboardFilters from "./DashboardFilters";
import EmptyState from "../EmptyState";
import "../../styles/Dashboard.css";

export default function Dashboard() {
  const { stats, loading, error, fetchStats, resetFilters } =
    useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <section className={`dashboard ${loading && stats ? "is-refreshing" : ""}`}>
      <h2>Wardrobe insights</h2>

      <DashboardFilters />

      {error ? (
        <div className="banner banner--error">
          Couldn't load stats: {error}{" "}
          <button className="btn" onClick={fetchStats}>
            Retry
          </button>
        </div>
      ) : !stats ? (
        <>
          <div className="stat-grid">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton" style={{ height: 90 }} />
            ))}
          </div>
          <div className="chart-grid">
            <div className="skeleton" style={{ height: 340 }} />
            <div className="skeleton" style={{ height: 340 }} />
          </div>
        </>
      ) : stats.summary.total === 0 ? (
        <EmptyState
          icon={<SearchX size={36} strokeWidth={1.5} />}
          title="No pieces match these filters"
          message="Try a different combination, or clear the filters to see everything."
          actionLabel="Clear filters"
          onAction={resetFilters}
        />
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Total items" value={stats.summary.total} />
            <StatCard label="Favorites" value={stats.summary.favorites} />
            <StatCard
              label="Top category"
              value={stats.summary.topCategory ?? "-"}
            />
            <StatCard label="Top color" value={stats.summary.topColor ?? "-"} />
          </div>

          <div className="chart-grid">
            <CategoryDonut data={stats.byCategory} />
            <SeasonBar data={stats.bySeason} />
            <GrowthLine data={stats.timeline} />
          </div>
        </>
      )}
    </section>
  );
}
