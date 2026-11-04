import express from "express";
import cors from "cors";
import { itemsRouter } from "./items.js";
import { UPLOAD_DIR, uploadsRouter } from "./uploads.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const LATENCY_MS = 400;
app.use("/api", (_req, _res, next) => setTimeout(next, LATENCY_MS));

app.use("/api/items", itemsRouter);
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/api/uploads", uploadsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const status = err.status ?? 500;
    if (status >= 500) console.error(err);
    res.status(status).json({
      error: status >= 500 ? "Internal server error" : err.message,
    });
  },
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
