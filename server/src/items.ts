import { Router } from "express";
import { db } from "./db.js";

const CATEGORIES = [
  "top",
  "bottom",
  "dress",
  "outerwear",
  "shoes",
  "accessory",
  "hijab",
  "abaya",
] as const;
const SEASONS = ["spring", "summer", "autumn", "winter", "all"] as const;

// SQLite stores favorite as 0/1; the API exposes it as true/false
function toItem(row: any) {
  return { ...row, favorite: row.favorite === 1 };
}

// Turns the :id URL param into a valid integer, or null if it isn't one
function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Returns the cleaned data, or an error message string
function validate(body: any) {
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return "Name is required";

  if (!CATEGORIES.includes(body.category)) {
    return `Category must be one of: ${CATEGORIES.join(", ")}`;
  }

  const season = body.season ?? "all";
  if (!SEASONS.includes(season)) {
    return `Season must be one of: ${SEASONS.join(", ")}`;
  }

  // The photo is required, and must be an upload or an http(s) link
  const image_url =
    typeof body.image_url === "string" ? body.image_url.trim() : "";
  if (!image_url) return "A photo is required (upload one or paste a link)";
  if (!image_url.startsWith("/uploads/") && !/^https?:\/\//i.test(image_url)) {
    return "Image must be an uploaded photo or an http(s) link";
  }

  return {
    name,
    category: body.category as string,
    color: typeof body?.color === "string" ? body.color.trim() : "",
    season: season as string,
    favorite: body.favorite ? 1 : 0,
    image_url,
  };
}

export const itemsRouter = Router();

// GET /api/items: list all
itemsRouter.get("/", (_req, res) => {
  const rows = db
    .prepare("SELECT * FROM clothing_items ORDER BY created_at DESC, id DESC")
    .all();
  res.json(rows.map(toItem));
});

// GET /api/items/:id: get one
itemsRouter.get("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid id" });

  const row = db.prepare("SELECT * FROM clothing_items WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "Item not found" });

  res.json(toItem(row));
});

// POST /api/items: create one
itemsRouter.post("/", (req, res) => {
  const result = validate(req.body);
  if (typeof result === "string") {
    return res.status(400).json({ error: result });
  }

  const info = db
    .prepare(
      `INSERT INTO clothing_items (name, category, color, season, favorite, image_url)
       VALUES (@name, @category, @color, @season, @favorite, @image_url)`,
    )
    .run(result);

  const created = db
    .prepare("SELECT * FROM clothing_items WHERE id = ?")
    .get(info.lastInsertRowid);

  res.status(201).json(toItem(created));
});

// PUT /api/items/:id: update one
itemsRouter.put("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid id" });

  const result = validate(req.body);
  if (typeof result === "string") {
    return res.status(400).json({ error: result });
  }

  const info = db
    .prepare(
      `UPDATE clothing_items
       SET name = @name, category = @category, color = @color,
           season = @season, favorite = @favorite, image_url = @image_url
       WHERE id = @id`,
    )
    .run({ ...result, id });

  if (info.changes === 0) {
    return res.status(404).json({ error: "Item not found" });
  }

  const updated = db
    .prepare("SELECT * FROM clothing_items WHERE id = ?")
    .get(id);
  res.json(toItem(updated));
});

// DELETE /api/items/:id: delete one
itemsRouter.delete("/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid id" });

  const info = db.prepare("DELETE FROM clothing_items WHERE id = ?").run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: "Item not found" });
  }

  res.status(204).send();
});
