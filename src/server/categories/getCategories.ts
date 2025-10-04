import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import { expenseCategories } from "@/lib/db/schema/expenses";
import { authMiddleware } from "../auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { desc, eq } from "drizzle-orm";

export const getCategories = createServerFn({ method: "GET" })
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

    const categories = await db
      .select({
        id: expenseCategories.id,
        name: expenseCategories.name,
        description: expenseCategories.description,
      })
      .from(expenseCategories)
      .where(eq(expenseCategories.companyId, user.companyId))
      .orderBy(desc(expenseCategories.createdAt));

    return categories;
  });
