import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as royalties from "../features/royaltyManagement";

export const royaltiesRouter = router({
  // Create royalty report
  createReport: protectedProcedure
    .input(
      z.object({
        contractId: z.number(),
        reportPeriod: z.string(),
        grossSales: z.number(),
        deductions: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensee" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await royalties.createRoyaltyReport({
        contractId: input.contractId,
        licenseeId: ctx.user.id.toString(),
        reportPeriod: input.reportPeriod,
        grossSales: input.grossSales.toString(),
        deductions: (input.deductions || 0).toString(),
        status: "draft",
        createdAt: new Date(),
      });
    }),

  // Get royalty report
  getReport: protectedProcedure
    .input(z.object({ reportId: z.number() }))
    .query(async ({ input }) => {
      return await royalties.getRoyaltyReportById(input.reportId);
    }),

  // Get royalty reports for licensee
  getMyReports: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "licensee" && ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // This would need a query to get all reports for licensee
    // For now, returning empty array as placeholder
    return [];
  }),

  // Calculate royalties
  calculateRoyalties: protectedProcedure
    .input(
      z.object({
        contractTermsId: z.number(),
        grossSales: z.number(),
        deductions: z.number().optional(),
        previousMgRecoupment: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await royalties.calculateRoyalties(
        input.contractTermsId,
        input.grossSales,
        input.deductions || 0,
        input.previousMgRecoupment || 0
      );
    }),

  // Submit royalty report
  submitReport: protectedProcedure
    .input(z.object({ reportId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensee" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await royalties.submitRoyaltyReport(input.reportId);
    }),

  // Approve royalty report
  approveReport: protectedProcedure
    .input(z.object({ reportId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await royalties.approveRoyaltyReport(input.reportId, ctx.user.id);
    }),

  // Reject royalty report
  rejectReport: protectedProcedure
    .input(z.object({ reportId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await royalties.rejectRoyaltyReport(input.reportId, ctx.user.id);
    }),

  // Generate invoice
  generateInvoice: protectedProcedure
    .input(
      z.object({
        reportId: z.number(),
        invoiceNumber: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await royalties.generateExcessRoyaltyInvoice(input.reportId, input.invoiceNumber);
    }),

  // Mark as paid
  markAsPaid: protectedProcedure
    .input(z.object({ reportId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await royalties.markRoyaltyReportAsPaid(input.reportId);
    }),

  // Get royalty summary
  getSummary: protectedProcedure
    .input(z.object({ contractId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensee" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await royalties.getRoyaltySummary(ctx.user.id, input.contractId);
    }),

  // Get overdue reports
  getOverdueReports: protectedProcedure
    .input(z.object({ contractId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await royalties.getOverdueRoyaltyReports(input.contractId);
    }),

  // Calculate total royalty income
  calculateTotalIncome: protectedProcedure
    .input(
      z.object({
        contractId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await royalties.calculateTotalRoyaltyIncome(
        input.contractId,
        input.startDate,
        input.endDate
      );
    }),
});
