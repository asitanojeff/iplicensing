import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import { securityLabels, InsertSecurityLabel } from "../../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * Generate a unique label code
 */
export function generateLabelCode(): string {
  return `LBL-${Date.now()}-${nanoid(8)}`;
}

/**
 * Generate a unique serial number
 */
export function generateSerialNumber(): string {
  return `SN-${Date.now()}-${nanoid(12)}`;
}

/**
 * Generate QR code data (in real implementation, would use QR library)
 */
export function generateQRCodeData(labelCode: string, serialNumber: string): string {
  return `https://verify.iplicense.com/label/${labelCode}/${serialNumber}`;
}

/**
 * Create security labels in bulk
 */
export async function createSecurityLabels(
  licenseeId: number,
  contractId: number,
  quantity: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const labels: InsertSecurityLabel[] = [];

  for (let i = 0; i < quantity; i++) {
    const labelCode = generateLabelCode();
    const serialNumber = generateSerialNumber();
    const qrCode = generateQRCodeData(labelCode, serialNumber);

    labels.push({
      licenseeId,
      contractId,
      labelCode,
      serialNumber,
      qrCode,
      status: "available",
    });
  }

  const result = await db.insert(securityLabels).values(labels);
  return result;
}

/**
 * Get security label by ID
 */
export async function getSecurityLabelById(labelId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(securityLabels)
    .where(eq(securityLabels.id, labelId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get security label by code
 */
export async function getSecurityLabelByCode(labelCode: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(securityLabels)
    .where(eq(securityLabels.labelCode, labelCode))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get security label by serial number
 */
export async function getSecurityLabelBySerial(serialNumber: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(securityLabels)
    .where(eq(securityLabels.serialNumber, serialNumber))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Assign label to a product
 */
export async function assignLabelToProduct(labelId: number, productName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(securityLabels)
    .set({
      status: "assigned",
      assignedToProduct: productName,
      assignedDate: new Date(),
    })
    .where(eq(securityLabels.id, labelId));
}

/**
 * Mark label as used in royalty report
 */
export async function markLabelAsUsed(labelId: number, royaltyReportId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(securityLabels)
    .set({
      status: "used",
      usedInRoyaltyReport: royaltyReportId,
    })
    .where(eq(securityLabels.id, labelId));
}

/**
 * Verify label (increment verification count)
 */
export async function verifyLabel(labelId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const label = await getSecurityLabelById(labelId);
  if (!label) throw new Error("Label not found");

  await db
    .update(securityLabels)
    .set({
      status: "verified",
      verificationCount: label.verificationCount + 1,
      lastVerifiedAt: new Date(),
    })
    .where(eq(securityLabels.id, labelId));
}

/**
 * Flag label as counterfeit
 */
export async function flagLabelAsCounterfeit(labelId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(securityLabels)
    .set({
      status: "counterfeit_flagged",
    })
    .where(eq(securityLabels.id, labelId));
}

/**
 * Get available labels for a licensee
 */
export async function getAvailableLabelsForLicensee(licenseeId: number, contractId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(securityLabels)
    .where(
      and(
        eq(securityLabels.licenseeId, licenseeId),
        eq(securityLabels.contractId, contractId),
        eq(securityLabels.status, "available")
      )
    );
}

/**
 * Get label inventory for a licensee
 */
export async function getLabelInventory(licenseeId: number, contractId: number) {
  const db = await getDb();
  if (!db)
    return {
      available: 0,
      assigned: 0,
      used: 0,
      verified: 0,
      counterfeitFlagged: 0,
      total: 0,
    };

  const labels = await db
    .select()
    .from(securityLabels)
    .where(
      and(
        eq(securityLabels.licenseeId, licenseeId),
        eq(securityLabels.contractId, contractId)
      )
    );

  const inventory = {
    available: 0,
    assigned: 0,
    used: 0,
    verified: 0,
    counterfeitFlagged: 0,
    total: labels.length,
  };

  for (const label of labels) {
    switch (label.status) {
      case "available":
        inventory.available++;
        break;
      case "assigned":
        inventory.assigned++;
        break;
      case "used":
        inventory.used++;
        break;
      case "verified":
        inventory.verified++;
        break;
      case "counterfeit_flagged":
        inventory.counterfeitFlagged++;
        break;
    }
  }

  return inventory;
}

/**
 * Get labels used in a royalty report
 */
export async function getLabelsUsedInReport(royaltyReportId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(securityLabels)
    .where(eq(securityLabels.usedInRoyaltyReport, royaltyReportId));
}

/**
 * Verify label authenticity by code/serial
 */
export async function verifyLabelAuthenticity(labelCode: string, serialNumber: string) {
  const label = await getSecurityLabelByCode(labelCode);

  if (!label) {
    return {
      isValid: false,
      reason: "Label not found",
      label: null,
    };
  }

  if (label.serialNumber !== serialNumber) {
    return {
      isValid: false,
      reason: "Serial number mismatch",
      label,
    };
  }

  if (label.status === "counterfeit_flagged") {
    return {
      isValid: false,
      reason: "Label flagged as counterfeit",
      label,
    };
  }

  // Increment verification count
  await verifyLabel(label.id);

  return {
    isValid: true,
    reason: "Label verified",
    label,
  };
}

/**
 * Get counterfeit reports
 */
export async function getCounterfeitLabels(contractId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(securityLabels)
    .where(
      and(
        eq(securityLabels.contractId, contractId),
        eq(securityLabels.status, "counterfeit_flagged")
      )
    );
}
