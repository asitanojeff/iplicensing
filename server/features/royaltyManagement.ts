import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import {
  royaltyReports,
  royaltyCalculations,
  contractTerms,
  InsertRoyaltyReport,
  InsertRoyaltyCalculation,
} from "../../drizzle/schema";
import Decimal from "decimal.js";

/**
 * Create a new royalty report
 */
export async function createRoyaltyReport(data: InsertRoyaltyReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(royaltyReports).values(data);
  return result;
}

/**
 * Get royalty report by ID
 */
export async function getRoyaltyReportById(reportId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(royaltyReports)
    .where(eq(royaltyReports.id, reportId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update royalty report
 */
export async function updateRoyaltyReport(
  reportId: number,
  updates: Partial<Omit<typeof royaltyReports.$inferInsert, "id">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(royaltyReports)
    .set(updates)
    .where(eq(royaltyReports.id, reportId));
}

/**
 * Calculate royalties based on contract terms and sales data
 * Returns: { royaltyDue, mgRecoupment, excessRoyalty }
 */
export async function calculateRoyalties(
  contractTermsId: number,
  grossSales: number | string,
  deductions: number | string = 0,
  previousMgRecoupment: number | string = 0
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Fetch contract terms
  const terms = await db
    .select()
    .from(contractTerms)
    .where(eq(contractTerms.id, contractTermsId))
    .limit(1);

  if (terms.length === 0) {
    throw new Error("Contract terms not found");
  }

  const term = terms[0];

  // Use Decimal for precise financial calculations
  const gross = new Decimal(grossSales);
  const deduct = new Decimal(deductions);
  const netSales = gross.minus(deduct);

  const royaltyRate = new Decimal(term.royaltyRate || 0).dividedBy(100);
  const royaltyDue = netSales.times(royaltyRate);

  const mg = new Decimal(term.minimumGuarantee || 0);
  const prevMgRecoup = new Decimal(previousMgRecoupment);

  // Calculate MG recoupment
  let mgRecoupment = new Decimal(0);
  let excessRoyalty = new Decimal(0);

  if (mg.greaterThan(0)) {
    const remainingMg = mg.minus(prevMgRecoup);

    if (royaltyDue.greaterThan(remainingMg)) {
      mgRecoupment = remainingMg;
      excessRoyalty = royaltyDue.minus(remainingMg);
    } else {
      mgRecoupment = royaltyDue;
      excessRoyalty = new Decimal(0);
    }
  } else {
    excessRoyalty = royaltyDue;
  }

  return {
    netSales: netSales.toNumber(),
    royaltyDue: royaltyDue.toNumber(),
    mgRecoupment: mgRecoupment.toNumber(),
    excessRoyalty: excessRoyalty.toNumber(),
  };
}

/**
 * Create royalty calculation record
 */
export async function createRoyaltyCalculation(data: InsertRoyaltyCalculation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(royaltyCalculations).values(data);
  return result;
}

/**
 * Get royalty calculations for a report
 */
export async function getRoyaltyCalculations(reportId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(royaltyCalculations)
    .where(eq(royaltyCalculations.royaltyReportId, reportId));
}

/**
 * Submit royalty report
 */
export async function submitRoyaltyReport(reportId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await updateRoyaltyReport(reportId, {
    status: "submitted",
    submittedAt: new Date(),
  });
}

/**
 * Approve royalty report
 */
export async function approveRoyaltyReport(reportId: number, approvedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await updateRoyaltyReport(reportId, {
    status: "approved",
    reviewedAt: new Date(),
    reviewedBy: approvedBy,
  });
}

/**
 * Reject royalty report
 */
export async function rejectRoyaltyReport(reportId: number, rejectedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await updateRoyaltyReport(reportId, {
    status: "draft",
    reviewedAt: new Date(),
    reviewedBy: rejectedBy,
  });
}

/**
 * Generate invoice for excess royalties
 */
export async function generateExcessRoyaltyInvoice(reportId: number, invoiceNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await updateRoyaltyReport(reportId, {
    status: "invoiced",
    invoiceGenerated: true,
    invoiceNumber,
  });
}

/**
 * Mark royalty report as paid
 */
export async function markRoyaltyReportAsPaid(reportId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await updateRoyaltyReport(reportId, {
    status: "paid",
  });
}

/**
 * Get royalty reports by status
 */
export async function getRoyaltyReportsByStatus(contractId: number, status: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(royaltyReports)
    .where(
      and(
        eq(royaltyReports.contractId, contractId),
        eq(royaltyReports.status, status as any)
      )
    );
}

/**
 * Get overdue royalty reports
 */
export async function getOverdueRoyaltyReports(contractId: number) {
  const db = await getDb();
  if (!db) return [];

  // Reports that are submitted but not approved/invoiced for more than 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return await db
    .select()
    .from(royaltyReports)
    .where(
      and(
        eq(royaltyReports.contractId, contractId),
        eq(royaltyReports.status, "submitted")
        // Would need date comparison in real query
      )
    );
}

/**
 * Calculate total royalty income for a period
 */
export async function calculateTotalRoyaltyIncome(
  contractId: number,
  startDate: Date,
  endDate: Date
) {
  const db = await getDb();
  if (!db) return 0;

  const reports = await db
    .select()
    .from(royaltyReports)
    .where(
      and(
        eq(royaltyReports.contractId, contractId),
        eq(royaltyReports.status, "paid")
      )
    );

  let total = new Decimal(0);
  for (const report of reports) {
    const reportDate = new Date(report.createdAt);
    if (reportDate >= startDate && reportDate <= endDate) {
      total = total.plus(new Decimal(report.excessRoyalty || 0));
    }
  }

  return total.toNumber();
}

/**
 * Get royalty summary for a licensee
 */
export async function getRoyaltySummary(licenseeId: number, contractId: number) {
  const db = await getDb();
  if (!db)
    return {
      totalReports: 0,
      totalRoyalties: 0,
      totalMgRecoupment: 0,
      pendingReports: 0,
      approvedReports: 0,
    };

  const reports = await db
    .select()
    .from(royaltyReports)
    .where(
      and(
        eq(royaltyReports.licenseeId, licenseeId),
        eq(royaltyReports.contractId, contractId)
      )
    );

  let totalRoyalties = new Decimal(0);
  let totalMgRecoupment = new Decimal(0);
  let pendingReports = 0;
  let approvedReports = 0;

  for (const report of reports) {
    totalRoyalties = totalRoyalties.plus(new Decimal(report.royaltyDue || 0));
    totalMgRecoupment = totalMgRecoupment.plus(new Decimal(report.mgRecoupment || 0));

    if (report.status === "submitted" || report.status === "under_review") {
      pendingReports++;
    } else if (report.status === "approved" || report.status === "paid") {
      approvedReports++;
    }
  }

  return {
    totalReports: reports.length,
    totalRoyalties: totalRoyalties.toNumber(),
    totalMgRecoupment: totalMgRecoupment.toNumber(),
    pendingReports,
    approvedReports,
  };
}
