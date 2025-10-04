import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import { authMiddleware } from "./auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { eq, and } from "drizzle-orm";
import { zCompanyId } from "@/lib/id";

export const getManagers = createServerFn({ method: "GET" })
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

    const { success, data: companyId } = zCompanyId.safeParse(user.companyId);
    if (!success) {
      throw new Error("Invalid company id");
    }

    const managers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(and(eq(users.companyId, companyId), eq(users.role, "manager")));

    return managers;
  });