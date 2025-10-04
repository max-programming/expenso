import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createExpenseColumns, AddExpenseDialog } from "@/components/expenses";
import type { ExpenseFormData } from "@/components/expenses/types";
import { getUsers } from "@/server/users/getUsers";
import { getCategories } from "@/server/categories/getCategories";
import { getExpenses } from "@/server/expenses/getExpenses";
import { useQuery } from "@tanstack/react-query";
import { getExpensesQuery } from "@/lib/queries/getExpenses";
import { getCategoriesQuery } from "@/lib/queries/getCategories";
import { useState } from "react";

export const Route = createFileRoute("/employee/expenses")({
  component: RouteComponent,
  loader: async () => {
    const [users, categories, expenses] = await Promise.all([
      getUsers(),
      getCategories(),
      getExpenses(),
    ]);
    return { users, categories, expenses };
  },
});

function RouteComponent() {
  const initialData = Route.useLoaderData();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Use react-query to manage expenses data with proper cache invalidation
  const { data: expenses = initialData.expenses } = useQuery(getExpensesQuery);
  const { data: categories = initialData.categories } =
    useQuery(getCategoriesQuery);

  const handleAddExpense = (
    newExpense: Omit<
      ExpenseFormData,
      | "id"
      | "submittedAt"
      | "companyId"
      | "employeeId"
      | "createdAt"
      | "updatedAt"
    >
  ) => {
    // TODO: Implement server-side expense creation
    // For now, this will be handled via mutations
    console.log("Adding expense:", newExpense);
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
        users={initialData.users.map((user: any) => ({
          ...user,
          role: user.role ?? "",
        }))}
        categories={categories}
      />
    </div>
  );
}
