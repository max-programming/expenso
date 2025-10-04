import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import { approvalRules, approvalSteps } from "@/lib/db/schema/expenses";
import { authMiddleware } from "../auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { zCompanyId, zExpenseCategoriesId } from "@/lib/id";
import { z } from "zod";

const addApprovalRuleSchema = z.object({
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

export const addApprovalRule = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(addApprovalRuleSchema)
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

    const [newRule] = await db
      .insert(approvalRules)
      .values({
        companyId,
        name: data.name,
        description: data.description,
        specificCategoryId: data.specificCategoryId,
        ruleType: data.ruleType,
        isManagerFirst: data.isManagerFirst,
        approvalPercentage: data.approvalPercentage,
        specificApproverId: data.specificApproverId,
      })
      .returning();

    // Add steps if provided
    if (data.steps && data.steps.length > 0) {
      await db.insert(approvalSteps).values(
        data.steps.map((step) => ({
          approvalRuleId: newRule.id,
          approverId: step.approverId,
          stepOrder: step.stepOrder,
        }))
      );
    }

    return newRule;
  });
