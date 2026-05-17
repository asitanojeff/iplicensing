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
      "logo",
      "artwork",
      "template",
      "style_guide",
      "packaging",
      "other",
    ]).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    folderPath: varchar("folder_path", { length: 512 }),
    expiryDate: timestamp("expiry_date"),
    status: mysqlEnum("status", ["active", "archived", "expired"])
      .default("active")
      .notNull(),
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
 * Asset Versions table - tracks version history and downloads
 */
export const assetVersions = mysqlTable(
  "asset_versions",
  {
    id: int("id").autoincrement().primaryKey(),
    assetId: int("asset_id").notNull(),
    versionNumber: int("version_number").notNull(),
    storageKey: varchar("storage_key", { length: 512 }).notNull(),
    storageUrl: varchar("storage_url", { length: 1024 }).notNull(),
    fileSize: int("file_size"),
    mimeType: varchar("mime_type", { length: 100 }),
    uploadedBy: int("uploaded_by").notNull(),
    downloadCount: int("download_count").default(0).notNull(),
    lastDownloadedAt: timestamp("last_downloaded_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    assetIdIdx: index("asset_id_idx").on(table.assetId),
  })
);

export type AssetVersion = typeof assetVersions.$inferSelect;
export type InsertAssetVersion = typeof assetVersions.$inferInsert;

/**
 * Asset Permissions table - controls licensee access to assets
 */
export const assetPermissions = mysqlTable(
  "asset_permissions",
  {
    id: int("id").autoincrement().primaryKey(),
    assetId: int("asset_id").notNull(),
    licenseeId: int("licensee_id").notNull(),
    canView: boolean("can_view").default(true).notNull(),
    canDownload: boolean("can_download").default(false).notNull(),
    grantedBy: int("granted_by").notNull(),
    grantedAt: timestamp("granted_at").defaultNow().notNull(),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
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
    contractNumber: varchar("contract_number", { length: 100 }).unique().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    licensorId: int("licensor_id").notNull(),
    description: text("description"),
    status: mysqlEnum("status", [
      "draft",
      "pending_signature",
      "active",
      "expired",
      "terminated",
    ])
      .default("draft")
      .notNull(),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    storageKey: varchar("storage_key", { length: 512 }),
    storageUrl: varchar("storage_url", { length: 1024 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licensorIdIdx: index("licensor_id_idx").on(table.licensorId),
    contractNumberIdx: index("contract_number_idx").on(table.contractNumber),
  })
);

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

/**
 * Contract Terms table - stores royalty rates, MG, territories, categories
 */
export const contractTerms = mysqlTable(
  "contract_terms",
  {
    id: int("id").autoincrement().primaryKey(),
    contractId: int("contract_id").notNull(),
    royaltyRate: decimal("royalty_rate", { precision: 5, scale: 2 }).notNull(),
    minimumGuarantee: decimal("minimum_guarantee", { precision: 15, scale: 2 }),
    territories: varchar("territories", { length: 512 }),
    categories: varchar("categories", { length: 512 }),
    paymentTerms: varchar("payment_terms", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    contractIdIdx: index("contract_id_idx").on(table.contractId),
  })
);

export type ContractTerms = typeof contractTerms.$inferSelect;
export type InsertContractTerms = typeof contractTerms.$inferInsert;

/**
 * Licensee Assignments table - links contracts to licensees
 */
export const licenseeAssignments = mysqlTable(
  "licensee_assignments",
  {
    id: int("id").autoincrement().primaryKey(),
    contractId: int("contract_id").notNull(),
    licenseeId: int("licensee_id").notNull(),
    assignedBy: int("assigned_by").notNull(),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    contractIdIdx: index("contract_id_idx").on(table.contractId),
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
  })
);

export type LicenseeAssignment = typeof licenseeAssignments.$inferSelect;
export type InsertLicenseeAssignment = typeof licenseeAssignments.$inferInsert;

/**
 * Product Submissions table - stores product submission details with pricing and quantities
 */
export const productSubmissions = mysqlTable(
  "product_submissions",
  {
    id: int("id").autoincrement().primaryKey(),
    licenseeId: int("licensee_id").notNull(),
    contractId: int("contract_id").notNull(),
    itemNumber: varchar("item_number", { length: 100 }).notNull(), // SKU - must match royalty report
    licensedProductId: int("licensed_product_id").notNull(), // Reference to licensed product in contract
    productName: varchar("product_name", { length: 255 }).notNull(),
    description: text("description"),
    suggestedRetailPrice: decimal("suggested_retail_price", { precision: 12, scale: 2 }),
    suggestedWholesalePrice: decimal("suggested_wholesale_price", { precision: 12, scale: 2 }), // Optional
    targetLaunchDate: timestamp("target_launch_date"),
    targetQuantity: int("target_quantity"), // Estimated production qty for label ordering
    notes: longtext("notes"), // Design description, requests, feedback
    isPreliminary: boolean("is_preliminary").default(true).notNull(), // Can be updated before market release
    designImageStorageKey: varchar("design_image_storage_key", { length: 512 }),
    designImageUrl: varchar("design_image_url", { length: 1024 }),
    currentStage: mysqlEnum("current_stage", [
      "concept",
      "pre_production",
      "final_product",
      "market_approval",
    ])
      .default("concept")
      .notNull(),
    status: mysqlEnum("status", ["in_progress", "approved", "rejected", "revision_requested"])
      .default("in_progress")
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
    contractIdIdx: index("contract_id_idx").on(table.contractId),
    itemNumberIdx: index("item_number_idx").on(table.itemNumber),
  })
);

export type ProductSubmission = typeof productSubmissions.$inferSelect;
export type InsertProductSubmission = typeof productSubmissions.$inferInsert;

/**
 * Submission Approvals table - tracks 4-stage approval pipeline
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
      "approved",
      "rejected",
      "revision_requested",
      "resubmitted",
    ])
      .default("pending")
      .notNull(),
    reviewedBy: int("reviewed_by"),
    reviewedAt: timestamp("reviewed_at"),
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
    commentedBy: int("commented_by").notNull(),
    comment: longtext("comment").notNull(),
    isRevisionRequest: boolean("is_revision_request").default(false).notNull(),
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
 * Submission Files table - stores uploaded files for each submission stage
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
    fileName: varchar("file_name", { length: 255 }).notNull(),
    storageKey: varchar("storage_key", { length: 512 }).notNull(),
    storageUrl: varchar("storage_url", { length: 1024 }).notNull(),
    fileSize: int("file_size"),
    mimeType: varchar("mime_type", { length: 100 }),
    uploadedBy: int("uploaded_by").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    submissionIdIdx: index("submission_id_idx").on(table.submissionId),
  })
);

export type SubmissionFile = typeof submissionFiles.$inferSelect;
export type InsertSubmissionFile = typeof submissionFiles.$inferInsert;

/**
 * Exchange Rates table - stores historical exchange rates for currency conversion
 */
export const exchangeRates = mysqlTable(
  "exchange_rates",
  {
    id: int("id").autoincrement().primaryKey(),
    fromCurrency: varchar("from_currency", { length: 3 }).notNull(),
    toCurrency: varchar("to_currency", { length: 3 }).notNull(),
    rate: decimal("rate", { precision: 10, scale: 6 }).notNull(),
    rateDate: timestamp("rate_date").notNull(),
    source: varchar("source", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    currencyPairIdx: index("currency_pair_idx").on(table.fromCurrency, table.toCurrency),
    rateDateIdx: index("rate_date_idx").on(table.rateDate),
  })
);

export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertExchangeRate = typeof exchangeRates.$inferInsert;

/**
 * Royalty Reports table - stores quarterly royalty submissions with multi-currency support
 */
export const royaltyReports = mysqlTable(
  "royalty_reports",
  {
    id: int("id").autoincrement().primaryKey(),
    licenseeId: int("licensee_id").notNull(),
    contractId: int("contract_id").notNull(),
    reportingPeriod: varchar("reporting_period", { length: 20 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    grossSales: decimal("gross_sales", { precision: 15, scale: 2 }).notNull(),
    deductions: decimal("deductions", { precision: 15, scale: 2 }).default(0),
    netSales: decimal("net_sales", { precision: 15, scale: 2 }).notNull(),
    exchangeRate: decimal("exchange_rate", { precision: 10, scale: 6 }).default(1),
    exchangeRateDate: timestamp("exchange_rate_date"),
    grossSalesUSD: decimal("gross_sales_usd", { precision: 15, scale: 2 }),
    netSalesUSD: decimal("net_sales_usd", { precision: 15, scale: 2 }),
    royaltyRate: decimal("royalty_rate", { precision: 5, scale: 2 }).notNull(),
    royaltyDue: decimal("royalty_due", { precision: 15, scale: 2 }).notNull(),
    royaltyDueUSD: decimal("royalty_due_usd", { precision: 15, scale: 2 }),
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
    reportingPeriodIdx: index("reporting_period_idx").on(table.reportingPeriod),
  })
);

export type RoyaltyReport = typeof royaltyReports.$inferSelect;
export type InsertRoyaltyReport = typeof royaltyReports.$inferInsert;

/**
 * Royalty Calculations table - stores detailed calculation breakdown
 */
export const royaltyCalculations = mysqlTable(
  "royalty_calculations",
  {
    id: int("id").autoincrement().primaryKey(),
    reportId: int("report_id").notNull(),
    contractTermsId: int("contract_terms_id").notNull(),
    grossSales: decimal("gross_sales", { precision: 15, scale: 2 }).notNull(),
    deductionsApplied: decimal("deductions_applied", { precision: 15, scale: 2 }).default(0),
    netSales: decimal("net_sales", { precision: 15, scale: 2 }).notNull(),
    royaltyRate: decimal("royalty_rate", { precision: 5, scale: 2 }).notNull(),
    royaltyDue: decimal("royalty_due", { precision: 15, scale: 2 }).notNull(),
    minimumGuarantee: decimal("minimum_guarantee", { precision: 15, scale: 2 }),
    mgRecoupment: decimal("mg_recoupment", { precision: 15, scale: 2 }).default(0),
    excessRoyalty: decimal("excess_royalty", { precision: 15, scale: 2 }).default(0),
    notes: longtext("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    reportIdIdx: index("report_id_idx").on(table.reportId),
  })
);

export type RoyaltyCalculation = typeof royaltyCalculations.$inferSelect;
export type InsertRoyaltyCalculation = typeof royaltyCalculations.$inferInsert;

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
      "royalty_overdue",
      "submission_reminder",
    ]).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: longtext("message").notNull(),
    relatedEntityId: int("related_entity_id"),
    relatedEntityType: varchar("related_entity_type", { length: 100 }),
    isRead: boolean("is_read").default(false).notNull(),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    typeIdx: index("type_idx").on(table.type),
  })
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Quarterly Reminders table - tracks royalty submission reminders
 */
export const quarterlyReminders = mysqlTable(
  "quarterly_reminders",
  {
    id: int("id").autoincrement().primaryKey(),
    licenseeId: int("licensee_id").notNull(),
    contractId: int("contract_id").notNull(),
    quarter: varchar("quarter", { length: 10 }).notNull(),
    year: int("year").notNull(),
    reportingPeriod: varchar("reporting_period", { length: 20 }).notNull(),
    submissionDeadline: timestamp("submission_deadline").notNull(),
    reminderSentAt: timestamp("reminder_sent_at"),
    reportSubmitted: boolean("report_submitted").default(false).notNull(),
    submittedAt: timestamp("submitted_at"),
    followUpReminders: int("follow_up_reminders").default(0).notNull(),
    lastFollowUpAt: timestamp("last_follow_up_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
    contractIdIdx: index("contract_id_idx").on(table.contractId),
    quarterYearIdx: index("quarter_year_idx").on(table.quarter, table.year),
  })
);

export type QuarterlyReminder = typeof quarterlyReminders.$inferSelect;
export type InsertQuarterlyReminder = typeof quarterlyReminders.$inferInsert;


/**
 * Label Orders table - tracks security label purchase orders
 */
export const labelOrders = mysqlTable(
  "label_orders",
  {
    id: int("id").autoincrement().primaryKey(),
    licenseeId: int("licensee_id").notNull(),
    contractId: int("contract_id").notNull(),
    submissionId: int("submission_id").notNull(),
    quantity: int("quantity").notNull(),
    unitPrice: decimal("unit_price", { precision: 10, scale: 4 }).notNull(),
    totalCost: decimal("total_cost", { precision: 15, scale: 2 }).notNull(),
    courierFee: decimal("courier_fee", { precision: 12, scale: 2 }).default(0),
    totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
    requestedArrivalDate: timestamp("requested_arrival_date"),
    status: mysqlEnum("status", [
      "pending",
      "approved",
      "invoiced",
      "paid",
      "manufactured",
      "shipped",
      "delivered",
      "cancelled",
    ])
      .default("pending")
      .notNull(),
    invoiceNumber: varchar("invoice_number", { length: 100 }),
    invoiceGeneratedAt: timestamp("invoice_generated_at"),
    paymentReceivedAt: timestamp("payment_received_at"),
    shippedAt: timestamp("shipped_at"),
    deliveredAt: timestamp("delivered_at"),
    serialNumbersAssigned: boolean("serial_numbers_assigned").default(false).notNull(),
    notes: longtext("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
    contractIdIdx: index("contract_id_idx").on(table.contractId),
    submissionIdIdx: index("submission_id_idx").on(table.submissionId),
  })
);

export type LabelOrder = typeof labelOrders.$inferSelect;
export type InsertLabelOrder = typeof labelOrders.$inferInsert;

/**
 * Contract Status History table - tracks contract lifecycle
 */
export const contractStatusHistory = mysqlTable(
  "contract_status_history",
  {
    id: int("id").autoincrement().primaryKey(),
    contractId: int("contract_id").notNull(),
    status: mysqlEnum("status", [
      "draft",
      "signed",
      "mg_invoiced",
      "mg_paid",
      "fully_executed",
      "active",
      "expired",
      "terminated",
    ]).notNull(),
    statusChangedAt: timestamp("status_changed_at").defaultNow().notNull(),
    changedBy: int("changed_by"),
    notes: longtext("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    contractIdIdx: index("contract_id_idx").on(table.contractId),
    statusIdx: index("status_idx").on(table.status),
  })
);

export type ContractStatusHistory = typeof contractStatusHistory.$inferSelect;
export type InsertContractStatusHistory = typeof contractStatusHistory.$inferInsert;

/**
 * Invoices table - tracks all invoices (MG, Label Orders, Excess Royalties)
 */
export const invoices = mysqlTable(
  "invoices",
  {
    id: int("id").autoincrement().primaryKey(),
    invoiceNumber: varchar("invoice_number", { length: 100 }).unique().notNull(),
    invoiceType: mysqlEnum("invoice_type", ["mg", "label_order", "excess_royalty"]).notNull(),
    licenseeId: int("licensee_id").notNull(),
    contractId: int("contract_id").notNull(),
    relatedEntityId: int("related_entity_id"),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    invoiceDate: timestamp("invoice_date").notNull(),
    dueDate: timestamp("due_date").notNull(),
    status: mysqlEnum("status", ["issued", "paid", "overdue", "cancelled"])
      .default("issued")
      .notNull(),
    paidAt: timestamp("paid_at"),
    paymentMethod: varchar("payment_method", { length: 100 }),
    storageKey: varchar("storage_key", { length: 512 }),
    storageUrl: varchar("storage_url", { length: 1024 }),
    notes: longtext("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    licenseeIdIdx: index("licensee_id_idx").on(table.licenseeId),
    contractIdIdx: index("contract_id_idx").on(table.contractId),
    invoiceNumberIdx: index("invoice_number_idx").on(table.invoiceNumber),
    invoiceTypeIdx: index("invoice_type_idx").on(table.invoiceType),
  })
);

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;
