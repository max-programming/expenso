import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveExpense } from "@/server/expenses/approveExpense";
import { rejectExpense } from "@/server/expenses/rejectExpense";

export const useApproveExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
    },
  });
};

export const useRejectExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
    },
  });
};
