import { queryOptions } from "@tanstack/react-query";
import { getManagers } from "@/server/getManagers";

export const getManagersQuery = queryOptions({
  queryKey: ["managers"] as const,
  queryFn: getManagers,
});