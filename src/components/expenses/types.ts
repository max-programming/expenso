import type { ExpenseCategoriesId } from "@/lib/id";

export type ExpenseStatus = "draft" | "pending" | "approved" | "rejected";

export interface Expense {
  id: string;
  companyId: string;
  employeeId: string;
  categoryId?: ExpenseCategoriesId;
  amount: number;
  currencyCode: string;
  description: string;
  expenseDate: Date;
  paidBy?: string;
  status: ExpenseStatus;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}