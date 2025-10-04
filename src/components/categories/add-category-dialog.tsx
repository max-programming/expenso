import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { addCategory } from "@/server/categories/addCategory";
import { Spinner } from "../ui/spinner";
import { useRouter } from "@tanstack/react-router";

type AddCategoryForm = z.infer<typeof addCategoryForm>;
const addCategoryForm = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
});

export function AddCategoryDialog(props: DialogProps) {
  const router = useRouter();
  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
  });
  const form = useForm<AddCategoryForm>({
    resolver: zodResolver(addCategoryForm),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(data: AddCategoryForm) {
    addCategoryMutation.mutate(
      { data },
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
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category for organizing your expenses
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Food & Dining"
                {...form.register("name")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this category"
                rows={3}
                {...form.register("description")}
              />
            </div>
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
            <Button type="submit" disabled={addCategoryMutation.isPending}>
              {addCategoryMutation.isPending ? (
                <>
                  <Spinner /> Adding...
                </>
              ) : (
                "Add Category"
              )}
            </Button>
            {form.formState.errors &&
              Object.entries(form.formState.errors).map(([key, error]) => (
                <div key={key} className="text-red-500">
                  {error.message}
                </div>
              ))}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
