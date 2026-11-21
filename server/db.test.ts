import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const databaseClient = {};
  const promisePool = {};
  const pool = {
    promise: vi.fn(() => promisePool),
  };

  return {
    attachDatabasePool: vi.fn(),
    createPool: vi.fn(() => pool),
    databaseClient,
    drizzle: vi.fn(() => databaseClient),
    pool,
    promisePool,
  };
});

vi.mock("@vercel/functions", () => ({
  attachDatabasePool: mocks.attachDatabasePool,
}));

vi.mock("mysql2", () => ({
  createPool: mocks.createPool,
}));

vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: mocks.drizzle,
}));

import { createDatabaseClient } from "./db";

describe("database client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("attaches the callback pool and gives its promise wrapper to Drizzle", () => {
    const result = createDatabaseClient(
      "mysql://user:secret@db.example.com:4000/app_db"
    );

    expect(mocks.createPool).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionLimit: 2,
        ssl: {
          minVersion: "TLSv1.2",
          rejectUnauthorized: true,
        },
      })
    );
    expect(mocks.attachDatabasePool).toHaveBeenCalledWith(mocks.pool);
    expect(mocks.pool.promise).toHaveBeenCalledOnce();
    expect(mocks.drizzle).toHaveBeenCalledWith({
      client: mocks.promisePool,
    });
    expect(result).toBe(mocks.databaseClient);
  });
});
