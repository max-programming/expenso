import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import { expenses } from "@/lib/db/schema/expenses";
import { authMiddleware } from "../auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { desc, eq } from "drizzle-orm";

export const getExpenses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const currentUserId = context.session.userId;

    // Get the current user to check their company and role
    const [user] = await db
      .select({
        companyId: users.companyId,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, currentUserId));

    if (!user || !user.companyId) {
      throw new Error("User or company not found");
    }

    // If the user is an employee, only return their expenses
    // If the user is a manager or admin, return all company expenses
    const whereClause =
      user.role === "employee"
        ? eq(expenses.employeeId, currentUserId)
        : eq(expenses.companyId, user.companyId);

    const companyExpenses = await db
      .select()
      .from(expenses)
      .where(whereClause)
      .orderBy(desc(expenses.createdAt));

    return companyExpenses;
  });
