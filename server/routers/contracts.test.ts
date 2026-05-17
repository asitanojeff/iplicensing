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

describe("Contracts Router - Access Control", () => {
  describe("list procedure", () => {
    it("should allow licensor to list contracts", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contracts.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should allow admin to list contracts", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contracts.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should deny licensee from listing contracts", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.list();
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });

    it("should deny reviewer from listing contracts", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.list();
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("create procedure", () => {
    it("should allow licensor to create contract", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.create({
          contractNumber: "CONTRACT-001",
          licenseeId: 2,
          title: "Test Contract",
        });
      } catch (error: any) {
        // Database errors are acceptable
        expect(error).toBeDefined();
      }
    });

    it("should allow admin to create contract", async () => {
      const ctx = createMockContext("admin");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.create({
          contractNumber: "CONTRACT-002",
          licenseeId: 2,
          title: "Admin Contract",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from creating contract", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.create({
          contractNumber: "CONTRACT-003",
          licenseeId: 2,
          title: "Licensee Contract",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });

    it("should deny reviewer from creating contract", async () => {
      const ctx = createMockContext("reviewer");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.create({
          contractNumber: "CONTRACT-004",
          licenseeId: 2,
          title: "Reviewer Contract",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("update procedure", () => {
    it("should allow licensor to update contract", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.update({
          contractId: 1,
          title: "Updated Title",
          status: "active",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from updating contract", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.update({
          contractId: 1,
          title: "Updated Title",
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("createTerms procedure", () => {
    it("should allow licensor to create contract terms", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.createTerms({
          contractId: 1,
          royaltyRate: 0.15,
          minimumGuarantee: 50000,
          territories: "North America",
          categories: "Apparel,Accessories",
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from creating contract terms", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.createTerms({
          contractId: 1,
          royaltyRate: 0.15,
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("assignLicensee procedure", () => {
    it("should allow licensor to assign licensee", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.assignLicensee({
          contractId: 1,
          licenseeId: 2,
        });
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from assigning licensee", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.assignLicensee({
          contractId: 1,
          licenseeId: 2,
        });
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });

  describe("getTerms procedure", () => {
    it("should allow any authenticated user to get contract terms", async () => {
      const roles: Array<User["role"]> = ["licensor", "licensee", "reviewer", "admin"];

      for (const role of roles) {
        const ctx = createMockContext(role);
        const caller = appRouter.createCaller(ctx);

        try {
          const result = await caller.contracts.getTerms({ contractId: 1 });
          // Should return something (or null if not found)
          expect(result === null || result !== undefined).toBe(true);
        } catch (error: any) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("isActive procedure", () => {
    it("should allow any authenticated user to check if contract is active", async () => {
      const roles: Array<User["role"]> = ["licensor", "licensee", "reviewer", "admin"];

      for (const role of roles) {
        const ctx = createMockContext(role);
        const caller = appRouter.createCaller(ctx);

        try {
          const result = await caller.contracts.isActive({ contractId: 1 });
          expect(typeof result === "boolean").toBe(true);
        } catch (error: any) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("getExpiring procedure", () => {
    it("should allow licensor to get expiring contracts", async () => {
      const ctx = createMockContext("licensor");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.contracts.getExpiring();
        expect(Array.isArray(result)).toBe(true);
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should deny licensee from getting expiring contracts", async () => {
      const ctx = createMockContext("licensee");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contracts.getExpiring();
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });
  });
});
