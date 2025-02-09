CREATE TABLE "ticker_data" (
	"id" varchar PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"pair" varchar,
	"close" varchar,
	"open" varchar,
	"high" varchar,
	"low" varchar,
	"volume" varchar
);
