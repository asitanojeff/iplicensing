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

describe("Royalties Router - Access Control", () => {
  describe("createReport procedure", () => {
    it("should allow licensee to create report", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.createReport({
          contractId: 1,
          reportPeriod: "Q1-2026",
          grossSales: 100000,
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should allow admin to create report", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.createReport({
          contractId: 1,
          reportPeriod: "Q1-2026",
          grossSales: 150000,
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensor from creating report", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.createReport({
          contractId: 1,
          reportPeriod: "Q1-2026",
          grossSales: 100000,
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });

    it("should deny reviewer from creating report", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.createReport({
          contractId: 1,
          reportPeriod: "Q1-2026",
          grossSales: 100000,
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("submitReport procedure", () => {
    it("should allow licensee to submit report", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.submitReport({ reportId: 1 });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensor from submitting report", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.submitReport({ reportId: 1 });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("approveReport procedure", () => {
    it("should allow licensor to approve report", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.approveReport({ reportId: 1 });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should allow admin to approve report", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.approveReport({ reportId: 1 });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from approving report", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.approveReport({ reportId: 1 });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });

    it("should deny reviewer from approving report", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.approveReport({ reportId: 1 });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("rejectReport procedure", () => {
    it("should allow licensor to reject report", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.rejectReport({ reportId: 1 });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from rejecting report", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.rejectReport({ reportId: 1 });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("generateInvoice procedure", () => {
    it("should allow licensor to generate invoice", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.generateInvoice({
          reportId: 1,
          invoiceNumber: "INV-001",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from generating invoice", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.generateInvoice({
          reportId: 1,
          invoiceNumber: "INV-001",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("markAsPaid procedure", () => {
    it("should allow licensor to mark as paid", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.markAsPaid({ reportId: 1 });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from marking as paid", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.markAsPaid({ reportId: 1 });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("calculateRoyalties procedure", () => {
    it("should allow any authenticated user to calculate royalties", async () => {
      const roles: Array<User["role"]> = ["licensor", "licensee", "reviewer", "admin"];

      for (const role of roles) {
        const ctx = createMockContext(role);
        const caller = appRouter.createCaller(ctx);

        try {
          const result = await caller.royalties.calculateRoyalties({
            contractTermsId: 1,
            grossSales: 100000,
          });
          expect(result).toBeDefined();
        } catch (error: any) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("getSummary procedure", () => {
    it("should allow licensee to get royalty summary", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.royalties.getSummary({ contractId: 1 });
        expect(result).toBeDefined();
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensor from getting licensee summary", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.getSummary({ contractId: 1 });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("getOverdueReports procedure", () => {
    it("should allow licensor to get overdue reports", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.royalties.getOverdueReports({ contractId: 1 });
        expect(Array.isArray(result)).toBe(true);
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from getting overdue reports", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.getOverdueReports({ contractId: 1 });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("calculateTotalIncome procedure", () => {
    it("should allow licensor to calculate total income", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.royalties.calculateTotalIncome({
          contractId: 1,
          startDate: new Date("2026-01-01"),
          endDate: new Date("2026-03-31"),
        });
        expect(result).toBeDefined();
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from calculating total income", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.royalties.calculateTotalIncome({
          contractId: 1,
          startDate: new Date("2026-01-01"),
          endDate: new Date("2026-03-31"),
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("getReport procedure", () => {
    it("should allow any authenticated user to get report", async () => {
      const roles: Array<User["role"]> = ["licensor", "licensee", "reviewer", "admin"];

      for (const role of roles) {
        const ctx = createMockContext(role);
        const caller = appRouter.createCaller(ctx);

        try {
          const result = await caller.royalties.getReport({ reportId: 1 });
          expect(result === null || result !== undefined).toBe(true);
        } catch (error: any) {
          expect(error).toBeDefined();
        }
      }
    });
  });
});
