import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
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
import { updateCategory } from "@/server/categories/updateCategory";
import { Spinner } from "../ui/spinner";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { zExpenseCategoriesId } from "@/lib/id";
import { getCategories } from "@/server/categories/getCategories";

type EditCategoryForm = z.infer<typeof editCategoryForm>;
const editCategoryForm = z.object({
  id: zExpenseCategoriesId,
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().nullable(),
});

type Category = Awaited<ReturnType<typeof getCategories>>[number];

interface EditCategoryDialogProps extends Omit<DialogProps, "children"> {
  category: Category;
}

export function EditCategoryDialog({
  category,
  ...props
}: EditCategoryDialogProps) {
  const router = useRouter();
  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
  });

  const form = useForm<EditCategoryForm>({
    resolver: zodResolver(editCategoryForm),
    defaultValues: {
      id: category.id,
      name: category.name,
      description: category.description || "",
    },
  });

  // Update form values when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        id: category.id,
        name: category.name,
        description: category.description,
      });
    }
  }, [category, form]);

  function onSubmit(data: EditCategoryForm) {
    updateCategoryMutation.mutate(
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category details and save your changes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Groceries"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={3}
                placeholder="Brief description of this category"
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
            <Button type="submit" disabled={updateCategoryMutation.isPending}>
              {updateCategoryMutation.isPending ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
          {form.formState.errors.root && (
            <div className="text-sm text-destructive mt-2">
              {form.formState.errors.root.message}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
