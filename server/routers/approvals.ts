import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as approvals from "../features/productApproval";
import { Decimal } from "decimal.js";

export const approvalsRouter = router({
  // Create product submission
  createSubmission: protectedProcedure
    .input(
      z.object({
        contractId: z.number(),
        licensedProductId: z.number().optional(),
        itemNumber: z.string().optional(),
        productName: z.string(),
        description: z.string().optional(),
        suggestedRetailPrice: z.string().optional(),
        suggestedWholesalePrice: z.string().optional(),
        targetLaunchDate: z.string().optional(),
        targetQuantity: z.number().optional(),
        notes: z.string().optional(),
        designImageStorageKey: z.string().optional(),
        designImageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensee" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await approvals.createProductSubmission({
        contractId: input.contractId,
        licenseeId: ctx.user.id,
        itemNumber: input.itemNumber || `SKU-${Date.now()}`,
        licensedProductId: input.licensedProductId || 1,
        productName: input.productName,
        description: input.description,
        suggestedRetailPrice: input.suggestedRetailPrice ? new Decimal(input.suggestedRetailPrice) : undefined,
        suggestedWholesalePrice: input.suggestedWholesalePrice ? new Decimal(input.suggestedWholesalePrice) : undefined,
        targetLaunchDate: input.targetLaunchDate ? new Date(input.targetLaunchDate) : undefined,
        targetQuantity: input.targetQuantity,
        notes: input.notes,
        designImageStorageKey: input.designImageStorageKey,
        designImageUrl: input.designImageUrl,
        currentStage: "concept",
        status: "in_progress",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }),

  // Get submission by ID
  getSubmission: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ input }) => {
      return await approvals.getProductSubmissionById(input.submissionId);
    }),

  // Get all submissions for licensee
  getMySubmissions: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "licensee" && ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // This would need a query to get all submissions for licensee
    // For now, returning empty array as placeholder
    return [];
  }),

  // Get all submissions for contract (for reviewers)
  getSubmissionsForContract: protectedProcedure
    .input(z.object({ contractId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin" && ctx.user?.role !== "reviewer") {
        throw new Error("Unauthorized");
      }

      return await approvals.getSubmissionsForContract(input.contractId);
    }),

  // Update submission status
  updateSubmissionStatus: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        status: z.enum(["in_progress", "approved", "rejected", "revision_requested"]),
        currentStage: z.enum(["concept", "pre_production", "final_product", "market_approval"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin" && ctx.user?.role !== "reviewer") {
        throw new Error("Unauthorized");
      }

      return await approvals.updateProductSubmission(input.submissionId, {
        status: input.status,
        currentStage: input.currentStage,
        updatedAt: new Date(),
      });
    }),

  // Add comment to submission
  addComment: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        comment: z.string(),
        isRevisionRequest: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin" && ctx.user?.role !== "reviewer") {
        throw new Error("Unauthorized");
      }

      return await approvals.addApprovalComment({
        submissionId: input.submissionId,
        comment: input.comment,
        isRevisionRequest: input.isRevisionRequest || false,
        commentedBy: ctx.user.id,
      });
    }),

  // Get comments for submission
  getComments: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ input }) => {
      return await approvals.getApprovalComments(input.submissionId);
    }),

  // Upload submission file
  uploadFile: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        stage: z.enum(["concept", "pre_production", "final_product", "market_approval"]),
        fileName: z.string().optional(),
        storageUrl: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensee" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await approvals.uploadSubmissionFile({
        submissionId: input.submissionId,
        stage: input.stage,
        fileName: input.fileName || input.storageUrl.split('/').pop() || 'unknown',
        storageUrl: input.storageUrl,
        storageKey: input.storageUrl.split('/').pop() || 'unknown',
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        uploadedBy: ctx.user.id,
      });
    }),

  // Get files for submission stage
  getStageFiles: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        stage: z.enum(["concept", "pre_production", "final_product", "market_approval"]),
      })
    )
    .query(async ({ input }) => {
      return await approvals.getSubmissionFiles(input.submissionId, input.stage);
    }),

  // Get pending approvals for reviewer
  getPendingApprovals: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "reviewer" && ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await approvals.getPendingApprovalsForReviewer(ctx.user.id);
  }),

  // Approve stage
  approveStage: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        stage: z.enum(["concept", "pre_production", "final_product", "market_approval"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "reviewer" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await approvals.approveSubmissionStage(input.submissionId, input.stage);
    }),

  // Request revision
  requestRevision: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        stage: z.enum(["concept", "pre_production", "final_product", "market_approval"]),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "reviewer" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await approvals.requestRevision(input.submissionId, input.stage, input.comment, ctx.user.id);
    }),

  // Reject submission
  rejectSubmission: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        stage: z.enum(["concept", "pre_production", "final_product", "market_approval"]),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "reviewer" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await approvals.rejectSubmission(input.submissionId, input.stage, input.reason, ctx.user.id);
    }),

  // Resubmit after revision
  resubmitAfterRevision: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        stage: z.enum(["concept", "pre_production", "final_product", "market_approval"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensee" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await approvals.resubmitAfterRevision(input.submissionId, input.stage);
    }),
});
