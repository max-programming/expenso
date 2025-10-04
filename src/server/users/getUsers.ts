import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { db } from "@/lib/db/connection";
import { desc, eq } from "drizzle-orm";

export const getUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const [user] = await db
      .select({
        companyId: users.companyId,
      })
      .from(users)
      .where(eq(users.id, context.session.userId));

    if (!user || !user.companyId) {
      throw new Error("User or company not found");
    }

    const companyUsers = await db
      .select()
      .from(users)
      .where(eq(users.companyId, user.companyId))
      .orderBy(desc(users.createdAt));

    return companyUsers;
  });
