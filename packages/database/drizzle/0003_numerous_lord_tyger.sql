ALTER TABLE "events" ALTER COLUMN "total_tickets" SET DATA TYPE integer USING total_tickets::integer;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "available_tickets" SET DATA TYPE integer USING available_tickets::integer;
