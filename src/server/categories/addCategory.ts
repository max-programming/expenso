import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { adminMiddleware } from "../auth-middleware";
import { db } from "@/lib/db/connection";
import { expenseCategories } from "@/lib/db/schema/expenses";
import { users } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { zCompanyId } from "@/lib/id";

export const addCategory = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
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

    const { success, data: companyId } = zCompanyId.safeParse(user.companyId);
    if (!success) {
      throw new Error("Invalid company id");
    }

    const [category] = await db
      .insert(expenseCategories)
      .values({
        name: data.name,
        description: data.description,
        companyId,
      })
      .returning();

    return {
      success: true,
      category,
    };
  });
