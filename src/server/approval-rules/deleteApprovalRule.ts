import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db/connection";
import { approvalRules } from "@/lib/db/schema/expenses";
import { authMiddleware } from "../auth-middleware";
import { users } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";
import { zCompanyId, zApprovalRulesId } from "@/lib/id";
import { z } from "zod";

const deleteApprovalRuleSchema = z.object({
  id: zApprovalRulesId,
});

export const deleteApprovalRule = createServerFn({ method: "POST" })
  .inputValidator(deleteApprovalRuleSchema)
  .middleware([authMiddleware])
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

    const { success } = zCompanyId.safeParse(user.companyId);
    if (!success) {
      throw new Error("Invalid company id");
    }

    await db.delete(approvalRules).where(eq(approvalRules.id, data.id));

    return { success: true };
  });
