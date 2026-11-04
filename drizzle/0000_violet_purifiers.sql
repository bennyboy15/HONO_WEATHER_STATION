CREATE TABLE "readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"stationId" integer NOT NULL,
	"temperature" double precision NOT NULL,
	"humidity" double precision NOT NULL,
	"pressure" double precision NOT NULL,
	"recordedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."stations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_readings_station_time" ON "readings" USING btree ("stationId","recordedAt");