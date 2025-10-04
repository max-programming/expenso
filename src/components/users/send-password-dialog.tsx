import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "./types";

type SendPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => void;
};

export function SendPasswordDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
}: SendPasswordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Share password?</DialogTitle>
          <DialogDescription>
            {user
              ? `We will email a temporary password to ${user.email}.`
              : "We will email a temporary password to the selected user."}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This action will send a reset link and temporary password to the user.
          Make sure the email address is correct before continuing.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!user} onClick={onConfirm}>
            Yes, send it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

