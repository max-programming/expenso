import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "@/lib/react-start";
import { admin } from "better-auth/plugins";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";
import { db } from "./db/connection";
import * as authSchema from "./db/schema/auth";
import { createAccessControl } from "better-auth/plugins/access";

const ac = createAccessControl(defaultStatements);
const manager = ac.newRole(adminAc.statements);
const employee = ac.newRole(adminAc.statements);

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
    autoSignIn: false,
  },
  plugins: [
    reactStartCookies(),
    admin({ ac: ac, roles: { manager, employee } }),
  ],
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
