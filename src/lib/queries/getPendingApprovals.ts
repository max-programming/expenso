import { queryOptions } from "@tanstack/react-query";
import { getPendingApprovals } from "@/server/expenses/getPendingApprovals";

export const getPendingApprovalsQuery = queryOptions({
  queryKey: ["pending-approvals"] as const,
  queryFn: getPendingApprovals,
});
