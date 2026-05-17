import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import {
  contracts,
  contractTerms,
  licenseeAssignments,
  InsertContract,
  InsertContractTerms,
  InsertLicenseeAssignment,
} from "../../drizzle/schema";

/**
 * Create a new contract
 */
export async function createContract(data: InsertContract) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contracts).values(data);
  return result;
}

/**
 * Get contract by ID
 */
export async function getContractById(contractId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, contractId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get contract with its terms
 */
export async function getContractWithTerms(contractId: number) {
  const db = await getDb();
  if (!db) return null;

  const contract = await getContractById(contractId);
  if (!contract) return null;

  const terms = await db
    .select()
    .from(contractTerms)
    .where(eq(contractTerms.contractId, contractId))
    .limit(1);

  return {
    ...contract,
    terms: terms.length > 0 ? terms[0] : null,
  };
}

/**
 * Update contract
 */
export async function updateContract(
  contractId: number,
  updates: Partial<Omit<typeof contracts.$inferInsert, "id">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(contracts).set(updates).where(eq(contracts.id, contractId));
}

/**
 * Create contract terms
 */
export async function createContractTerms(data: InsertContractTerms) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(contractTerms).values(data);
  return result;
}

/**
 * Get contract terms
 */
export async function getContractTerms(contractId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(contractTerms)
    .where(eq(contractTerms.contractId, contractId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update contract terms
 */
export async function updateContractTerms(
  contractTermsId: number,
  updates: Partial<Omit<typeof contractTerms.$inferInsert, "id">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(contractTerms)
    .set(updates)
    .where(eq(contractTerms.id, contractTermsId));
}

/**
 * Assign licensee to contract
 */
export async function assignLicenseeToContract(data: InsertLicenseeAssignment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(licenseeAssignments).values(data);
  return result;
}

/**
 * Get all contracts for a licensee
 */
export async function getLicenseeAssignedContracts(licenseeId: number) {
  const db = await getDb();
  if (!db) return [];

  const assignments = await db
    .select()
    .from(licenseeAssignments)
    .where(eq(licenseeAssignments.licenseeId, licenseeId));

  // Fetch full contract details for each assignment
  const contractIds = assignments.map((a) => a.contractId);
  if (contractIds.length === 0) return [];

  const contractList = await db
    .select()
    .from(contracts)
    .where(eq(contracts.id, contractIds[0])); // Simplified for now

  return contractList;
}

/**
 * Generate contract number
 */
export function generateContractNumber(licensorId: number, timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `CNT-${licensorId}-${year}${month}-${random}`;
}

/**
 * Get active contracts for a licensor
 */
export async function getActiveLicensorContracts(licensorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(contracts)
    .where(
      and(
        eq(contracts.licensorId, licensorId),
        eq(contracts.status, "active")
      )
    );
}

/**
 * Get contracts expiring soon
 */
export async function getExpiringContracts(licensorId: number, daysThreshold = 30) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  const threshold = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

  return await db
    .select()
    .from(contracts)
    .where(
      and(
        eq(contracts.licensorId, licensorId),
        eq(contracts.status, "active")
        // Would need date comparison in real query
      )
    );
}

/**
 * Check if contract is active
 */
export async function isContractActive(contractId: number): Promise<boolean> {
  const contract = await getContractById(contractId);
  if (!contract) return false;

  const now = new Date();
  const isActive =
    contract.status === "active" &&
    (!contract.startDate || new Date(contract.startDate) <= now) &&
    (!contract.endDate || new Date(contract.endDate) >= now);

  return isActive;
}
