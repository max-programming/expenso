import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import { expenseApprovals, expenses } from "@/lib/db/schema/expenses";
import { authMiddleware } from "../auth-middleware";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { zExpenseApprovalsId } from "@/lib/id";

const rejectExpenseSchema = z.object({
  approvalId: zExpenseApprovalsId,
  comments: z.string().min(1, "Rejection reason is required"),
});

export const rejectExpense = createServerFn({ method: "POST" })
  .inputValidator(rejectExpenseSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const currentUserId = context.session.userId;

    // Get the approval record
    const [approval] = await db
      .select()
      .from(expenseApprovals)
      .where(
        and(
          eq(expenseApprovals.id, data.approvalId),
          eq(expenseApprovals.approverId, currentUserId),
          eq(expenseApprovals.action, "pending")
        )
      )
      .limit(1);

    if (!approval) {
      throw new Error("Approval not found or already processed");
    }

    // Update the approval record
    await db
      .update(expenseApprovals)
      .set({
        action: "rejected",
        comments: data.comments,
        actionAt: new Date(),
      })
      .where(eq(expenseApprovals.id, data.approvalId));

    // Update expense status to rejected
    await db
      .update(expenses)
      .set({
        status: "rejected",
      })
      .where(eq(expenses.id, approval.expenseId));

    return { success: true, status: "rejected" };
  });
