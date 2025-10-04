import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { adminMiddleware } from "../auth-middleware";
import { db } from "@/lib/db/connection";
import { expenseCategories } from "@/lib/db/schema/expenses";
import { users } from "@/lib/db/schema/auth";
import { and, eq } from "drizzle-orm";
import { zExpenseCategoriesId } from "@/lib/id";

export const updateCategory = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: zExpenseCategoriesId,
      name: z.string().min(1, "Name is required"),
      description: z.string().optional().nullable(),
    })
  )
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
      .update(expenseCategories)
      .set({
        name: data.name,
        description: data.description,
        companyId: user.companyId,
      })
      .where(
        and(
          eq(expenseCategories.id, data.id),
          eq(expenseCategories.companyId, user.companyId)
        )
      );

    return {
      success: true,
    };
  });
