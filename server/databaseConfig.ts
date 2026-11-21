import type { PoolOptions } from "mysql2";

export const DATABASE_POOL_CONNECTION_LIMIT = 2;
export const DATABASE_POOL_IDLE_TIMEOUT_MS = 60_000;

const databaseTlsOptions = {
  minVersion: "TLSv1.2" as const,
  rejectUnauthorized: true,
};

export function createDatabasePoolOptions(
  connectionString: string
): PoolOptions {
  return {
    uri: connectionString,
    connectionLimit: DATABASE_POOL_CONNECTION_LIMIT,
    maxIdle: DATABASE_POOL_CONNECTION_LIMIT,
    idleTimeout: DATABASE_POOL_IDLE_TIMEOUT_MS,
    waitForConnections: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: databaseTlsOptions,
  };
}

export function createDatabaseMigrationCredentials(connectionString: string) {
  const url = new URL(connectionString);
  if (url.protocol !== "mysql:" && url.protocol !== "mysql2:") {
    throw new Error("DATABASE_URL must use the mysql protocol");
  }

  const database = decodeURIComponent(url.pathname.slice(1));
  if (!url.hostname || !database) {
    throw new Error("DATABASE_URL must include a host and database name");
  }

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    ssl: databaseTlsOptions,
  };
}
