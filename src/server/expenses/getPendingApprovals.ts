import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import {
  expenseApprovals,
  expenses,
  expenseCategories,
  approvalRules,
} from "@/lib/db/schema/expenses";
import { users } from "@/lib/db/schema/auth";
import { authMiddleware } from "../auth-middleware";
import { eq, and, sql } from "drizzle-orm";
import type { ExpensesId } from "@/lib/id";

export const getPendingApprovals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const currentUserId = context.session.userId;

    // Get all pending approvals assigned to the current user
    const pendingApprovals = await db
      .select({
        approvalId: expenseApprovals.id,
        expenseId: expenses.id,
        description: expenses.description,
        amount: expenses.amount,
        currencyCode: expenses.currencyCode,
        expenseDate: expenses.expenseDate,
        status: expenses.status,
        employeeName: users.name,
        employeeId: users.id,
        categoryName: expenseCategories.name,
        categoryId: expenseCategories.id,
        approvalAction: expenseApprovals.action,
        approvalStepOrder: expenseApprovals.stepOrder,
        approvalRuleId: expenseApprovals.approvalRuleId,
        ruleType: approvalRules.ruleType,
        isManagerFirst: approvalRules.isManagerFirst,
        approvalPercentage: approvalRules.approvalPercentage,
        specificApproverId: approvalRules.specificApproverId,
        comments: expenseApprovals.comments,
      })
      .from(expenseApprovals)
      .innerJoin(expenses, eq(expenseApprovals.expenseId, expenses.id))
      .innerJoin(users, eq(expenses.employeeId, users.id))
      .leftJoin(
        expenseCategories,
        eq(expenses.categoryId, expenseCategories.id)
      )
      .leftJoin(
        approvalRules,
        eq(expenseApprovals.approvalRuleId, approvalRules.id)
      )
      .where(
        and(
          eq(expenseApprovals.approverId, currentUserId),
          eq(expenseApprovals.action, "pending"),
          eq(expenses.status, "pending")
        )
      );

    // Filter based on rule type logic
    const visibleApprovals = [];

    for (const approval of pendingApprovals) {
      let shouldShow = false;

      // Step 1: Check Manager Gate
      if (approval.isManagerFirst) {
        // Get the manager gate approval (stepOrder = 0)
        const [managerGate] = await db
          .select()
          .from(expenseApprovals)
          .where(
            and(
              eq(expenseApprovals.expenseId, approval.expenseId),
              eq(expenseApprovals.stepOrder, 0)
            )
          )
          .limit(1);

        if (managerGate) {
          if (managerGate.action === "pending") {
            // Only manager should see it
            shouldShow = managerGate.approverId === currentUserId;
          } else if (managerGate.action === "rejected") {
            // Nobody should see it
            shouldShow = false;
          } else if (managerGate.action === "approved") {
            // Manager gate passed, check rule type logic
            shouldShow = await checkRuleTypeLogic(
              approval,
              currentUserId,
              approval.expenseId as ExpensesId
            );
          }
        }
      } else {
        // No manager gate, directly check rule type logic
        shouldShow = await checkRuleTypeLogic(
          approval,
          currentUserId,
          approval.expenseId as ExpensesId
        );
      }

      if (shouldShow) {
        visibleApprovals.push(approval);
      }
    }

    return visibleApprovals;
  });

async function checkRuleTypeLogic(
  approval: any,
  currentUserId: string,
  expenseId: ExpensesId
): Promise<boolean> {
  switch (approval.ruleType) {
    case "sequential": {
      // Get all previous steps
      const previousSteps = await db
        .select()
        .from(expenseApprovals)
        .where(
          and(
            eq(expenseApprovals.expenseId, expenseId),
            sql`${expenseApprovals.stepOrder} < ${approval.approvalStepOrder}`
          )
        );

      // Check if all previous steps are approved
      const allPreviousApproved = previousSteps.every(
        (step) => step.action === "approved"
      );

      return allPreviousApproved;
    }

    case "percentage":
      // All approvers see it immediately
      return true;

    case "specific_approver":
      // Only specific approver sees it
      return currentUserId === approval.specificApproverId;

    case "hybrid":
      // Check if already approved by either condition
      const allApprovals = await db
        .select()
        .from(expenseApprovals)
        .where(eq(expenseApprovals.expenseId, expenseId));

      // Check if specific approver already approved
      const specificApproved = allApprovals.some(
        (a) =>
          a.approverId === approval.specificApproverId &&
          a.action === "approved"
      );

      if (specificApproved) {
        return false; // Already approved, don't show
      }

      // Check if percentage already met
      const approvedCount = allApprovals.filter(
        (a) => a.action === "approved"
      ).length;
      const totalCount = allApprovals.length;
      const currentPercentage = (approvedCount / totalCount) * 100;

      if (
        approval.approvalPercentage &&
        currentPercentage >= approval.approvalPercentage
      ) {
        return false; // Already approved, don't show
      }

      // Show to all approvers
      return true;

    default:
      return false;
  }
}
