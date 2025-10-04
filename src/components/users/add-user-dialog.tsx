import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, UserFormData } from "./types";
import { UserFormFields } from "./user-form-fields";

type AddUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UserFormData;
  onFormChange: (data: Partial<UserFormData>) => void;
  onSubmit: () => void;
  availableManagers: User[];
};

export function AddUserDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  availableManagers,
}: AddUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add a new team member</DialogTitle>
          <DialogDescription>
            Capture the basics so you can send credentials right away.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <UserFormFields
            formData={formData}
            onChange={onFormChange}
            availableManagers={availableManagers}
            fieldPrefix="new-user"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

