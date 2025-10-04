import { queryOptions } from "@tanstack/react-query";
import { getApprovalRules } from "@/server/approval-rules/getApprovalRules";

export const getApprovalRulesQuery = queryOptions({
  queryKey: ["approval-rules"] as const,
  queryFn: getApprovalRules,
});