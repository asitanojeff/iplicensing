import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as approvals from "../features/productApproval";

export const approvalsRouter = router({
  // Create product submission
  createSubmission: protectedProcedure
    .input(
      z.object({
        contractId: z.number(),
        itemNumber: z.string().optional(),
        productName: z.string(),
        description: z.string().optional(),
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
        licensedProductId: 1, // Default - should come from contract terms
        productName: input.productName,
        description: input.description,
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

  // Get pending approvals for reviewer
  getPendingApprovals: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "reviewer" && ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await approvals.getPendingApprovalsForReviewer(ctx.user.id);
  }),

  // Get approval record for stage
  getApprovalForStage: protectedProcedure
    .input(
      z.object({
        submissionId: z.number(),
        stage: z.enum(["concept", "pre_production", "final_product", "market_approval"]),
      })
    )
    .query(async ({ input }) => {
      return await approvals.getSubmissionApprovalForStage(input.submissionId, input.stage);
    }),

  // Get all approvals for submission
  getSubmissionApprovals: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ input }) => {
      return await approvals.getSubmissionApprovals(input.submissionId);
    }),

  // Approve submission stage
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

      return await approvals.approveSubmissionStage(input.submissionId, input.stage, ctx.user.id);
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

      return await approvals.requestRevision(
        input.submissionId,
        input.stage,
        input.comment,
        ctx.user.id
      );
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

      return await approvals.rejectSubmission(
        input.submissionId,
        input.stage,
        input.reason,
        ctx.user.id
      );
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

  // Get comments for submission
  getComments: protectedProcedure
    .input(z.object({ submissionId: z.number() }))
    .query(async ({ input }) => {
      return await approvals.getSubmissionComments(input.submissionId);
    }),

  // Add comment
  addComment: protectedProcedure
    .input(
      z.object({
        approvalId: z.number(),
        submissionId: z.number(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await approvals.addApprovalComment({
        approvalId: input.approvalId,
        submissionId: input.submissionId,
        comment: input.comment,
        commentedBy: ctx.user.id,
        createdAt: new Date(),
      });
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
      return await approvals.getSubmissionStageFiles(input.submissionId, input.stage);
    }),
});