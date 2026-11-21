import { defineConfig } from "drizzle-kit";
import { createDatabaseMigrationCredentials } from "./server/databaseConfig";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: createDatabaseMigrationCredentials(connectionString),
});
