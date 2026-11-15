import { useEffect, useState } from "react";
import { Shirt, SearchX } from "lucide-react";
import { useItemsStore } from "./itemsStore";
import { useUiStore } from "./uiStore";
import { useVisibleItems } from "./useVisibleItems";
import ItemForm from "./components/ItemForm";
import ItemCard from "./components/ItemCard";
import FilterBar from "./components/FilterBar";
import EmptyState from "./components/EmptyState";
import Dashboard from "./components/dashboard/Dashboard";
import "./styles/App.css";

type View = "wardrobe" | "dashboard";

function App() {
  const [view, setView] = useState<View>("wardrobe");
  const load = useItemsStore((s) => s.load);
  const loading = useItemsStore((s) => s.loading);
  const loadError = useItemsStore((s) => s.loadError);
  const actionError = useItemsStore((s) => s.actionError);
  const itemsCount = useItemsStore((s) => s.items.length);
  const favoritesCount = useItemsStore(
    (s) => s.items.filter((i) => i.favorite).length,
  );

  const editingId = useUiStore((s) => s.editing?.id);
  const resetFilters = useUiStore((s) => s.resetFilters);

  const visibleItems = useVisibleItems();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="app">
      <nav className="view-btn">
        <button
          className={view === "wardrobe" ? "active" : ""}
          onClick={() => setView("wardrobe")}
        >
          Wardrobe
        </button>
        <button
          className={view === "dashboard" ? "active" : ""}
          onClick={() => setView("dashboard")}
        >
          Dashboard
        </button>
      </nav>

      {view === "wardrobe" ? (
        <>
          <header className="app__header">
            <div>
              <h1>Closet</h1>
              <p>Your digital wardrobe</p>
            </div>
            {!loading && !loadError && (
              <dl className="app__stats">
                <div>
                  <dt>Pieces</dt>
                  <dd>{itemsCount}</dd>
                </div>
                <div>
                  <dt>Favorites</dt>
                  <dd>{favoritesCount}</dd>
                </div>
              </dl>
            )}
          </header>

          {!loading && !loadError && itemsCount > 0 && <FilterBar />}

          <div className="app__layout">
            <ItemForm key={editingId ?? "new"} />

            <main>
              {actionError && (
                <div className="banner banner--error">{actionError}</div>
              )}

              {loading ? (
                <div className="app__grid">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="skeleton" />
                  ))}
                </div>
              ) : loadError ? (
                <div className="banner banner--error">
                  {loadError}{" "}
                  <button className="btn" onClick={load}>
                    Retry
                  </button>
                </div>
              ) : itemsCount === 0 ? (
                <EmptyState
                  icon={<Shirt size={36} strokeWidth={1.5} />}
                  title="Your closet is empty"
                  message="Add your first piece using the form to start building your wardrobe."
                />
              ) : visibleItems.length === 0 ? (
                <EmptyState
                  icon={<SearchX size={36} strokeWidth={1.5} />}
                  title="No pieces match these filters"
                  message="Try a different combination, or clear the filters to see everything."
                  actionLabel="Clear filters"
                  onAction={resetFilters}
                />
              ) : (
                <div className="app__grid">
                  {visibleItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </>
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
