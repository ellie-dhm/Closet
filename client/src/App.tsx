import { useState } from "react";
import { useItems } from "./useItems";
import ItemForm from "./components/ItemForm";
import ItemCard from "./components/ItemCard";
import FilterBar from "./components/FilterBar";
import { DEFAULT_FILTERS } from "./types";
import type { Filters, Item, ItemInput } from "./types";
import "./styles/App.css";

function App() {
  const {
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
  } = useItems();

  const [editing, setEditing] = useState<Item | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const visibleItems = items.filter((item) => {
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
  });

  const favoritesCount = items.filter((i) => i.favorite).length;

  async function handleSubmit(data: ItemInput) {
    if (editing) {
      const ok = await editItem(editing.id, data);
      if (ok) setEditing(null);
      return ok;
    }
    return addItem(data);
  }

  function startEdit(item: Item) {
    setSaveError(null);
    setEditing(item);
  }

  function cancelEdit() {
    setSaveError(null);
    setEditing(null);
  }

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
              <dd>{items.length}</dd>
            </div>
            <div>
              <dt>Favorites</dt>
              <dd>{favoritesCount}</dd>
            </div>
          </dl>
        )}
      </header>

      {!loading && !loadError && items.length > 0 && (
        <FilterBar items={items} filters={filters} onChange={setFilters} />
      )}

      <div className="app__layout">
        <ItemForm
          key={editing?.id ?? "new"}
          editing={editing}
          saving={saving}
          error={saveError}
          onSubmit={handleSubmit}
          onCancel={cancelEdit}
        />

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
          ) : items.length === 0 ? (
            <p className="empty">Your closet is empty. Add your first item.</p>
          ) : visibleItems.length === 0 ? (
            <p className="empty">
              No pieces match these filters.{" "}
              <button
                className="btn"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear filters
              </button>
            </p>
          ) : (
            <div className="app__grid">
              {visibleItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  busy={busyIds.includes(item.id)}
                  onEdit={startEdit}
                  onDelete={removeItem}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
