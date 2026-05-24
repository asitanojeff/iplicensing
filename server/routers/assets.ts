import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as assetBank from "../features/assetBank";
import { storagePut } from "../storage";

export const assetsRouter = router({
  // List all assets for licensor
  list: protectedProcedure
    .input(z.object({ licensorId: z.number() }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const licensorId = input?.licensorId || ctx.user.id;
      return await assetBank.getLicensorAssets(licensorId);
    }),

  // Get asset by ID
  getById: protectedProcedure
    .input(z.object({ assetId: z.number() }))
    .query(async ({ input }) => {
      return await assetBank.getAssetById(input.assetId);
    }),

  // Create new asset
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        assetType: z.enum(["style_guide", "logo", "artwork", "template", "other"]),
        category: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const created = await assetBank.createIpAsset({
        licensorId: ctx.user.id,
        name: input.name,
        description: input.description,
        assetType: input.assetType,
        category: input.category,
        status: "active",
      });

      return { id: created.id };
    }),

  // Get asset versions
  getVersions: protectedProcedure
    .input(z.object({ assetId: z.number() }))
    .query(async ({ input }) => {
      return await assetBank.getAssetVersions(input.assetId);
    }),

  // Create asset version
  createAssetVersion: protectedProcedure
    .input(
      z.object({
        assetId: z.number(),
        versionNumber: z.number(),
        storageUrl: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await assetBank.createAssetVersion({
        assetId: input.assetId,
        versionNumber: input.versionNumber,
        storageUrl: input.storageUrl,
        storageKey: input.storageUrl.split('/').pop() || 'unknown',
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        uploadedBy: ctx.user.id,
        downloadCount: 0,
      });
    }),

  // Upload a file and create a new asset version record
  uploadFile: protectedProcedure
    .input(
      z.object({
        assetId: z.number(),
        fileName: z.string().min(1),
        mimeType: z.string().min(1),
        base64: z.string().min(1),
        fileSize: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const bytes = Buffer.from(input.base64, "base64");
      const uploaded = await storagePut(`assets/${input.assetId}/${input.fileName}`, bytes, input.mimeType);
      const versions = await assetBank.getAssetVersions(input.assetId);
      const nextVersion = versions.length + 1;

      await assetBank.createAssetVersion({
        assetId: input.assetId,
        versionNumber: nextVersion,
        storageKey: uploaded.key,
        storageUrl: uploaded.url,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        uploadedBy: ctx.user.id,
        downloadCount: 0,
      });

      return uploaded;
    }),

  // Grant permission to licensee
  grantPermission: protectedProcedure
    .input(
      z.object({
        assetId: z.number(),
        licenseeId: z.number(),
        canView: z.boolean().default(true),
        canDownload: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await assetBank.grantAssetPermission({
        assetId: input.assetId,
        licenseeId: input.licenseeId,
        grantedBy: ctx.user.id,
        canView: input.canView,
        canDownload: input.canDownload,
        grantedAt: new Date(),
      });
    }),

  // Get permissions for asset
  getPermissions: protectedProcedure
    .input(z.object({ assetId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await assetBank.getAssetPermissions(input.assetId);
    }),

  // Revoke permission
  revokePermission: protectedProcedure
    .input(
      z.object({
        assetId: z.number(),
        licenseeId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "licensor" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      return await assetBank.revokeAssetPermission(input.assetId, input.licenseeId);
    }),

  // Get assets accessible to licensee
  getAccessibleAssets: protectedProcedure
    .input(z.object({ licenseeId: z.number() }).optional())
    .query(async ({ ctx }) => {
      if (ctx.user?.role !== "licensee" && ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      // This would need a more complex query to get all assets where licensee has permission
      // For now, returning empty array as placeholder
      return [];
    }),

  // Increment download count
  recordDownload: protectedProcedure
    .input(z.object({ versionId: z.number() }))
    .mutation(async ({ input }) => {
      return await assetBank.incrementDownloadCount(input.versionId);
    }),
});
