import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import {
  expenseApprovals,
  expenses,
  approvalRules,
} from "@/lib/db/schema/expenses";
import { authMiddleware } from "../auth-middleware";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { zExpenseApprovalsId } from "@/lib/id";

const approveExpenseSchema = z.object({
  approvalId: zExpenseApprovalsId,
  comments: z.string().optional(),
});

export const approveExpense = createServerFn({ method: "POST" })
  .inputValidator(approveExpenseSchema)
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
        action: "approved",
        comments: data.comments,
        actionAt: new Date(),
      })
      .where(eq(expenseApprovals.id, data.approvalId));

    // Get the approval rule
    const [rule] = approval.approvalRuleId
      ? await db
          .select()
          .from(approvalRules)
          .where(eq(approvalRules.id, approval.approvalRuleId))
          .limit(1)
      : [null];

    // Check if this is manager gate (stepOrder = 0)
    if (approval.stepOrder === 0) {
      // Manager gate approved, expense stays pending
      return { success: true, status: "pending" };
    }

    // Calculate new expense status based on rule type
    let newStatus: "pending" | "approved" | "rejected" = "pending";

    if (!rule) {
      // No rule, just approve
      newStatus = "approved";
    } else {
      switch (rule.ruleType) {
        case "sequential": {
          // Get all approvals for this expense
          const allApprovals = await db
            .select()
            .from(expenseApprovals)
            .where(eq(expenseApprovals.expenseId, approval.expenseId));

          // Check if all steps are approved (excluding manager gate)
          const ruleSteps = allApprovals.filter(
            (a) => a.stepOrder !== null && a.stepOrder > 0
          );
          const allApproved = ruleSteps.every((a) => a.action === "approved");

          if (allApproved) {
            newStatus = "approved";
          }
          break;
        }

        case "percentage": {
          // Get all approvals for this expense
          const allApprovals = await db
            .select()
            .from(expenseApprovals)
            .where(eq(expenseApprovals.expenseId, approval.expenseId));

          const ruleSteps = allApprovals.filter(
            (a) => a.stepOrder !== null && a.stepOrder > 0
          );
          const approvedCount = ruleSteps.filter(
            (a) => a.action === "approved"
          ).length;
          const totalCount = ruleSteps.length;
          const currentPercentage = (approvedCount / totalCount) * 100;

          if (
            rule.approvalPercentage &&
            currentPercentage >= rule.approvalPercentage
          ) {
            newStatus = "approved";
          }
          break;
        }

        case "specific_approver": {
          // Check if current approver is the specific approver
          if (currentUserId === rule.specificApproverId) {
            newStatus = "approved";
          }
          break;
        }

        case "hybrid": {
          // Check Condition A: specific approver approved?
          if (currentUserId === rule.specificApproverId) {
            newStatus = "approved";
            break;
          }

          // Check Condition B: percentage threshold met?
          const allApprovals = await db
            .select()
            .from(expenseApprovals)
            .where(eq(expenseApprovals.expenseId, approval.expenseId));

          const ruleSteps = allApprovals.filter(
            (a) => a.stepOrder !== null && a.stepOrder > 0
          );
          const approvedCount = ruleSteps.filter(
            (a) => a.action === "approved"
          ).length;
          const totalCount = ruleSteps.length;
          const currentPercentage = (approvedCount / totalCount) * 100;

          if (
            rule.approvalPercentage &&
            currentPercentage >= rule.approvalPercentage
          ) {
            newStatus = "approved";
          }
          break;
        }
      }
    }

    // Update expense status if changed
    if (newStatus === "approved") {
      await db
        .update(expenses)
        .set({
          status: "approved",
        })
        .where(eq(expenses.id, approval.expenseId));
    }

    return { success: true, status: newStatus };
  });
