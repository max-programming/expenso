import type { ExpenseCategoriesId } from "@/lib/id";
import type { getExpenses } from "@/server/expenses/getExpenses";

export type ExpenseStatus = "draft" | "pending" | "approved" | "rejected";

// Derive the Expense type from the server function return type
export type Expense = Awaited<ReturnType<typeof getExpenses>>[number];

// Legacy interface for form handling - use this for creating new expenses
export interface ExpenseFormData {
  id?: string;
  companyId?: string;
  employeeId?: string;
  categoryId?: ExpenseCategoriesId;
  amount: number;
  currencyCode: string;
  description: string;
  expenseDate: Date;
  paidBy?: string;
  status: ExpenseStatus;
  submittedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
