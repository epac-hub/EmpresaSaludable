import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { User } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  deleteContactSubmission: vi.fn(),
  listContactSubmissions: vi.fn(),
}));

vi.mock("./db", () => ({
  createContactSubmission: vi.fn(),
  createDemoRequest: vi.fn(),
  deleteContactSubmission: dbMocks.deleteContactSubmission,
  listContactSubmissions: dbMocks.listContactSubmissions,
}));

import { appRouter } from "./routers";

const baseUser: User = {
  id: 1,
  openId: "user-1",
  email: "user@example.com",
  name: "User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createContext(user: User | null): TrpcContext {
  return {
    user,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

async function expectTrpcCode(
  promise: Promise<unknown>,
  code: TRPCError["code"],
) {
  await expect(promise).rejects.toMatchObject({ code });
}

describe("admin submission API authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated list and delete requests", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expectTrpcCode(caller.admin.listSubmissions(), "UNAUTHORIZED");
    await expectTrpcCode(
      caller.admin.deleteSubmission({ id: 1, confirmation: "DELETE" }),
      "UNAUTHORIZED",
    );
    expect(dbMocks.listContactSubmissions).not.toHaveBeenCalled();
    expect(dbMocks.deleteContactSubmission).not.toHaveBeenCalled();
  });

  it("rejects authenticated non-admin users", async () => {
    const caller = appRouter.createCaller(createContext(baseUser));

    await expectTrpcCode(caller.admin.listSubmissions(), "FORBIDDEN");
    await expectTrpcCode(
      caller.admin.deleteSubmission({ id: 1, confirmation: "DELETE" }),
      "FORBIDDEN",
    );
    expect(dbMocks.listContactSubmissions).not.toHaveBeenCalled();
    expect(dbMocks.deleteContactSubmission).not.toHaveBeenCalled();
  });

  it("allows admins to list submissions", async () => {
    const submissions = [{ id: 1, email: "lead@example.com" }];
    dbMocks.listContactSubmissions.mockResolvedValue(submissions);
    const caller = appRouter.createCaller(
      createContext({ ...baseUser, role: "admin" }),
    );

    await expect(caller.admin.listSubmissions()).resolves.toEqual(submissions);
    expect(dbMocks.listContactSubmissions).toHaveBeenCalledOnce();
  });

  it("requires an explicit deletion confirmation", async () => {
    const caller = appRouter.createCaller(
      createContext({ ...baseUser, role: "admin" }),
    );

    await expectTrpcCode(
      caller.admin.deleteSubmission({
        id: 1,
        confirmation: "CONFIRM" as "DELETE",
      }),
      "BAD_REQUEST",
    );
    await expectTrpcCode(
      caller.admin.deleteSubmission({ id: 0, confirmation: "DELETE" }),
      "BAD_REQUEST",
    );
    expect(dbMocks.deleteContactSubmission).not.toHaveBeenCalled();
  });

  it("deletes one existing submission and reports missing records", async () => {
    const caller = appRouter.createCaller(
      createContext({ ...baseUser, role: "admin" }),
    );
    dbMocks.deleteContactSubmission.mockResolvedValueOnce(true);

    await expect(
      caller.admin.deleteSubmission({ id: 7, confirmation: "DELETE" }),
    ).resolves.toEqual({ success: true });
    expect(dbMocks.deleteContactSubmission).toHaveBeenCalledWith(7);

    dbMocks.deleteContactSubmission.mockResolvedValueOnce(false);
    await expectTrpcCode(
      caller.admin.deleteSubmission({ id: 8, confirmation: "DELETE" }),
      "NOT_FOUND",
    );
  });
});
