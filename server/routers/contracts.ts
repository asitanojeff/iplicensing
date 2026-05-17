import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as contractMgmt from "../features/contractManagement";

export const contractsRouter = router({
  // List all contracts for licensor
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await contractMgmt.getActiveLicensorContracts(ctx.user.id);
  }),

  // Get contract by ID
  getById: protectedProcedure
    .input(z.object({ contractId: z.number() }))
    .query(async ({ input }) => {
      return await contractMgmt.getContractWithTerms(input.contractId);
    }),

  // Create new contract
  create: protectedProcedure
    .input(
      z.object({
        contractNumber: z.string(),
        licenseeId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        storageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await contractMgmt.createContract({
        licensorId: ctx.user.id,
        contractNumber: input.contractNumber,
        licenseeId: input.licenseeId,
        title: input.title,
        description: input.description,
        startDate: input.startDate,
        endDate: input.endDate,
        status: "draft",
        storageUrl: input.storageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }),

  // Update contract
  update: protectedProcedure
    .input(
      z.object({
        contractId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "active", "expired", "terminated"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await contractMgmt.updateContract(input.contractId, {
        title: input.title,
        description: input.description,
        status: input.status,
        updatedAt: new Date(),
      });
    }),

  // Create contract terms
  createTerms: protectedProcedure
    .input(
      z.object({
        contractId: z.number(),
        royaltyRate: z.number(),
        minimumGuarantee: z.number().optional(),
        territories: z.string().optional(),
        categories: z.string().optional(),
        paymentTerms: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await contractMgmt.createContractTerms({
        contractId: input.contractId,
        royaltyRate: input.royaltyRate,
        minimumGuarantee: input.minimumGuarantee,
        territories: input.territories,
        categories: input.categories,
        paymentTerms: input.paymentTerms,
      });
    }),

  // Get contract terms
  getTerms: protectedProcedure
    .input(z.object({ contractId: z.number() }))
    .query(async ({ input }) => {
      return await contractMgmt.getContractTerms(input.contractId);
    }),

  // Assign licensee to contract
  assignLicensee: protectedProcedure
    .input(
      z.object({
        contractId: z.number(),
        licenseeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await contractMgmt.assignLicenseeToContract({
        contractId: input.contractId,
        licenseeId: input.licenseeId,
        assignedBy: ctx.user.id,
        assignedAt: new Date(),
      });
    }),

  // Check if contract is active
  isActive: protectedProcedure
    .input(z.object({ contractId: z.number() }))
    .query(async ({ input }) => {
      return await contractMgmt.isContractActive(input.contractId);
    }),

  // Get expiring contracts
  getExpiring: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    return await contractMgmt.getExpiringContracts(ctx.user.id, 30);
  }),
});
