import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requireApiKey } from "./middleware/auth.js";
import { readingsRouter } from "./routes/readings.js";
import { stationsRouter } from "./routes/stations.js";

const app = new Hono();

app.use("*", logger());
app.use("*", cors({ origin: "http://localhost:5173" }));

app.on(["POST", "PUT", "PATCH", "DELETE"], "/stations/*", requireApiKey);
app.on(["POST", "PUT", "PATCH", "DELETE"], "/stations", requireApiKey);

app.get("/health", (c) => c.json({ ok: true }));
app.route("/stations", stationsRouter);
app.route("/stations", readingsRouter);

app.notFound((c) => c.json({ error: "Not found" }, 404));
app.onError((err, c) => {
    console.error(err);
    return c.json({ error: "Internal server error" }, 500);
});

serve({ fetch: app.fetch, port: Number(process.env.PORT) || 3000 }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
});
