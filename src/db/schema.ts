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
        station_id: integer("station_id").notNull(),
        temperature: doublePrecision("temperature").notNull(), // °C
        humidity: doublePrecision("humidity").notNull(), // %
        pressure: doublePrecision("pressure").notNull(), // hPa
        recorded_at: timestamp("recorded_at").defaultNow().notNull(),
    },
    (table) => [
        index("ix_readings_station_time").on(table.station_id, table.recorded_at),
        foreignKey({
            name: "readings_station_id_fkey",
            columns: [table.station_id],
            foreignColumns: [stations.id],
        }).onDelete("cascade"),
    ],
);
