import { eq, and } from "drizzle-orm";
import { getDb } from "../db";
import {
  productSubmissions,
  submissionApprovals,
  approvalComments,
  submissionFiles,
  InsertProductSubmission,
  InsertSubmissionApproval,
  InsertApprovalComment,
  InsertSubmissionFile,
} from "../../drizzle/schema";

/**
 * 4-stage approval pipeline stages in order
 */
export const APPROVAL_STAGES = ["concept", "pre_production", "final_product", "market_approval"] as const;
export type ApprovalStage = (typeof APPROVAL_STAGES)[number];

/**
 * Create a new product submission
 */
export async function createProductSubmission(data: InsertProductSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(productSubmissions).values(data);
  return result;
}

/**
 * Get product submission by ID
 */
export async function getProductSubmissionById(submissionId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(productSubmissions)
    .where(eq(productSubmissions.id, submissionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update product submission
 */
export async function updateProductSubmission(
  submissionId: number,
  updates: Partial<Omit<typeof productSubmissions.$inferInsert, "id">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(productSubmissions)
    .set(updates)
    .where(eq(productSubmissions.id, submissionId));
}

/**
 * Get next stage in approval pipeline
 */
export function getNextApprovalStage(currentStage: ApprovalStage): ApprovalStage | null {
  const currentIndex = APPROVAL_STAGES.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === APPROVAL_STAGES.length - 1) {
    return null;
  }
  return APPROVAL_STAGES[currentIndex + 1];
}

/**
 * Get previous stage in approval pipeline
 */
export function getPreviousApprovalStage(currentStage: ApprovalStage): ApprovalStage | null {
  const currentIndex = APPROVAL_STAGES.indexOf(currentStage);
  if (currentIndex <= 0) {
    return null;
  }
  return APPROVAL_STAGES[currentIndex - 1];
}

/**
 * Create approval record for a stage
 */
export async function createSubmissionApproval(data: InsertSubmissionApproval) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(submissionApprovals).values(data);
  return result;
}

/**
 * Get approval record for a submission stage
 */
export async function getSubmissionApprovalForStage(submissionId: number, stage: ApprovalStage) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(submissionApprovals)
    .where(
      and(
        eq(submissionApprovals.submissionId, submissionId),
        eq(submissionApprovals.stage, stage)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all approvals for a submission
 */
export async function getSubmissionApprovals(submissionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(submissionApprovals)
    .where(eq(submissionApprovals.submissionId, submissionId));
}

/**
 * Update approval status
 */
export async function updateApprovalStatus(
  approvalId: number,
  updates: Partial<Omit<typeof submissionApprovals.$inferInsert, "id">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(submissionApprovals)
    .set(updates)
    .where(eq(submissionApprovals.id, approvalId));
}

/**
 * Add comment to approval
 */
export async function addApprovalComment(data: InsertApprovalComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(approvalComments).values(data);
  return result;
}

/**
 * Get comments for an approval
 */
export async function getApprovalComments(approvalId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(approvalComments)
    .where(eq(approvalComments.approvalId, approvalId));
}

/**
 * Get all comments for a submission
 */
export async function getSubmissionComments(submissionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(approvalComments)
    .where(eq(approvalComments.submissionId, submissionId));
}

/**
 * Upload submission file
 */
export async function uploadSubmissionFile(data: InsertSubmissionFile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(submissionFiles).values(data);
  return result;
}

/**
 * Get files for a submission stage
 */
export async function getSubmissionStageFiles(submissionId: number, stage: ApprovalStage) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(submissionFiles)
    .where(
      and(
        eq(submissionFiles.submissionId, submissionId),
        eq(submissionFiles.stage, stage)
      )
    );
}

/**
 * Get all files for a submission
 */
export async function getSubmissionFiles(submissionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(submissionFiles)
    .where(eq(submissionFiles.submissionId, submissionId));
}

/**
 * Approve submission and move to next stage
 */
export async function approveSubmissionStage(
  submissionId: number,
  currentStage: ApprovalStage,
  reviewedBy: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const nextStage = getNextApprovalStage(currentStage);
  const newCurrentStage = nextStage || "approved";

  // Update submission current stage
  await updateProductSubmission(submissionId, {
    currentStage: newCurrentStage,
    lastUpdated: new Date(),
  });

  // Update approval status
  const approval = await getSubmissionApprovalForStage(submissionId, currentStage);
  if (approval) {
    await updateApprovalStatus(approval.id, {
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy,
    });
  }

  // Create approval record for next stage if it exists
  if (nextStage) {
    await createSubmissionApproval({
      submissionId,
      stage: nextStage,
      status: "pending",
    });
  }
}

/**
 * Request revision for a stage
 */
export async function requestRevision(
  submissionId: number,
  stage: ApprovalStage,
  comment: string,
  requestedBy: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Update approval status to revision_requested
  const approval = await getSubmissionApprovalForStage(submissionId, stage);
  if (approval) {
    await updateApprovalStatus(approval.id, {
      status: "revision_requested",
      reviewedAt: new Date(),
      reviewedBy: requestedBy,
    });

    // Add comment
    await addApprovalComment({
      approvalId: approval.id,
      submissionId,
      commentType: "revision_request",
      content: comment,
      createdBy: requestedBy,
    });
  }

  // Update submission to show revision requested
  await updateProductSubmission(submissionId, {
    lastUpdated: new Date(),
  });
}

/**
 * Reject submission
 */
export async function rejectSubmission(
  submissionId: number,
  stage: ApprovalStage,
  reason: string,
  rejectedBy: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Update approval status
  const approval = await getSubmissionApprovalForStage(submissionId, stage);
  if (approval) {
    await updateApprovalStatus(approval.id, {
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy: rejectedBy,
    });

    // Add comment
    await addApprovalComment({
      approvalId: approval.id,
      submissionId,
      commentType: "feedback",
      content: reason,
      createdBy: rejectedBy,
    });
  }

  // Update submission status
  await updateProductSubmission(submissionId, {
    currentStage: "rejected",
    lastUpdated: new Date(),
  });
}

/**
 * Resubmit after revision
 */
export async function resubmitAfterRevision(submissionId: number, stage: ApprovalStage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Update approval status back to pending
  const approval = await getSubmissionApprovalForStage(submissionId, stage);
  if (approval) {
    await updateApprovalStatus(approval.id, {
      status: "pending",
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
    });
  }

  // Update submission
  await updateProductSubmission(submissionId, {
    lastUpdated: new Date(),
  });
}

/**
 * Get pending approvals for a reviewer
 */
export async function getPendingApprovalsForReviewer(reviewerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(submissionApprovals)
    .where(
      and(
        eq(submissionApprovals.assignedTo, reviewerId),
        eq(submissionApprovals.status, "pending")
      )
    );
}
