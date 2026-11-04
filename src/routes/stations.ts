import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { stations } from "../db/schema.js";
import { idParam, stationCreate, stationUpdate } from "../schema.js";

export const stationsRouter = new Hono();

stationsRouter.get("/", async (c) => {
    return c.json(await db.select().from(stations));
});

stationsRouter.get("/:id", zValidator("param", idParam), async (c) => {
    const { id } = c.req.valid("param");
    const [station] = await db.select().from(stations).where(eq(stations.id, id));
    return station ? c.json(station) : c.json({ error: "Station not found" }, 404);
});

stationsRouter.post("/", zValidator("json", stationCreate), async (c) => {
    const [created] = await db.insert(stations).values(c.req.valid("json")).returning();
    return c.json(created, 201);
});

stationsRouter.patch("/:id", zValidator("param", idParam), zValidator("json", stationUpdate), async (c) => {
    const { id } = c.req.valid("param");
    const [updated] = await db.update(stations).set(c.req.valid("json")).where(eq(stations.id, id)).returning();
    return updated ? c.json(updated) : c.json({ error: "Station not found" }, 404);
});

stationsRouter.delete("/:id", zValidator("param", idParam), async (c) => {
    const { id } = c.req.valid("param");
    const [deleted] = await db.delete(stations).where(eq(stations.id, id)).returning();
    return deleted ? c.body(null, 204) : c.json({ error: "Station not found" }, 404);
});
