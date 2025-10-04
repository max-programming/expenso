import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "./db/connection";
import * as authSchema from "./db/schema/auth";

export const auth = betterAuth({
  appName: "Expenso",
  advanced: {
    cookiePrefix: "expenso",
  },
  account: {
    accountLinking: { enabled: true },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [reactStartCookies()],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: authSchema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  telemetry: {
    enabled: false,
  },
});
