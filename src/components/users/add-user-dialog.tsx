import { Plus, Copy, CheckCircle2, AlertCircle } from "lucide-react";
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
import { addUser } from "@/server/users/addUser";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

type AddUserForm = z.infer<typeof addUserForm>;
const addUserForm = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["manager", "employee"], "Role is required"),
  managerId: z.string().optional(),
});

interface AddUserDialogProps extends Omit<DialogProps, "children"> {
  availableManagers: User[];
}

export function AddUserDialog({
  availableManagers,
  ...props
}: AddUserDialogProps) {
  const router = useRouter();
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );
  const [copiedPassword, setCopiedPassword] = useState(false);

  const addUserMutation = useMutation({
    mutationFn: addUser,
  });

  const form = useForm<AddUserForm>({
    resolver: zodResolver(addUserForm),
    defaultValues: {
      name: "",
      email: "",
      role: "employee",
      managerId: "",
    },
  });

  const selectedRole = form.watch("role");

  function onSubmit(data: AddUserForm) {
    // Remove managerId if role is not employee
    const submitData = {
      ...data,
      managerId: data.role === "employee" ? data.managerId : undefined,
    };

    addUserMutation.mutate(
      { data: submitData },
      {
        onSuccess: response => {
          router.invalidate();
          setGeneratedPassword(response.defaultPassword);
        },
        onError: err => {
          form.setError("root", { message: err.message });
        },
      }
    );
  }

  function handleCopyPassword() {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  }

  function handleClose() {
    props.onOpenChange?.(false);
    // Reset after dialog animation completes
    setTimeout(() => {
      form.reset();
      setGeneratedPassword(null);
      setCopiedPassword(false);
      addUserMutation.reset();
    }, 200);
  }

  // Show password success view
  if (generatedPassword) {
    return (
      <Dialog {...props}>
        <DialogTrigger asChild>
          <Button className="gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            Add New User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              User Created Successfully
            </DialogTitle>
            <DialogDescription>
              Save the password below. It will not be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="rounded-lg border-2 border-amber-500 bg-amber-50 p-4 dark:bg-amber-950/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                    Important: Save this password now
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    This is the only time you'll see this password. Make sure to
                    save it securely or share it with the user immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="generated-password">Generated Password</Label>
              <div className="flex gap-2">
                <Input
                  id="generated-password"
                  value={generatedPassword}
                  readOnly
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPassword}
                >
                  {copiedPassword ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {copiedPassword && (
                <p className="text-xs text-green-600 dark:text-green-500">
                  Password copied to clipboard!
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Show form view
  return (
    <Dialog {...props}>
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
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
            <Button type="submit" disabled={addUserMutation.isPending}>
              {addUserMutation.isPending ? (
                <>
                  <Spinner /> Adding...
                </>
              ) : (
                "Add User"
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
