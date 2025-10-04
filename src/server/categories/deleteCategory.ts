import { zExpenseCategoriesId } from "@/lib/id";
import { createServerFn } from "@tanstack/react-start";
import { adminMiddleware } from "../auth-middleware";
import { db } from "@/lib/db/connection";
import { expenseCategories } from "@/lib/db/schema/expenses";
import { and, eq } from "drizzle-orm";
import { users } from "@/lib/db/schema/auth";
import z from "zod";

export const deleteCategory = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: zExpenseCategoriesId }))
  .middleware([adminMiddleware])
  .handler(async ({ data, context }) => {
    const [user] = await db
      .select({ companyId: users.companyId })
      .from(users)
      .where(eq(users.id, context.session.userId));

    if (!user || !user.companyId) {
      throw new Error("User or company not found");
    }

    await db
      .delete(expenseCategories)
      .where(
        and(
          eq(expenseCategories.id, data.id),
          eq(expenseCategories.companyId, user.companyId)
        )
      );
  });
