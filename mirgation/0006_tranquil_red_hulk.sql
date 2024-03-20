ALTER TABLE "folders" ALTER COLUMN "data" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "folders" ALTER COLUMN "in_trash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "data" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ALTER COLUMN "in_trash" DROP NOT NULL;