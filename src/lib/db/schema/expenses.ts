import {
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { companies } from "./companies";
import {
  approvalRulesIdHelper,
  approvalStepsIdHelper,
  expenseApprovalsIdHelper,
  expenseCategoriesIdHelper,
  expensesIdHelper,
  ApprovalRulesId,
  ApprovalStepsId,
  CompanyId,
  ExpenseApprovalsId,
  ExpenseCategoriesId,
  ExpensesId,
  UuidType,
} from "@/lib/id";

export const expenseStatusEnum = pgEnum("expense_status", [
  "draft",
  "pending",
  "approved",
  "rejected",
]);

export const approvalRuleTypeEnum = pgEnum("approval_rule_type", [
  "sequential",
  "percentage",
  "specific_approver",
  "hybrid",
]);

export const approvalActionEnum = pgEnum("approval_action", [
  "pending",
  "approved",
  "rejected",
]);

export const expenseCategories = pgTable(
  "expense_categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => expenseCategoriesIdHelper.generate())
      .$type<ExpenseCategoriesId>(),
    companyId: text("company_id")
      .$type<CompanyId>()
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueCompanyCategory: unique().on(table.companyId, table.name),
  })
);

export const expenses = pgTable("expenses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => expensesIdHelper.generate())
    .$type<ExpensesId>(),
  companyId: text("company_id")
    .$type<CompanyId>()
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  employeeId: text("employee_id")
    .$type<UuidType>()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .$type<ExpenseCategoriesId>()
    .references(() => expenseCategories.id, {
      onDelete: "set null",
    }),

  amount: numeric("amount").notNull(),
  currencyCode: varchar("currency_code", { length: 3 }).notNull(),

  description: text("description").notNull(),
  expenseDate: date("expense_date").notNull(),

  paidBy: text("paid_by").$type<UuidType>().references(() => users.id, { onDelete: "cascade" }),

  status: expenseStatusEnum("status").default("draft").notNull(),
  submittedAt: timestamp("submitted_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const approvalRules = pgTable("approval_rules", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => approvalRulesIdHelper.generate())
    .$type<ApprovalRulesId>(),
  companyId: text("company_id")
    .$type<CompanyId>()
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),

  // Rule configuration
  ruleType: approvalRuleTypeEnum("rule_type").notNull(),
  isManagerFirst: boolean("is_manager_first").default(true).notNull(),

  // Threshold settings
  amount: numeric("amount"),

  // Conditional rules
  approvalPercentage: integer("approval_percentage"),
  specificApproverId: text("specific_approver_id")
    .$type<UuidType>()
    .references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const approvalSteps = pgTable(
  "approval_steps",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => approvalStepsIdHelper.generate())
      .$type<ApprovalStepsId>(),
    approvalRuleId: text("approval_rule_id")
      .$type<ApprovalRulesId>()
      .notNull()
      .references(() => approvalRules.id, { onDelete: "cascade" }),
    approverId: text("approver_id")
      .$type<UuidType>()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stepOrder: integer("step_order").notNull(),
    // stepName: varchar("step_name", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueRuleStep: unique().on(table.approvalRuleId, table.stepOrder),
  })
);

export const expenseApprovals = pgTable("expense_approvals", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => expenseApprovalsIdHelper.generate())
    .$type<ExpenseApprovalsId>(),
  expenseId: text("expense_id")
    .$type<ExpensesId>()
    .notNull()
    .references(() => expenses.id, { onDelete: "cascade" }),
  approvalRuleId: text("approval_rule_id")
    .$type<ApprovalRulesId>()
    .references(() => approvalRules.id, {
      onDelete: "set null",
    }),
  approverId: text("approver_id")
    .$type<UuidType>()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  stepOrder: integer("step_order"),
  action: approvalActionEnum("action").default("pending").notNull(),
  comments: text("comments"),

  // Timestamps
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  actionAt: timestamp("action_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
