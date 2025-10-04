import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import { approvalRules, approvalSteps } from "@/lib/db/schema/expenses";
import { adminMiddleware } from "../auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { zCompanyId, zExpenseCategoriesId, zApprovalRulesId } from "@/lib/id";
import { z } from "zod";

const updateApprovalRuleSchema = z.object({
  id: zApprovalRulesId,
  name: z.string().min(1),
  description: z.string().optional(),
  specificCategoryId: z.optional(zExpenseCategoriesId),
  ruleType: z.enum(["sequential", "percentage", "specific_approver", "hybrid"]),
  isManagerFirst: z.boolean(),
  approvalPercentage: z.number().optional(),
  specificApproverId: z.string().optional(),
  steps: z
    .array(
      z.object({
        approverId: z.string(),
        stepOrder: z.number(),
      })
    )
    .optional(),
});

export const updateApprovalRule = createServerFn({ method: "POST" })
  .inputValidator(updateApprovalRuleSchema)
  .middleware([adminMiddleware])
  .handler(async ({ data, context }) => {
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

    // Update the rule
    const [updatedRule] = await db
      .update(approvalRules)
      .set({
        name: data.name,
        description: data.description,
        specificCategoryId: data.specificCategoryId,
        ruleType: data.ruleType,
        isManagerFirst: data.isManagerFirst,
        approvalPercentage: data.approvalPercentage,
        specificApproverId: data.specificApproverId,
        updatedAt: new Date(),
      })
      .where(eq(approvalRules.id, data.id))
      .returning();

    // Delete existing steps and add new ones
    await db
      .delete(approvalSteps)
      .where(eq(approvalSteps.approvalRuleId, data.id));

    if (data.steps && data.steps.length > 0) {
      await db.insert(approvalSteps).values(
        data.steps.map((step) => ({
          approvalRuleId: data.id,
          approverId: step.approverId,
          stepOrder: step.stepOrder,
        }))
      );
    }

    return updatedRule;
  });
