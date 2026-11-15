import { db } from "./db.js";

const ids = db.prepare("SELECT id FROM clothing_items").all() as {
  id: number;
}[];
const update = db.prepare(
  "UPDATE clothing_items SET created_at = ? WHERE id = ?",
);

const tx = db.transaction(() => {
  for (const { id } of ids) {
    const daysAgo = Math.floor(Math.random() * 120);
    const d = new Date(Date.now() - daysAgo * 86400000);
    update.run(d.toISOString().slice(0, 19).replace("T", " "), id);
  }
});
tx();
console.log(`Updated ${ids.length} items`);
