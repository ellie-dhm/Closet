import { Router } from "express";
import { db } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const { season, category, from, to } = req.query as Record<
    string,
    string | undefined
  >;

  const where: string[] = [];
  const params: string[] = [];

  if (season) {
    where.push("(season = ? OR season = 'all')");
    params.push(season);
  }
  if (category) {
    where.push("category = ?");
    params.push(category);
  }
  if (from) {
    where.push("date(created_at) >= date(?)");
    params.push(from);
  }
  if (to) {
    where.push("date(created_at) <= date(?)");
    params.push(to);
  }

  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  // col is always a hardcoded string below, never user input
  const group = (col: "category" | "season" | "color") => {
    const expr = `COALESCE(NULLIF(${col}, ''), 'Unknown')`;
    return db
      .prepare(
        `SELECT ${expr} AS name, COUNT(*) AS value
       FROM clothing_items ${clause}
       GROUP BY ${expr}
       ORDER BY value DESC`,
      )
      .all(...params) as { name: string; value: number }[];
  };

  const summary = db
    .prepare(
      `SELECT COUNT(*) AS total, COALESCE(SUM(favorite), 0) AS favorites
       FROM clothing_items ${clause}`,
    )
    .get(...params) as { total: number; favorites: number };

  const timeline = db
    .prepare(
      `SELECT strftime('%Y-%m-%d', created_at) AS date, COUNT(*) AS value
       FROM clothing_items ${clause}
       GROUP BY date
       ORDER BY date ASC`,
    )
    .all(...params);

  const byCategory = group("category");
  const byColor = group("color");

  res.json({
    summary: {
      ...summary,
      topCategory: byCategory[0]?.name ?? null,
      topColor: byColor.find((c) => c.name !== "Unknown")?.name ?? null,
    },
    byCategory,
    bySeason: group("season"),
    byColor,
    timeline,
  });
});

export default router;
