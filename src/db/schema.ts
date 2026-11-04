import { doublePrecision, foreignKey, index, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const stations = pgTable("stations", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
});

export const readings = pgTable(
    "readings",
    {
        id: serial("id").primaryKey(),
        stationId: integer("stationId").notNull(),
        temperature: doublePrecision("temperature").notNull(), // °C
        humidity: doublePrecision("humidity").notNull(), // %
        pressure: doublePrecision("pressure").notNull(), // hPa
        recordedAt: timestamp("recordedAt", { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => [
        index("ix_readings_station_time").on(table.stationId, table.recordedAt),
        foreignKey({
            name: "readings_stationId_fkey",
            columns: [table.stationId],
            foreignColumns: [stations.id],
        }).onDelete("cascade"),
    ],
);
