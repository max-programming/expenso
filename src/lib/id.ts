import { IdHelper, type InferId } from "typed-id";

export const companyIdHelper = new IdHelper("cmp");

export type CompanyId = InferId<typeof companyIdHelper>;

export const expenseCategoriesIdHelper = new IdHelper("exp_cat");

export type ExpenseCategoriesId = InferId<typeof expenseCategoriesIdHelper>;

export const expensesIdHelper = new IdHelper("exp");

export type ExpensesId = InferId<typeof expensesIdHelper>;

export const approvalRulesIdHelper = new IdHelper("app_rule");

export type ApprovalRulesId = InferId<typeof approvalRulesIdHelper>;

export const approvalStepsIdHelper = new IdHelper("app_step");

export type ApprovalStepsId = InferId<typeof approvalStepsIdHelper>;

export const expenseApprovalsIdHelper = new IdHelper("exp_app");

export type ExpenseApprovalsId = InferId<typeof expenseApprovalsIdHelper>;

export type UuidType = string;
