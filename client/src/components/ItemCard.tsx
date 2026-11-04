import { useState } from "react";
import type { Item } from "../types";
import { imageSrc } from "../api";
import "../styles/ItemCard.css";

interface Props {
  item: Item;
  busy: boolean;
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (item: Item) => void;
}

export default function ItemCard({
  item,
  busy,
  onEdit,
  onDelete,
  onToggleFavorite,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const validColor = CSS.supports("color", item.color);

  return (
    <article className={`item-card ${busy ? "item-card--busy" : ""}`}>
      <div className="item-card__image">
        {item.image_url && (
          <img src={imageSrc(item.image_url)} alt={item.name} />
        )}
        <span className="item-card__tag">{item.category}</span>
        <button
          className="item-card__fav"
          disabled={busy}
          onClick={() => onToggleFavorite(item)}
          aria-label={
            item.favorite ? "Remove from favorites" : "Add to favorites"
          }
          aria-pressed={item.favorite}
        >
          {item.favorite ? "★" : "☆"}
        </button>
      </div>

      <div className="item-card__body">
        <h3>{item.name}</h3>
        <p className="item-card__meta">
          {validColor && (
            <span
              className="item-card__swatch"
              style={{ backgroundColor: item.color }}
            />
          )}
          {[item.color, item.season].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="item-card__actions">
        {busy ? (
          <span className="item-card__status">Working...</span>
        ) : confirming ? (
          <>
            <button
              className="btn btn--danger"
              onClick={() => {
                setConfirming(false);
                onDelete(item.id);
              }}
            >
              Confirm delete
            </button>
            <button className="btn" onClick={() => setConfirming(false)}>
              Keep
            </button>
          </>
        ) : (
          <>
            <button className="btn" onClick={() => onEdit(item)}>
              Edit
            </button>
            <button className="btn" onClick={() => setConfirming(true)}>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}
