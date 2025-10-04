import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import { approvalRules, approvalSteps } from "@/lib/db/schema/expenses";
import { authMiddleware } from "../auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { desc, eq } from "drizzle-orm";
import { zCompanyId } from "@/lib/id";

export const getApprovalRules = createServerFn({ method: "GET" })
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

    const { success, data: companyId } = zCompanyId.safeParse(user.companyId);
    if (!success) {
      throw new Error("Invalid company id");
    }

    const rules = await db
      .select()
      .from(approvalRules)
      .where(eq(approvalRules.companyId, companyId))
      .orderBy(desc(approvalRules.createdAt));

    // Get steps for each rule
    const rulesWithSteps = await Promise.all(
      rules.map(async (rule) => {
        const steps = await db
          .select()
          .from(approvalSteps)
          .where(eq(approvalSteps.approvalRuleId, rule.id))
          .orderBy(approvalSteps.stepOrder);

        return { ...rule, steps };
      })
    );

    return rulesWithSteps;
  });