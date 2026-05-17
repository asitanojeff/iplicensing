CREATE TABLE `royalty_calculations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`royalty_report_id` int NOT NULL,
	`contract_terms_id` int NOT NULL,
	`gross_sales` decimal(15,2) NOT NULL,
	`deductions` decimal(15,2) DEFAULT 0,
	`net_sales` decimal(15,2) NOT NULL,
	`royalty_rate` decimal(5,2) NOT NULL,
	`royalty_due` decimal(15,2) NOT NULL,
	`minimum_guarantee` decimal(15,2),
	`previous_mg_recoupment` decimal(15,2) DEFAULT 0,
	`current_mg_recoupment` decimal(15,2) DEFAULT 0,
	`excess_royalty` decimal(15,2) DEFAULT 0,
	`calculated_at` timestamp NOT NULL DEFAULT (now()),
	`calculated_by` int NOT NULL,
	CONSTRAINT `royalty_calculations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `royalty_report_id_idx` ON `royalty_calculations` (`royalty_report_id`);--> statement-breakpoint
CREATE INDEX `contract_terms_id_idx` ON `royalty_calculations` (`contract_terms_id`);--> statement-breakpoint
CREATE INDEX `approval_id_idx` ON `approval_comments` (`approval_id`);--> statement-breakpoint
CREATE INDEX `submission_id_idx` ON `approval_comments` (`submission_id`);--> statement-breakpoint
CREATE INDEX `asset_id_idx` ON `asset_permissions` (`asset_id`);--> statement-breakpoint
CREATE INDEX `licensee_id_idx` ON `asset_permissions` (`licensee_id`);--> statement-breakpoint
CREATE INDEX `asset_id_idx` ON `asset_versions` (`asset_id`);--> statement-breakpoint
CREATE INDEX `contract_id_idx` ON `contract_terms` (`contract_id`);--> statement-breakpoint
CREATE INDEX `licensor_id_idx` ON `contracts` (`licensor_id`);--> statement-breakpoint
CREATE INDEX `licensee_id_idx` ON `contracts` (`licensee_id`);--> statement-breakpoint
CREATE INDEX `licensor_id_idx` ON `ip_assets` (`licensor_id`);--> statement-breakpoint
CREATE INDEX `licensee_id_idx` ON `licensee_assignments` (`licensee_id`);--> statement-breakpoint
CREATE INDEX `contract_id_idx` ON `licensee_assignments` (`contract_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `licensee_id_idx` ON `product_submissions` (`licensee_id`);--> statement-breakpoint
CREATE INDEX `contract_id_idx` ON `product_submissions` (`contract_id`);--> statement-breakpoint
CREATE INDEX `licensee_id_idx` ON `royalty_reports` (`licensee_id`);--> statement-breakpoint
CREATE INDEX `contract_id_idx` ON `royalty_reports` (`contract_id`);--> statement-breakpoint
CREATE INDEX `licensee_id_idx` ON `security_labels` (`licensee_id`);--> statement-breakpoint
CREATE INDEX `contract_id_idx` ON `security_labels` (`contract_id`);--> statement-breakpoint
CREATE INDEX `submission_id_idx` ON `submission_approvals` (`submission_id`);--> statement-breakpoint
CREATE INDEX `submission_id_idx` ON `submission_files` (`submission_id`);--> statement-breakpoint
CREATE INDEX `openId_idx` ON `users` (`openId`);