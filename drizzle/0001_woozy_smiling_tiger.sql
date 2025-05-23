ALTER TABLE "user" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "date_created" timestamp with time zone DEFAULT now();