import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { CATEGORIES, SEASONS } from "../types";
import type { Category, ItemInput, Season } from "../types";
import { imageSrc, uploadImage } from "../api";
import { useItemsStore } from "../itemsStore";
import { useUiStore } from "../uiStore";
import "../styles/ItemForm.css";

const EMPTY: ItemInput = {
  name: "",
  category: "top",
  color: "",
  season: "all",
  favorite: false,
  image_url: "",
};

export default function ItemForm() {
  const editing = useUiStore((s) => s.editing);
  const cancelEdit = useUiStore((s) => s.cancelEdit);
  const saving = useItemsStore((s) => s.saving);
  const error = useItemsStore((s) => s.saveError);
  const addItem = useItemsStore((s) => s.addItem);
  const editItem = useItemsStore((s) => s.editItem);

  const [form, setForm] = useState<ItemInput>(
    editing
      ? {
          name: editing.name,
          category: editing.category,
          color: editing.color,
          season: editing.season,
          favorite: editing.favorite,
          image_url: editing.image_url,
        }
      : EMPTY,
  );

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function update<K extends keyof ItemInput>(key: K, value: ItemInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      update("image_url", await uploadImage(file));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = editing ? await editItem(editing.id, form) : await addItem(form);

    if (ok) {
      if (editing) cancelEdit();
      else setForm(EMPTY);
    }
  }

  return (
    <form
      className={`item-form ${editing ? "item-form--editing" : ""}`}
      onSubmit={handleSubmit}
    >
      <h2>{editing ? "Edit item" : "Add an item"}</h2>

      <label>
        Name
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Black oversized blazer"
          required
          disabled={saving}
        />
      </label>

      <label>
        Category
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value as Category)}
          disabled={saving}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label>
        Color
        <input
          value={form.color}
          onChange={(e) => update("color", e.target.value)}
          placeholder="black, navy, #c9a27e..."
          disabled={saving}
        />
      </label>

      <label>
        Season
        <select
          value={form.season}
          onChange={(e) => update("season", e.target.value as Season)}
          disabled={saving}
        >
          {SEASONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div className="item-form__image">
        <span>Photo</span>
        <div className="item-form__preview">
          {uploading ? (
            <div className="skeleton skeleton--fill" />
          ) : form.image_url ? (
            <img src={imageSrc(form.image_url)} alt="Preview" />
          ) : (
            <span>No photo yet</span>
          )}
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          disabled={saving || uploading}
        />
        {uploading && <p className="item-form__hint">Uploading...</p>}
        {uploadError && <p className="item-form__error">{uploadError}</p>}
        <label>
          ...or paste an image link
          <input
            value={form.image_url.startsWith("/uploads/") ? "" : form.image_url}
            onChange={(e) => update("image_url", e.target.value)}
            placeholder="https://..."
            disabled={saving || uploading}
          />
        </label>
      </div>

      <label className="item-form__check">
        <input
          type="checkbox"
          checked={form.favorite}
          onChange={(e) => update("favorite", e.target.checked)}
          disabled={saving}
        />
        Favorite
      </label>

      {error && <p className="item-form__error">{error}</p>}

      <div className="item-form__buttons">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={saving || uploading}
        >
          {saving ? "Saving..." : editing ? "Save changes" : "Add item"}
        </button>
        {editing && (
          <button
            type="button"
            className="btn"
            onClick={cancelEdit}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
