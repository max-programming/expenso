import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "./types";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/server/users/updateUser";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

type EditUserForm = z.infer<typeof editUserForm>;
const editUserForm = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["manager", "employee"], "Role is required"),
  managerId: z.string().optional(),
});

interface EditUserDialogProps extends Omit<DialogProps, "children"> {
  user: User;
  availableManagers: User[];
}

export function EditUserDialog({
  user,
  availableManagers,
  ...props
}: EditUserDialogProps) {
  const router = useRouter();
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
  });

  const form = useForm<EditUserForm>({
    resolver: zodResolver(editUserForm),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: (user.role === "manager" || user.role === "employee"
        ? user.role
        : "employee") as "manager" | "employee",
      managerId: user.managerId || "",
    },
  });

  const selectedRole = form.watch("role");

  // Update form values when user changes
  useEffect(() => {
    form.reset({
      id: user.id,
      name: user.name,
      email: user.email,
      role: (user.role === "manager" || user.role === "employee"
        ? user.role
        : "employee") as "manager" | "employee",
      managerId: user.managerId || "",
    });
  }, [user, form]);

  function onSubmit(data: EditUserForm) {
    // Remove managerId if role is not employee
    const submitData = {
      ...data,
      managerId: data.role === "employee" ? data.managerId : undefined,
    };

    updateUserMutation.mutate(
      { data: submitData },
      {
        onSuccess: () => {
          router.invalidate();
          props.onOpenChange?.(false);
          form.reset();
        },
        onError: err => {
          form.setError("root", { message: err.message });
        },
      }
    );
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update user details including their role and reporting line.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="Jane Cooper"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="jane.cooper@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={selectedRole}
                onValueChange={value =>
                  form.setValue("role", value as "manager" | "employee", {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>

            {selectedRole === "employee" && (
              <div className="grid gap-2">
                <Label>Manager</Label>
                <Select
                  value={form.watch("managerId") || undefined}
                  onValueChange={value => form.setValue("managerId", value)}
                  disabled={availableManagers.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        availableManagers.length === 0
                          ? "No managers available"
                          : "Select a manager"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent align="start">
                    {availableManagers.map(manager => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                props.onOpenChange?.(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
          {form.formState.errors.root && (
            <div className="text-sm text-destructive mt-2 text-center">
              {form.formState.errors.root.message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
