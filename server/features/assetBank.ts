import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import {
  ipAssets,
  assetVersions,
  assetPermissions,
  InsertIpAsset,
  InsertAssetVersion,
  InsertAssetPermission,
} from "../../drizzle/schema";

/**
 * Create a new IP asset
 */
export async function createIpAsset(data: InsertIpAsset) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(ipAssets).values(data);
  return result;
}

/**
 * Get asset by ID with version info
 */
export async function getAssetById(assetId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(ipAssets)
    .where(eq(ipAssets.id, assetId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all assets for a licensor
 */
export async function getLicensorAssets(licensorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(ipAssets)
    .where(eq(ipAssets.licensorId, licensorId));
}

/**
 * Update asset metadata
 */
export async function updateAsset(
  assetId: number,
  updates: Partial<Omit<typeof ipAssets.$inferInsert, "id">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(ipAssets).set(updates).where(eq(ipAssets.id, assetId));
}

/**
 * Create a new version of an asset
 */
export async function createAssetVersion(data: InsertAssetVersion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assetVersions).values(data);
  return result;
}

/**
 * Get all versions of an asset
 */
export async function getAssetVersions(assetId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(assetVersions)
    .where(eq(assetVersions.assetId, assetId));
}

/**
 * Increment download count for an asset version
 */
export async function incrementDownloadCount(versionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const version = await db
    .select()
    .from(assetVersions)
    .where(eq(assetVersions.id, versionId))
    .limit(1);

  if (version.length === 0) throw new Error("Version not found");

  await db
    .update(assetVersions)
    .set({ downloadCount: version[0].downloadCount + 1 })
    .where(eq(assetVersions.id, versionId));
}

/**
 * Grant asset permission to a licensee
 */
export async function grantAssetPermission(data: InsertAssetPermission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assetPermissions).values(data);
  return result;
}

/**
 * Get permissions for an asset
 */
export async function getAssetPermissions(assetId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(assetPermissions)
    .where(eq(assetPermissions.assetId, assetId));
}

/**
 * Check if licensee has permission to access asset
 */
export async function canLicenseeAccessAsset(
  licenseeId: number,
  assetId: number,
  action: "view" | "download"
) {
  const db = await getDb();
  if (!db) return false;

  const permission = await db
    .select()
    .from(assetPermissions)
    .where(
      and(
        eq(assetPermissions.licenseeId, licenseeId),
        eq(assetPermissions.assetId, assetId)
      )
    )
    .limit(1);

  if (permission.length === 0) return false;

  const perm = permission[0];
  if (action === "view") return perm.canView;
  if (action === "download") return perm.canDownload;

  return false;
}

/**
 * Revoke asset permission from a licensee
 */
export async function revokeAssetPermission(assetId: number, licenseeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(assetPermissions)
    .where(
      and(
        eq(assetPermissions.assetId, assetId),
        eq(assetPermissions.licenseeId, licenseeId)
      )
    );
}

/**
 * Update asset permission
 */
export async function updateAssetPermission(
  assetId: number,
  licenseeId: number,
  updates: Partial<Omit<typeof assetPermissions.$inferInsert, "id">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(assetPermissions)
    .set(updates)
    .where(
      and(
        eq(assetPermissions.assetId, assetId),
        eq(assetPermissions.licenseeId, licenseeId)
      )
    );
}

/**
 * Get assets expiring soon
 */
export async function getExpiringAssets(licensorId: number, daysThreshold = 30) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  const threshold = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

  return await db
    .select()
    .from(ipAssets)
    .where(
      and(
        eq(ipAssets.licensorId, licensorId),
        // This would need a more complex query in real implementation
        // For now, returning all active assets
        eq(ipAssets.isActive, true)
      )
    );
}
