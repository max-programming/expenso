import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { deleteCategory } from "@/server/categories/deleteCategory";
import { Spinner } from "../ui/spinner";
import { useRouter } from "@tanstack/react-router";
import { getCategories } from "@/server/categories/getCategories";

type Category = Awaited<ReturnType<typeof getCategories>>[number];

interface DeleteCategoryDialogProps extends Omit<DialogProps, "children"> {
  category: Category;
}

export function DeleteCategoryDialog({
  category,
  ...props
}: DeleteCategoryDialogProps) {
  const router = useRouter();
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
  });

  function handleDelete() {
    if (!category) return;

    deleteCategoryMutation.mutate(
      { data: { id: category.id } },
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        {category && (
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium text-foreground">{category.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {category.description}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => props.onOpenChange?.(false)}
            disabled={deleteCategoryMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCategoryMutation.isPending}
          >
            {deleteCategoryMutation.isPending ? (
              <>
                <Spinner /> Deleting...
              </>
            ) : (
              "Delete Category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
