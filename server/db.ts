import { eq, and, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  contracts,
  ipAssets,
  assetPermissions,
  productSubmissions,
  royaltyReports,
  securityLabels,
  notifications,
  licenseeAssignments,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all contracts for a licensor
 */
export async function getLicensorContracts(licensorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(contracts)
    .where(eq(contracts.licensorId, licensorId));
}

/**
 * Get all contracts assigned to a licensee
 */
export async function getLicenseeContracts(licenseeId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(licenseeAssignments)
    .where(eq(licenseeAssignments.licenseeId, licenseeId));
}

/**
 * Get IP assets accessible to a licensee
 */
export async function getLicenseeAccessibleAssets(licenseeId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(ipAssets)
    .innerJoin(
      assetPermissions,
      and(
        eq(assetPermissions.assetId, ipAssets.id),
        eq(assetPermissions.licenseeId, licenseeId),
        eq(assetPermissions.canView, true)
      )
    );
}

/**
 * Get all product submissions for a licensee
 */
export async function getLicenseeSubmissions(licenseeId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(productSubmissions)
    .where(eq(productSubmissions.licenseeId, licenseeId));
}

/**
 * Get all product submissions for a contract (for licensor/reviewer)
 */
export async function getContractSubmissions(contractId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(productSubmissions)
    .where(eq(productSubmissions.contractId, contractId));
}

/**
 * Get all royalty reports for a licensee
 */
export async function getLicenseeRoyaltyReports(licenseeId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(royaltyReports)
    .where(eq(royaltyReports.licenseeId, licenseeId));
}

/**
 * Get all royalty reports for a contract (for licensor)
 */
export async function getContractRoyaltyReports(contractId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(royaltyReports)
    .where(eq(royaltyReports.contractId, contractId));
}

/**
 * Get security labels for a licensee
 */
export async function getLicenseeSecurityLabels(licenseeId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(securityLabels)
    .where(eq(securityLabels.licenseeId, licenseeId));
}

/**
 * Get unread notifications for a user
 */
export async function getUserNotifications(userId: number, unreadOnly = false) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(notifications).where(eq(notifications.userId, userId));

  if (unreadOnly) {
    query = query.where(eq(notifications.isRead, false));
  }

  return await query;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to mark notification as read:", error);
    return false;
  }
}

/**
 * Create a notification
 */
export async function createNotification(
  userId: number,
  type: string,
  title: string,
  message: string,
  relatedEntityType?: string,
  relatedEntityId?: number
) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(notifications).values({
      userId,
      type: type as any,
      title,
      message,
      relatedEntityType,
      relatedEntityId,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create notification:", error);
    return null;
  }
}

/**
 * Get all users with a specific role
 */
export async function getUsersByRole(role: string) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(users).where(eq(users.role, role as any));
}

/**
 * Update user role
 */
export async function updateUserRole(userId: number, newRole: string) {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(users)
      .set({ role: newRole as any })
      .where(eq(users.id, userId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update user role:", error);
    return false;
  }
}
