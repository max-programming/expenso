import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddCategoryDialog } from "@/components/categories/add-category-dialog";
import { getCategories } from "@/server/categories/getCategories";

export const Route = createFileRoute("/admin/categories")({
  component: RouteComponent,
  loader: () => getCategories(),
  head: () => ({
    meta: [
      {
        title: "Admin - Expense Categories",
      },
    ],
  }),
});

type Category = Awaited<ReturnType<typeof getCategories>>[number];

function RouteComponent() {
  const categories = Route.useLoaderData();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  // const [editForm, setEditForm] = useState({ name: "", description: "" });

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      // setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    }
  };

  const openEditDialog = (category: Category) => {
    setCategoryToEdit(category);
    // setEditForm({ name: category.name, description: category.description });
    setIsEditOpen(true);
  };

  const handleEditCategory = () => {
    if (!categoryToEdit) return;

    // const trimmedName = editForm.name.trim();
    // if (!trimmedName) return;

    // setCategories(prev =>
    //   prev.map(category =>
    //     category.id === categoryToEdit.id
    //       ? {
    //           ...category,
    //           name: trimmedName,
    //           description: editForm.description,
    //         }
    //       : category
    //   )
    // );

    setIsEditOpen(false);
    setCategoryToEdit(null);
    // setEditForm({ name: "", description: "" });
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const badgeStyles =
    "inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Categories
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage your expense categories
              </p>
            </div>

            {/* Add Category Dialog */}
            <AddCategoryDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-sm">No categories found</p>
                      <p className="text-xs mt-1">
                        Click "Add Category" to create one
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map(category => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <span className={badgeStyles}>{category.name}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                        className="mr-1 h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit {category.name}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(category)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {category.name}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Category Dialog */}
        <Dialog
          open={isEditOpen}
          onOpenChange={open => {
            setIsEditOpen(open);
            if (!open) {
              setCategoryToEdit(null);
              // setEditForm({ name: "", description: "" });
            }
          }}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details and save your changes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  // value={editForm.name}
                  // onChange={event =>
                  //   setEditForm(current => ({
                  //     ...current,
                  //     name: event.target.value,
                  //   }))
                  // }
                  placeholder="e.g., Groceries"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  // value={editForm.description}
                  // onChange={event =>
                  //   setEditForm(current => ({
                  //     ...current,
                  //     description: event.target.value,
                  //   }))
                  // }
                  rows={3}
                  placeholder="Brief description of this category"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  setCategoryToEdit(null);
                  // setEditForm({ name: "", description: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditCategory}
                // disabled={!editForm.name.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedCategory && (
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium text-foreground">
                  {selectedCategory.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCategory.description}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedCategory(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>
                Delete Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
