import { describe, expect, it } from "vitest";
import {
  createDatabaseMigrationCredentials,
  createDatabasePoolOptions,
  DATABASE_POOL_CONNECTION_LIMIT,
  DATABASE_POOL_IDLE_TIMEOUT_MS,
} from "./databaseConfig";

describe("database configuration", () => {
  const connectionString =
    "mysql://user%40example:secret%2Fvalue@db.example.com:4000/app_db?sslaccept=strict";

  it("builds a small TLS-verified serverless pool", () => {
    expect(createDatabasePoolOptions(connectionString)).toEqual({
      uri: connectionString,
      connectionLimit: DATABASE_POOL_CONNECTION_LIMIT,
      maxIdle: DATABASE_POOL_CONNECTION_LIMIT,
      idleTimeout: DATABASE_POOL_IDLE_TIMEOUT_MS,
      waitForConnections: true,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      },
    });
  });

  it("builds TLS-verified migration credentials from DATABASE_URL", () => {
    expect(createDatabaseMigrationCredentials(connectionString)).toEqual({
      host: "db.example.com",
      port: 4000,
      user: "user@example",
      password: "secret/value",
      database: "app_db",
      ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      },
    });
  });

  it("rejects non-MySQL database URLs", () => {
    expect(() =>
      createDatabaseMigrationCredentials(
        "postgres://user:secret@db.example.com/app_db"
      )
    ).toThrow("DATABASE_URL must use the mysql protocol");
  });
});
