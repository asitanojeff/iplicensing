import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  longtext,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control for the licensing platform.
 */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["admin", "licensor", "licensee", "reviewer"])
      .default("licensee")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => ({
    openIdIdx: index("openId_idx").on(table.openId),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * IP Assets table - stores all IP materials (logos, artwork, templates, etc.)
 */
export const ipAssets = mysqlTable(
  "ip_assets",
  {
    id: int("id").autoincrement().primaryKey(),
    licensorId: int("licensor_id").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    assetType: mysqlEnum("asset_type", [
      "style_guide",
      "logo",
      "artwork",
      "psd_file",
      "ai_file",
      "packaging_template",
      "marketing_material",
      "reference",
    ]).notNull(),
    folderPath: varchar("folder_path", { length: 512 }),
    storageKey: varchar("storage_key", { length: 512 }).notNull(),
    storageUrl: varchar("storage_url", { length: 1024 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }),
    fileSize: int("file_size"),
    version: int("version").default(1).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    expiryDate: timestamp("expiry_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licensorIdIdx: index("licensor_id_idx").on(table.licensorId),
  })
);

export type IpAsset = typeof ipAssets.$inferSelect;
export type InsertIpAsset = typeof ipAssets.$inferInsert;

/**
 * Asset Versions table - tracks version history and download counts
 */
export const assetVersions = mysqlTable(
  "asset_versions",
  {
    id: int("id").autoincrement().primaryKey(),
    assetId: int("asset_id").notNull(),
    versionNumber: int("version_number").notNull(),
    storageKey: varchar("storage_key", { length: 512 }).notNull(),
    storageUrl: varchar("storage_url", { length: 1024 }).notNull(),
    downloadCount: int("download_count").default(0).notNull(),
    uploadedBy: int("uploaded_by").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    assetIdIdx: index("asset_id_idx").on(table.assetId),
  })
);

export type AssetVersion = typeof assetVersions.$inferSelect;
export type InsertAssetVersion = typeof assetVersions.$inferInsert;

/**
 * Asset Permissions table - controls which licensees can access which assets
 */
export const assetPermissions = mysqlTable(
  "asset_permissions",
  {
    id: int("id").autoincrement().primaryKey(),
    assetId: int("asset_id").notNull(),
    licenseeId: int("licensee_id").notNull(),
    canDownload: boolean("can_download").default(true).notNull(),
    canView: boolean("can_view").default(true).notNull(),
    grantedAt: timestamp("granted_at").defaultNow().notNull(),
    grantedBy: int("granted_by").notNull(),
  },
  (table) => ({
    assetIdIdx: index("asset_id_idx").on(table.assetId),
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
  })
);

export type AssetPermission = typeof assetPermissions.$inferSelect;
export type InsertAssetPermission = typeof assetPermissions.$inferInsert;

/**
 * Contracts table - stores licensing agreements
 */
export const contracts = mysqlTable(
  "contracts",
  {
    id: int("id").autoincrement().primaryKey(),
    licensorId: int("licensor_id").notNull(),
    licenseeId: int("licensee_id"),
    contractNumber: varchar("contract_number", { length: 100 }).unique(),
    title: varchar("title", { length: 255 }).notNull(),
    dealMemoStorageKey: varchar("deal_memo_storage_key", { length: 512 }),
    dealMemoUrl: varchar("deal_memo_url", { length: 1024 }),
    status: mysqlEnum("status", [
      "draft",
      "pending_signature",
      "signed",
      "active",
      "expired",
      "terminated",
    ])
      .default("draft")
      .notNull(),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    signedDate: timestamp("signed_date"),
    territory: varchar("territory", { length: 255 }),
    category: varchar("category", { length: 255 }),
    notes: longtext("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licensorIdIdx: index("licensor_id_idx").on(table.licensorId),
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
  })
);

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

/**
 * Contract Terms table - stores extracted key terms from contracts
 */
export const contractTerms = mysqlTable(
  "contract_terms",
  {
    id: int("id").autoincrement().primaryKey(),
    contractId: int("contract_id").notNull(),
    royaltyRate: decimal("royalty_rate", { precision: 5, scale: 2 }),
    minimumGuarantee: decimal("minimum_guarantee", { precision: 15, scale: 2 }),
    paymentFrequency: mysqlEnum("payment_frequency", [
      "quarterly",
      "semi_annual",
      "annual",
    ])
      .default("quarterly")
      .notNull(),
    currency: varchar("currency", { length: 10 }).default("USD").notNull(),
    territories: json("territories"),
    categories: json("categories"),
    approvalRequired: boolean("approval_required").default(true).notNull(),
    extractedAt: timestamp("extracted_at").defaultNow().notNull(),
  },
  (table) => ({
    contractIdIdx: index("contract_id_idx").on(table.contractId),
  })
);

export type ContractTerms = typeof contractTerms.$inferSelect;
export type InsertContractTerms = typeof contractTerms.$inferInsert;

/**
 * Product Submissions table - tracks licensee product submissions through approval pipeline
 */
export const productSubmissions = mysqlTable(
  "product_submissions",
  {
    id: int("id").autoincrement().primaryKey(),
    licenseeId: int("licensee_id").notNull(),
    contractId: int("contract_id").notNull(),
    productName: varchar("product_name", { length: 255 }).notNull(),
    currentStage: mysqlEnum("current_stage", [
      "concept",
      "pre_production",
      "final_product",
      "market_approval",
      "approved",
      "rejected",
    ])
      .default("concept")
      .notNull(),
    submissionDate: timestamp("submission_date").defaultNow().notNull(),
    lastUpdated: timestamp("last_updated").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
    contractIdIdx: index("contract_id_idx").on(table.contractId),
  })
);

export type ProductSubmission = typeof productSubmissions.$inferSelect;
export type InsertProductSubmission = typeof productSubmissions.$inferInsert;

/**
 * Submission Approvals table - tracks each stage of the approval pipeline
 */
export const submissionApprovals = mysqlTable(
  "submission_approvals",
  {
    id: int("id").autoincrement().primaryKey(),
    submissionId: int("submission_id").notNull(),
    stage: mysqlEnum("stage", [
      "concept",
      "pre_production",
      "final_product",
      "market_approval",
    ]).notNull(),
    status: mysqlEnum("status", [
      "pending",
      "in_review",
      "approved",
      "revision_requested",
      "rejected",
    ])
      .default("pending")
      .notNull(),
    assignedTo: int("assigned_to"),
    submittedAt: timestamp("submitted_at"),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: int("reviewed_by"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    submissionIdIdx: index("submission_id_idx").on(table.submissionId),
  })
);

export type SubmissionApproval = typeof submissionApprovals.$inferSelect;
export type InsertSubmissionApproval = typeof submissionApprovals.$inferInsert;

/**
 * Approval Comments table - stores review feedback and revision requests
 */
export const approvalComments = mysqlTable(
  "approval_comments",
  {
    id: int("id").autoincrement().primaryKey(),
    approvalId: int("approval_id").notNull(),
    submissionId: int("submission_id").notNull(),
    commentType: mysqlEnum("comment_type", [
      "feedback",
      "revision_request",
      "approval_note",
    ]).notNull(),
    content: longtext("content").notNull(),
    createdBy: int("created_by").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    approvalIdIdx: index("approval_id_idx").on(table.approvalId),
    submissionIdIdx: index("submission_id_idx").on(table.submissionId),
  })
);

export type ApprovalComment = typeof approvalComments.$inferSelect;
export type InsertApprovalComment = typeof approvalComments.$inferInsert;

/**
 * Submission Files table - stores uploaded files for each submission
 */
export const submissionFiles = mysqlTable(
  "submission_files",
  {
    id: int("id").autoincrement().primaryKey(),
    submissionId: int("submission_id").notNull(),
    stage: mysqlEnum("stage", [
      "concept",
      "pre_production",
      "final_product",
      "market_approval",
    ]).notNull(),
    fileType: mysqlEnum("file_type", [
      "design",
      "packaging",
      "marketing_material",
      "product_sample",
    ]).notNull(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    storageKey: varchar("storage_key", { length: 512 }).notNull(),
    storageUrl: varchar("storage_url", { length: 1024 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }),
    fileSize: int("file_size"),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  },
  (table) => ({
    submissionIdIdx: index("submission_id_idx").on(table.submissionId),
  })
);

export type SubmissionFile = typeof submissionFiles.$inferSelect;
export type InsertSubmissionFile = typeof submissionFiles.$inferInsert;

/**
 * Royalty Reports table - stores quarterly royalty submissions
 */
export const royaltyReports = mysqlTable(
  "royalty_reports",
  {
    id: int("id").autoincrement().primaryKey(),
    licenseeId: int("licensee_id").notNull(),
    contractId: int("contract_id").notNull(),
    reportingPeriod: varchar("reporting_period", { length: 20 }).notNull(),
    grossSales: decimal("gross_sales", { precision: 15, scale: 2 }).notNull(),
    deductions: decimal("deductions", { precision: 15, scale: 2 }).default(0),
    netSales: decimal("net_sales", { precision: 15, scale: 2 }).notNull(),
    royaltyRate: decimal("royalty_rate", { precision: 5, scale: 2 }).notNull(),
    royaltyDue: decimal("royalty_due", { precision: 15, scale: 2 }).notNull(),
    minimumGuarantee: decimal("minimum_guarantee", { precision: 15, scale: 2 }),
    mgRecoupment: decimal("mg_recoupment", { precision: 15, scale: 2 }).default(0),
    excessRoyalty: decimal("excess_royalty", { precision: 15, scale: 2 }).default(0),
    status: mysqlEnum("status", [
      "draft",
      "submitted",
      "under_review",
      "approved",
      "invoiced",
      "paid",
    ])
      .default("draft")
      .notNull(),
    submittedAt: timestamp("submitted_at"),
    reviewedAt: timestamp("reviewed_at"),
    reviewedBy: int("reviewed_by"),
    invoiceGenerated: boolean("invoice_generated").default(false).notNull(),
    invoiceNumber: varchar("invoice_number", { length: 100 }),
    storageKey: varchar("storage_key", { length: 512 }),
    storageUrl: varchar("storage_url", { length: 1024 }),
    notes: longtext("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
    contractIdIdx: index("contract_id_idx").on(table.contractId),
  })
);

export type RoyaltyReport = typeof royaltyReports.$inferSelect;
export type InsertRoyaltyReport = typeof royaltyReports.$inferInsert;

/**
 * Security Labels table - tracks security labels for anti-counterfeit verification
 */
export const securityLabels = mysqlTable(
  "security_labels",
  {
    id: int("id").autoincrement().primaryKey(),
    licenseeId: int("licensee_id").notNull(),
    contractId: int("contract_id").notNull(),
    labelCode: varchar("label_code", { length: 100 }).unique().notNull(),
    qrCode: varchar("qr_code", { length: 512 }),
    serialNumber: varchar("serial_number", { length: 100 }).unique().notNull(),
    status: mysqlEnum("status", [
      "available",
      "assigned",
      "used",
      "verified",
      "counterfeit_flagged",
    ])
      .default("available")
      .notNull(),
    assignedToProduct: varchar("assigned_to_product", { length: 255 }),
    assignedDate: timestamp("assigned_date"),
    usedInRoyaltyReport: int("used_in_royalty_report"),
    verificationCount: int("verification_count").default(0).notNull(),
    lastVerifiedAt: timestamp("last_verified_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
    contractIdIdx: index("contract_id_idx").on(table.contractId),
  })
);

export type SecurityLabel = typeof securityLabels.$inferSelect;
export type InsertSecurityLabel = typeof securityLabels.$inferInsert;

/**
 * Notifications table - audit log for all system notifications and reminders
 */
export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id").notNull(),
    type: mysqlEnum("type", [
      "approval_pending",
      "royalty_due",
      "contract_expiry",
      "revision_requested",
      "submission_approved",
      "submission_rejected",
      "label_alert",
      "system_alert",
    ]).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: longtext("message").notNull(),
    relatedEntityType: varchar("related_entity_type", { length: 50 }),
    relatedEntityId: int("related_entity_id"),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
  })
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Licensee Assignments table - links licensees to contracts and assets
 */
export const licenseeAssignments = mysqlTable(
  "licensee_assignments",
  {
    id: int("id").autoincrement().primaryKey(),
    licenseeId: int("licensee_id").notNull(),
    contractId: int("contract_id").notNull(),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    assignedBy: int("assigned_by").notNull(),
  },
  (table) => ({
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
    contractIdIdx: index("contract_id_idx").on(table.contractId),
  })
);

export type LicenseeAssignment = typeof licenseeAssignments.$inferSelect;
export type InsertLicenseeAssignment = typeof licenseeAssignments.$inferInsert;

/**
 * Royalty Calculations table - stores detailed calculation history for audit and analysis
 */
export const royaltyCalculations = mysqlTable(
  "royalty_calculations",
  {
    id: int("id").autoincrement().primaryKey(),
    royaltyReportId: int("royalty_report_id").notNull(),
    contractTermsId: int("contract_terms_id").notNull(),
    grossSales: decimal("gross_sales", { precision: 15, scale: 2 }).notNull(),
    deductions: decimal("deductions", { precision: 15, scale: 2 }).default(0),
    netSales: decimal("net_sales", { precision: 15, scale: 2 }).notNull(),
    royaltyRate: decimal("royalty_rate", { precision: 5, scale: 2 }).notNull(),
    royaltyDue: decimal("royalty_due", { precision: 15, scale: 2 }).notNull(),
    minimumGuarantee: decimal("minimum_guarantee", { precision: 15, scale: 2 }),
    previousMgRecoupment: decimal("previous_mg_recoupment", { precision: 15, scale: 2 }).default(0),
    currentMgRecoupment: decimal("current_mg_recoupment", { precision: 15, scale: 2 }).default(0),
    excessRoyalty: decimal("excess_royalty", { precision: 15, scale: 2 }).default(0),
    calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
    calculatedBy: int("calculated_by").notNull(),
  },
  (table) => ({
    royaltyReportIdIdx: index("royalty_report_id_idx").on(table.royaltyReportId),
    contractTermsIdIdx: index("contract_terms_id_idx").on(table.contractTermsId),
  })
);

export type RoyaltyCalculation = typeof royaltyCalculations.$inferSelect;
export type InsertRoyaltyCalculation = typeof royaltyCalculations.$inferInsert;
