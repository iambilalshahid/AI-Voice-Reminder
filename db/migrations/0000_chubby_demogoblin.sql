CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`day` text NOT NULL,
	`time` text,
	`has_alarm` integer DEFAULT false,
	`completed` integer DEFAULT false,
	`created_at` integer NOT NULL
);
