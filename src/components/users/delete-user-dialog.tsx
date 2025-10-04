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
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "@/server/users/deleteUser";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@tanstack/react-router";

interface DeleteUserDialogProps extends Omit<DialogProps, "children"> {
  user: User;
}

export function DeleteUserDialog({ user, ...props }: DeleteUserDialogProps) {
  const router = useRouter();
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
  });

  function handleDelete() {
    deleteUserMutation.mutate(
      { data: { id: user.id } },
      {
        onSuccess: () => {
          router.invalidate();
          props.onOpenChange?.(false);
        },
      }
    );
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Delete user?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The user will be permanently removed
            from the system.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            If this user is a manager, all employees reporting to them will have
            their manager assignment cleared.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => props.onOpenChange?.(false)}
            disabled={deleteUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? (
              <>
                <Spinner /> Deleting...
              </>
            ) : (
              "Delete user"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
