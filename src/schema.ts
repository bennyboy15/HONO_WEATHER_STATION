import { z } from "zod";

export const idParam = z.object({ id: z.coerce.number().int().positive() });

const station = z.object({
    name: z.string().min(1).max(255),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
});

export const stationCreate = station.extend({
    latitude: station.shape.latitude.default(-90),
    longitude: station.shape.longitude.default(-180),
});

// Built from `station`, not `stationCreate`: defaults survive .partial() and would overwrite stored values.
export const stationUpdate = station.partial().refine((fields) => Object.keys(fields).length > 0, {
    message: "At least one field is required",
});

export const readingCreate = z.object({
    temperature: z.number(),
    humidity: z.number().min(0).max(100),
    pressure: z.number(),
    recorded_at: z.coerce.date().optional(), // defaults to now in DB
});

export const readingQuery = z.object({
    limit: z.coerce.number().int().min(1).max(500).default(50),
});
