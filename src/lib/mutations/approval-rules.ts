import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addApprovalRule } from "@/server/approval-rules/addApprovalRule";
import { updateApprovalRule } from "@/server/approval-rules/updateApprovalRule";
import { deleteApprovalRule } from "@/server/approval-rules/deleteApprovalRule";

export const useAddApprovalRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addApprovalRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approval-rules"] });
    },
  });
};

export const useUpdateApprovalRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApprovalRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approval-rules"] });
    },
  });
};

export const useDeleteApprovalRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApprovalRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approval-rules"] });
    },
  });
};