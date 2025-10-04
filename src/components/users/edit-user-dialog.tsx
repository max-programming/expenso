import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, UserFormData } from "./types";
import { UserFormFields } from "./user-form-fields";

type EditUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UserFormData;
  onFormChange: (data: Partial<UserFormData>) => void;
  onSubmit: () => void;
  availableManagers: User[];
};

export function EditUserDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  availableManagers,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update user details including their role and reporting line.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <UserFormFields
            formData={formData}
            onChange={onFormChange}
            availableManagers={availableManagers}
            fieldPrefix="edit-user"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

