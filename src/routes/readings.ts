import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { readings, stations } from "../db/schema.js";
import { idParam, readingCreate, readingQuery } from "../schema.js";

export const readingsRouter = new Hono();

async function stationExists(id: number) {
    const [s] = await db.select({ id: stations.id }).from(stations).where(eq(stations.id, id));
    return !!s; // !! coerces a boolean value
}

// POST /stations/:id/readings  (your weather device calls this)
readingsRouter.post("/:id/readings", zValidator("param", idParam), zValidator("json", readingCreate), async (c) => {
    const { id } = c.req.valid("param");
    if (!(await stationExists(id))) return c.json({ error: "Station not found" }, 404);

    const [created] = await db
        .insert(readings)
        .values({ ...c.req.valid("json"), stationId: id })
        .returning();
    return c.json(created, 201);
});

// GET /stations/:id/readings?limit=50
readingsRouter.get("/:id/readings", zValidator("param", idParam), zValidator("query", readingQuery), async (c) => {
    const { id } = c.req.valid("param");
    const { limit } = c.req.valid("query");
    if (!(await stationExists(id))) return c.json({ error: "Station not found" }, 404);

    const rows = await db.select().from(readings).where(eq(readings.stationId, id)).orderBy(desc(readings.recordedAt)).limit(limit);
    return c.json(rows);
});

// GET /stations/:id/readings/latest
readingsRouter.get("/:id/readings/latest", zValidator("param", idParam), async (c) => {
    const { id } = c.req.valid("param");
    if (!(await stationExists(id))) return c.json({ error: "Station not found" }, 404);
    const [latest] = await db.select().from(readings).where(eq(readings.stationId, id)).orderBy(desc(readings.recordedAt)).limit(1);
    return latest ? c.json(latest) : c.json({ error: "No readings yet" }, 404);
});
