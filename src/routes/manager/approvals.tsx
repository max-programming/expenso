import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import {
  Approval,
  createColumns,
  ApproveDialog,
  RejectDialog,
} from "@/components/approvals";
import { useQuery } from "@tanstack/react-query";
import { getPendingApprovalsQuery } from "@/lib/queries/getPendingApprovals";
import {
  useApproveExpense,
  useRejectExpense,
} from "@/lib/mutations/expenses";

export const Route = createFileRoute("/manager/approvals")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: pendingApprovalsData = [], isLoading } = useQuery(
    getPendingApprovalsQuery
  );

  const approveMutation = useApproveExpense();
  const rejectMutation = useRejectExpense();
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null
  );
  const [approveComments, setApproveComments] = useState("");
  const [rejectComments, setRejectComments] = useState("");

  // Transform the data to match the Approval type
  const approvals: Approval[] = pendingApprovalsData.map((item) => ({
    id: item.approvalId,
    approvalSubject: item.description,
    requestOwner: item.employeeName,
    category: item.categoryName || "Uncategorized",
    requestStatus: item.approvalAction,
    totalAmount: Number(item.amount),
    currency: item.currencyCode,
  }));

  // Handle Approve
  const handleApprove = (approvalId: string) => {
    const approval = approvals.find((a) => a.id === approvalId);
    if (approval) {
      setSelectedApproval(approval);
      setIsApproveOpen(true);
    }
  };

  const handleApproveOpenChange = (open: boolean) => {
    setIsApproveOpen(open);
    if (!open) {
      setSelectedApproval(null);
      setApproveComments("");
    }
  };

  const handleConfirmApprove = () => {
    if (!selectedApproval) return;

    approveMutation.mutate(
      {
        data: {
          approvalId: selectedApproval.id,
          comments: approveComments,
        },
      },
      {
        onSuccess: () => {
          setIsApproveOpen(false);
          setSelectedApproval(null);
          setApproveComments("");
        },
        onError: (error) => {
          console.error("Failed to approve expense:", error);
        },
      }
    );
  };

  // Handle Reject
  const handleReject = (approvalId: string) => {
    const approval = approvals.find((a) => a.id === approvalId);
    if (approval) {
      setSelectedApproval(approval);
      setIsRejectOpen(true);
    }
  };

  const handleRejectOpenChange = (open: boolean) => {
    setIsRejectOpen(open);
    if (!open) {
      setSelectedApproval(null);
      setRejectComments("");
    }
  };

  const handleConfirmReject = () => {
    if (!selectedApproval || !rejectComments.trim()) return;

    rejectMutation.mutate(
      {
        data: {
          approvalId: selectedApproval.id,
          comments: rejectComments,
        },
      },
      {
        onSuccess: () => {
          setIsRejectOpen(false);
          setSelectedApproval(null);
          setRejectComments("");
        },
        onError: (error) => {
          console.error("Failed to reject expense:", error);
        },
      }
    );
  };

  // Table Columns
  const columns = useMemo(
    () =>
      createColumns({
        onApprove: handleApprove,
        onReject: handleReject,
      }),
    []
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Manager's View
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review and approve expense requests from your team members
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold mb-6">Approvals to Review</h2>

          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Loading approvals...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={approvals}
              searchKey="requestOwner"
              searchPlaceholder="Search by request owner..."
            />
          )}
        </div>
      </div>

      <ApproveDialog
        open={isApproveOpen}
        onOpenChange={handleApproveOpenChange}
        approval={selectedApproval}
        comments={approveComments}
        onCommentsChange={setApproveComments}
        onConfirm={handleConfirmApprove}
      />

      <RejectDialog
        open={isRejectOpen}
        onOpenChange={handleRejectOpenChange}
        approval={selectedApproval}
        comments={rejectComments}
        onCommentsChange={setRejectComments}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
