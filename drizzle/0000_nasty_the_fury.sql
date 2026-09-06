CREATE TABLE `book_leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`email_key` text NOT NULL,
	`first_seen_at` text NOT NULL,
	`last_seen_at` text NOT NULL,
	`source` text NOT NULL,
	`marketing_consent` integer DEFAULT 0 NOT NULL,
	`case_study_requested` integer DEFAULT 0 NOT NULL,
	`checkout_started` integer DEFAULT 0 NOT NULL,
	`landing_page` text,
	`attribution_json` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_book_leads_email_key` ON `book_leads` (`email_key`);
--> statement-breakpoint
PRAGMA optimize;
