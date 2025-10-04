import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import {
  Approval,
  createColumns,
  ApproveDialog,
  RejectDialog,
} from "@/components/approvals";

export const Route = createFileRoute("/manager/approvals")({
  component: RouteComponent,
});

const initialApprovals: Approval[] = [
  {
    id: "exp-001",
    approvalSubject: "none",
    requestOwner: "Sarah",
    category: "food",
    requestStatus: "pending",
    totalAmount: 49896,
    currency: "INR",
  },
  {
    id: "exp-002",
    approvalSubject: "Team Lunch - Q1 Planning",
    requestOwner: "John Doe",
    category: "food",
    requestStatus: "pending",
    totalAmount: 8500,
    currency: "INR",
  },
  {
    id: "exp-003",
    approvalSubject: "Client Meeting Dinner",
    requestOwner: "Emily Chen",
    category: "food",
    requestStatus: "approved",
    totalAmount: 12300,
    currency: "INR",
  },
  {
    id: "exp-004",
    approvalSubject: "Office Supplies",
    requestOwner: "Michael Brown",
    category: "office",
    requestStatus: "pending",
    totalAmount: 3250,
    currency: "INR",
  },
  {
    id: "exp-005",
    approvalSubject: "Travel - Mumbai Conference",
    requestOwner: "Priya Sharma",
    category: "travel",
    requestStatus: "rejected",
    totalAmount: 45000,
    currency: "INR",
  },
];

function RouteComponent() {
  const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(
    null
  );
  const [approveComments, setApproveComments] = useState("");
  const [rejectComments, setRejectComments] = useState("");

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

    setApprovals((prev) =>
      prev.map((approval) =>
        approval.id === selectedApproval.id
          ? { ...approval, requestStatus: "approved" }
          : approval
      )
    );

    // TODO: Send approveComments to backend
    console.log("Approved with comments:", approveComments);

    setIsApproveOpen(false);
    setSelectedApproval(null);
    setApproveComments("");
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

    setApprovals((prev) =>
      prev.map((approval) =>
        approval.id === selectedApproval.id
          ? { ...approval, requestStatus: "rejected" }
          : approval
      )
    );

    // TODO: Send rejectComments to backend
    console.log("Rejected with reason:", rejectComments);

    setIsRejectOpen(false);
    setSelectedApproval(null);
    setRejectComments("");
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

          <DataTable
            columns={columns}
            data={approvals}
            searchKey="requestOwner"
            searchPlaceholder="Search by request owner..."
          />
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
