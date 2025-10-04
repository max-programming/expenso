import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Expense,
  createExpenseColumns,
  AddExpenseDialog,
} from "@/components/expenses";

export const Route = createFileRoute("/employee/expenses")({
  component: RouteComponent,
});

const initialExpenses: Expense[] = [
  {
    id: "exp-001",
    companyId: "comp-001",
    employeeId: "emp-001",
    description: "Team Lunch Meeting",
    categoryId: "exp_cat-001" as any, // Meals
    amount: 2500,
    currencyCode: "INR",
    expenseDate: new Date("2024-01-15"),
    status: "pending",
    submittedAt: new Date("2024-01-15T10:00:00"),
    createdAt: new Date("2024-01-15T09:00:00"),
    updatedAt: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "exp-002",
    companyId: "comp-001",
    employeeId: "emp-001",
    description: "Office Supplies - Notebooks",
    categoryId: "exp_cat-003" as any, // Office Supplies
    amount: 450,
    currencyCode: "INR",
    expenseDate: new Date("2024-01-14"),
    status: "approved",
    submittedAt: new Date("2024-01-14T14:30:00"),
    createdAt: new Date("2024-01-14T13:00:00"),
    updatedAt: new Date("2024-01-14T14:30:00"),
  },
  {
    id: "exp-003",
    companyId: "comp-001",
    employeeId: "emp-001",
    description: "Taxi to Client Meeting",
    categoryId: "exp_cat-002" as any, // Travel
    amount: 1200,
    currencyCode: "INR",
    expenseDate: new Date("2024-01-13"),
    status: "pending",
    submittedAt: new Date("2024-01-13T09:15:00"),
    createdAt: new Date("2024-01-13T08:00:00"),
    updatedAt: new Date("2024-01-13T09:15:00"),
  },
  {
    id: "exp-004",
    companyId: "comp-001",
    employeeId: "emp-001",
    description: "Hotel Stay - Conference",
    categoryId: "exp_cat-002" as any, // Travel
    amount: 8500,
    currencyCode: "INR",
    expenseDate: new Date("2024-01-12"),
    status: "rejected",
    submittedAt: new Date("2024-01-12T16:45:00"),
    createdAt: new Date("2024-01-12T15:00:00"),
    updatedAt: new Date("2024-01-12T16:45:00"),
  },
  {
    id: "exp-005",
    companyId: "comp-001",
    employeeId: "emp-001",
    description: "Coffee with Team",
    categoryId: "exp_cat-001" as any, // Meals
    amount: 300,
    currencyCode: "INR",
    expenseDate: new Date("2024-01-11"),
    status: "approved",
    submittedAt: new Date("2024-01-11T11:20:00"),
    createdAt: new Date("2024-01-11T10:00:00"),
    updatedAt: new Date("2024-01-11T11:20:00"),
  },
];

function RouteComponent() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const handleAddExpense = (
    newExpense: Omit<
      Expense,
      | "id"
      | "submittedAt"
      | "companyId"
      | "employeeId"
      | "createdAt"
      | "updatedAt"
    >
  ) => {
    const expense: Expense = {
      ...newExpense,
      id: `exp-${Date.now()}`,
      submittedAt: new Date(),
      companyId: "comp-001", // Mock company ID
      employeeId: "emp-001", // Mock employee ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setExpenses((prev) => [...prev, expense]);
  };

  // Table Columns
  const columns = useMemo(() => createExpenseColumns(), []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Employee's View
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your expense claims and track their approval status
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Your Expenses</h2>
            <p className="text-sm text-muted-foreground">
              View and manage all your submitted expense claims
            </p>
          </div>
          <Button onClick={() => setIsAddExpenseOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Expense
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <DataTable
            columns={columns}
            data={expenses}
            searchKey="description"
            searchPlaceholder="Search expenses..."
          />
        </div>
      </div>

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
}
