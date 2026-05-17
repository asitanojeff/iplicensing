CREATE TABLE `approval_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`approval_id` int NOT NULL,
	`submission_id` int NOT NULL,
	`comment_type` enum('feedback','revision_request','approval_note') NOT NULL,
	`content` longtext NOT NULL,
	`created_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `approval_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `asset_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`asset_id` int NOT NULL,
	`licensee_id` int NOT NULL,
	`can_download` boolean NOT NULL DEFAULT true,
	`can_view` boolean NOT NULL DEFAULT true,
	`granted_at` timestamp NOT NULL DEFAULT (now()),
	`granted_by` int NOT NULL,
	CONSTRAINT `asset_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `asset_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`asset_id` int NOT NULL,
	`version_number` int NOT NULL,
	`storage_key` varchar(512) NOT NULL,
	`storage_url` varchar(1024) NOT NULL,
	`download_count` int NOT NULL DEFAULT 0,
	`uploaded_by` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `asset_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contract_terms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contract_id` int NOT NULL,
	`royalty_rate` decimal(5,2),
	`minimum_guarantee` decimal(15,2),
	`payment_frequency` enum('quarterly','semi_annual','annual') NOT NULL DEFAULT 'quarterly',
	`currency` varchar(10) NOT NULL DEFAULT 'USD',
	`territories` json,
	`categories` json,
	`approval_required` boolean NOT NULL DEFAULT true,
	`extracted_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contract_terms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`licensor_id` int NOT NULL,
	`licensee_id` int,
	`contract_number` varchar(100),
	`title` varchar(255) NOT NULL,
	`deal_memo_storage_key` varchar(512),
	`deal_memo_url` varchar(1024),
	`status` enum('draft','pending_signature','signed','active','expired','terminated') NOT NULL DEFAULT 'draft',
	`start_date` timestamp,
	`end_date` timestamp,
	`signed_date` timestamp,
	`territory` varchar(255),
	`category` varchar(255),
	`notes` longtext,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`),
	CONSTRAINT `contracts_contract_number_unique` UNIQUE(`contract_number`)
);
--> statement-breakpoint
CREATE TABLE `ip_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`licensor_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`asset_type` enum('style_guide','logo','artwork','psd_file','ai_file','packaging_template','marketing_material','reference') NOT NULL,
	`folder_path` varchar(512),
	`storage_key` varchar(512) NOT NULL,
	`storage_url` varchar(1024) NOT NULL,
	`mime_type` varchar(100),
	`file_size` int,
	`version` int NOT NULL DEFAULT 1,
	`is_active` boolean NOT NULL DEFAULT true,
	`expiry_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ip_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `licensee_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`licensee_id` int NOT NULL,
	`contract_id` int NOT NULL,
	`assigned_at` timestamp NOT NULL DEFAULT (now()),
	`assigned_by` int NOT NULL,
	CONSTRAINT `licensee_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` enum('approval_pending','royalty_due','contract_expiry','revision_requested','submission_approved','submission_rejected','label_alert','system_alert') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` longtext NOT NULL,
	`related_entity_type` varchar(50),
	`related_entity_id` int,
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`licensee_id` int NOT NULL,
	`contract_id` int NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`current_stage` enum('concept','pre_production','final_product','market_approval','approved','rejected') NOT NULL DEFAULT 'concept',
	`submission_date` timestamp NOT NULL DEFAULT (now()),
	`last_updated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `royalty_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`licensee_id` int NOT NULL,
	`contract_id` int NOT NULL,
	`reporting_period` varchar(20) NOT NULL,
	`gross_sales` decimal(15,2) NOT NULL,
	`deductions` decimal(15,2) DEFAULT 0,
	`net_sales` decimal(15,2) NOT NULL,
	`royalty_rate` decimal(5,2) NOT NULL,
	`royalty_due` decimal(15,2) NOT NULL,
	`minimum_guarantee` decimal(15,2),
	`mg_recoupment` decimal(15,2) DEFAULT 0,
	`excess_royalty` decimal(15,2) DEFAULT 0,
	`status` enum('draft','submitted','under_review','approved','invoiced','paid') NOT NULL DEFAULT 'draft',
	`submitted_at` timestamp,
	`reviewed_at` timestamp,
	`reviewed_by` int,
	`invoice_generated` boolean NOT NULL DEFAULT false,
	`invoice_number` varchar(100),
	`storage_key` varchar(512),
	`storage_url` varchar(1024),
	`notes` longtext,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `royalty_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `security_labels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`licensee_id` int NOT NULL,
	`contract_id` int NOT NULL,
	`label_code` varchar(100) NOT NULL,
	`qr_code` varchar(512),
	`serial_number` varchar(100) NOT NULL,
	`status` enum('available','assigned','used','verified','counterfeit_flagged') NOT NULL DEFAULT 'available',
	`assigned_to_product` varchar(255),
	`assigned_date` timestamp,
	`used_in_royalty_report` int,
	`verification_count` int NOT NULL DEFAULT 0,
	`last_verified_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `security_labels_id` PRIMARY KEY(`id`),
	CONSTRAINT `security_labels_label_code_unique` UNIQUE(`label_code`),
	CONSTRAINT `security_labels_serial_number_unique` UNIQUE(`serial_number`)
);
--> statement-breakpoint
CREATE TABLE `submission_approvals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submission_id` int NOT NULL,
	`stage` enum('concept','pre_production','final_product','market_approval') NOT NULL,
	`status` enum('pending','in_review','approved','revision_requested','rejected') NOT NULL DEFAULT 'pending',
	`assigned_to` int,
	`submitted_at` timestamp,
	`reviewed_at` timestamp,
	`reviewed_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `submission_approvals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `submission_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submission_id` int NOT NULL,
	`stage` enum('concept','pre_production','final_product','market_approval') NOT NULL,
	`file_type` enum('design','packaging','marketing_material','product_sample') NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`storage_key` varchar(512) NOT NULL,
	`storage_url` varchar(1024) NOT NULL,
	`mime_type` varchar(100),
	`file_size` int,
	`uploaded_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `submission_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','licensor','licensee','reviewer') NOT NULL DEFAULT 'licensee';