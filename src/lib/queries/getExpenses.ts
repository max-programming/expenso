import { queryOptions } from "@tanstack/react-query";
import { getExpenses } from "@/server/expenses/getExpenses";

export const getExpensesQuery = queryOptions({
  queryKey: ["expenses"] as const,
  queryFn: getExpenses,
});
