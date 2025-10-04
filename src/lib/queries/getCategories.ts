import { queryOptions } from "@tanstack/react-query";
import { getCategories } from "@/server/categories/getCategories";

export const getCategoriesQuery = queryOptions({
  queryKey: ["categories"] as const,
  queryFn: getCategories,
});