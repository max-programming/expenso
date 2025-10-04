import { IdHelper, type InferId } from "typed-id";
import { createZodIdSchema } from "typed-id/validators/zod";

export const companyIdHelper = new IdHelper("cmp");
export const expenseCategoriesIdHelper = new IdHelper("exp_cat");
export const expensesIdHelper = new IdHelper("exp");
export const approvalRulesIdHelper = new IdHelper("app_rule");
export const approvalStepsIdHelper = new IdHelper("app_step");
export const expenseApprovalsIdHelper = new IdHelper("exp_app");

export type CompanyId = InferId<typeof companyIdHelper>;
export type ExpenseCategoriesId = InferId<typeof expenseCategoriesIdHelper>;
export type ExpensesId = InferId<typeof expensesIdHelper>;
export type ApprovalRulesId = InferId<typeof approvalRulesIdHelper>;
export type ApprovalStepsId = InferId<typeof approvalStepsIdHelper>;
export type ExpenseApprovalsId = InferId<typeof expenseApprovalsIdHelper>;

export const zCompanyId = createZodIdSchema(companyIdHelper);
export const zExpenseCategoriesId = createZodIdSchema(
  expenseCategoriesIdHelper
);
export const zApprovalRulesId = createZodIdSchema(approvalRulesIdHelper);
export const zExpenseApprovalsId = createZodIdSchema(expenseApprovalsIdHelper);
export const zExpensesId = createZodIdSchema(expensesIdHelper);
