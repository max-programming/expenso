import { drizzle } from "drizzle-orm/neon-http";
import { EnhancedQueryLogger } from "drizzle-query-logger";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(process.env.DATABASE_URL, {
  casing: "snake_case",
  logger: new EnhancedQueryLogger(),
});
