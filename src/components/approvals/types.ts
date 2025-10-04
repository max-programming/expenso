export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Approval {
  id: string;
  approvalSubject: string;
  requestOwner: string;
  category: string;
  requestStatus: ApprovalStatus;
  totalAmount: number;
  currency: string;
}
