import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getUserById, updateUserRole, getUsersByRole } from "./db";

/**
 * Admin-only procedure - ensures user has admin role
 */
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

/**
 * Licensor-only procedure - ensures user has licensor role
 */
const licensorProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "licensor" && ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Licensor access required",
    });
  }
  return next({ ctx });
});

/**
 * Reviewer-only procedure - ensures user has reviewer or admin role
 */
const reviewerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!["reviewer", "admin"].includes(ctx.user.role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Reviewer access required",
    });
  }
  return next({ ctx });
});

/**
 * Licensee-only procedure - ensures user has licensee role
 */
const licenseeProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "licensee" && ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Licensee access required",
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * User management procedures (admin only)
   */
  users: router({
    /**
     * Get current user profile
     */
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getUserById(ctx.user.id);
    }),

    /**
     * Get all users (admin only)
     */
    getAll: adminProcedure.query(async () => {
      // This would need a dedicated query helper
      // For now, returning empty array as placeholder
      return [];
    }),

    /**
     * Get users by role (admin only)
     */
    getByRole: adminProcedure
      .input(z.object({ role: z.enum(["admin", "licensor", "licensee", "reviewer"]) }))
      .query(async ({ input }) => {
        return await getUsersByRole(input.role);
      }),

    /**
     * Update user role (admin only)
     */
    updateRole: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          newRole: z.enum(["admin", "licensor", "licensee", "reviewer"]),
        })
      )
      .mutation(async ({ input }) => {
        const success = await updateUserRole(input.userId, input.newRole);
        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update user role",
          });
        }
        return { success: true };
      }),
  }),

  /**
   * Role-specific dashboard data
   */
  dashboard: router({
    /**
     * Get licensor dashboard overview
     */
    licensorOverview: licensorProcedure.query(async ({ ctx }) => {
      // Placeholder for dashboard data
      return {
        contractsCount: 0,
        pendingApprovalsCount: 0,
        royaltyReportsCount: 0,
        totalRoyaltyIncome: 0,
      };
    }),

    /**
     * Get licensee dashboard overview
     */
    licenseeOverview: licenseeProcedure.query(async ({ ctx }) => {
      // Placeholder for dashboard data
      return {
        contractsCount: 0,
        submissionsCount: 0,
        royaltyReportsCount: 0,
        labelsAvailable: 0,
      };
    }),

    /**
     * Get reviewer dashboard overview
     */
    reviewerOverview: reviewerProcedure.query(async ({ ctx }) => {
      // Placeholder for dashboard data
      return {
        pendingApprovalsCount: 0,
        submissionsInReviewCount: 0,
      };
    }),
  }),

  /**
   * Permissions and access control
   */
  permissions: router({
    /**
     * Check if user has permission for an action
     */
    canAccess: protectedProcedure
      .input(
        z.object({
          resource: z.string(),
          action: z.enum(["read", "write", "delete", "approve"]),
          resourceId: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        // Role-based access control logic
        const rolePermissions: Record<string, string[]> = {
          admin: ["read", "write", "delete", "approve"],
          licensor: ["read", "write", "approve"],
          reviewer: ["read", "approve"],
          licensee: ["read", "write"],
        };

        const userPermissions = rolePermissions[ctx.user.role] || [];
        return userPermissions.includes(input.action);
      }),
  }),
});

export type AppRouter = typeof appRouter;
