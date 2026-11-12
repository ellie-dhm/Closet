import { useEffect } from "react";
import { useItemsStore } from "./itemsStore";
import { useUiStore } from "./uiStore";
import { useVisibleItems } from "./useVisibleItems";
import ItemForm from "./components/ItemForm";
import ItemCard from "./components/ItemCard";
import FilterBar from "./components/FilterBar";
import "./styles/App.css";

function App() {
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
            <p className="empty">Your closet is empty. Add your first item.</p>
          ) : visibleItems.length === 0 ? (
            <p className="empty">
              No pieces match these filters.{" "}
              <button className="btn" onClick={resetFilters}>
                Clear filters
              </button>
            </p>
          ) : (
            <div className="app__grid">
              {visibleItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
