import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { Approval } from "./types";

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approval: Approval | null;
  comments: string;
  onCommentsChange: (comments: string) => void;
  onConfirm: () => void;
}

export function ApproveDialog({
  open,
  onOpenChange,
  approval,
  comments,
  onCommentsChange,
  onConfirm,
}: ApproveDialogProps) {
  if (!approval) return null;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: approval.currency,
  }).format(approval.totalAmount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>Approve Expense</DialogTitle>
              <DialogDescription>
                Confirm approval of this expense request
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Request Owner:</div>
              <div className="font-medium">{approval.requestOwner}</div>

              <div className="text-muted-foreground">Category:</div>
              <div className="font-medium capitalize">{approval.category}</div>

              <div className="text-muted-foreground">Amount:</div>
              <div className="font-medium">{formattedAmount}</div>

              <div className="text-muted-foreground">Subject:</div>
              <div className="font-medium">{approval.approvalSubject || "—"}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approve-comments">Comments (Optional)</Label>
            <Textarea
              id="approve-comments"
              placeholder="Add any comments about this approval..."
              value={comments}
              onChange={(e) => onCommentsChange(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-primary hover:bg-primary/90">
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
