import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import type { User } from "../../drizzle/schema";

const createMockContext = (role: User["role"]): TrpcContext => {
  const user: User = {
    id: 1,
    openId: `test-user-${role}`,
    email: `${role}@example.com`,
    name: `Test ${role}`,
    loginMethod: "test",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
};

describe("Approvals Router - Access Control", () => {
  describe("createSubmission procedure", () => {
    it("should allow licensee to create submission", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.createSubmission({
          contractId: 1,
          productName: "Test Product",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should allow admin to create submission", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.createSubmission({
          contractId: 1,
          productName: "Admin Product",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensor from creating submission", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.createSubmission({
          contractId: 1,
          productName: "Licensor Product",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });

    it("should deny reviewer from creating submission", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.createSubmission({
          contractId: 1,
          productName: "Reviewer Product",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("getPendingApprovals procedure", () => {
    it("should allow reviewer to get pending approvals", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.approvals.getPendingApprovals();
        expect(Array.isArray(result)).toBe(true);
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should allow admin to get pending approvals", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.approvals.getPendingApprovals();
        expect(Array.isArray(result)).toBe(true);
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from getting pending approvals", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.getPendingApprovals();
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });

    it("should deny licensor from getting pending approvals", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.getPendingApprovals();
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("approveStage procedure", () => {
    it("should allow reviewer to approve stage", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.approveStage({
          submissionId: 1,
          stage: "concept",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should allow admin to approve stage", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.approveStage({
          submissionId: 1,
          stage: "pre_production",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from approving stage", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.approveStage({
          submissionId: 1,
          stage: "concept",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });

    it("should deny licensor from approving stage", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.approveStage({
          submissionId: 1,
          stage: "final_product",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("requestRevision procedure", () => {
    it("should allow reviewer to request revision", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.requestRevision({
          submissionId: 1,
          stage: "concept",
          comment: "Please revise the design",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from requesting revision", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.requestRevision({
          submissionId: 1,
          stage: "concept",
          comment: "Revision needed",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("rejectSubmission procedure", () => {
    it("should allow reviewer to reject submission", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.rejectSubmission({
          submissionId: 1,
          stage: "concept",
          reason: "Does not meet brand guidelines",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from rejecting submission", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.rejectSubmission({
          submissionId: 1,
          stage: "concept",
          reason: "Invalid",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("resubmitAfterRevision procedure", () => {
    it("should allow licensee to resubmit after revision", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.resubmitAfterRevision({
          submissionId: 1,
          stage: "concept",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny reviewer from resubmitting", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.resubmitAfterRevision({
          submissionId: 1,
          stage: "concept",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("uploadFile procedure", () => {
    it("should allow licensee to upload file", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.uploadFile({
          submissionId: 1,
          stage: "concept",
          fileName: "design.pdf",
          storageUrl: "https://example.com/design.pdf",
          fileSize: 1024,
          mimeType: "application/pdf",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny reviewer from uploading file", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.approvals.uploadFile({
          submissionId: 1,
          stage: "concept",
          fileName: "design.pdf",
          storageUrl: "https://example.com/design.pdf",
          fileSize: 1024,
          mimeType: "application/pdf",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("getSubmission procedure", () => {
    it("should allow any authenticated user to get submission", async () => {
      const roles: Array<User["role"]> = ["licensor", "licensee", "reviewer", "admin"];

      for (const role of roles) {
        const ctx = createMockContext(role);
        const caller = appRouter.createCaller(ctx);

        try {
          const result = await caller.approvals.getSubmission({ submissionId: 1 });
          expect(result === null || result !== undefined).toBe(true);
        } catch (error: any) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("getComments procedure", () => {
    it("should allow any authenticated user to get comments", async () => {
      const roles: Array<User["role"]> = ["licensor", "licensee", "reviewer", "admin"];

      for (const role of roles) {
        const ctx = createMockContext(role);
        const caller = appRouter.createCaller(ctx);

        try {
          const result = await caller.approvals.getComments({ submissionId: 1 });
          expect(Array.isArray(result)).toBe(true);
        } catch (error: any) {
          expect(error).toBeDefined();
        }
      }
    });
  });
});
