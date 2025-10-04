import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AddCategoryDialog } from "@/components/categories/add-category-dialog";
import { EditCategoryDialog } from "@/components/categories/edit-category-dialog";
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog";
import { getCategories } from "@/server/categories/getCategories";
import { CategoriesTable } from "@/components/categories/categories-table";

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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const openEditDialog = (category: Category) => {
    setCategoryToEdit(category);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  };

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
          <CategoriesTable
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </div>

        {/* Edit Category Dialog */}
        {categoryToEdit && (
          <EditCategoryDialog
            category={categoryToEdit}
            open={isEditOpen}
            onOpenChange={open => {
              setIsEditOpen(open);
              if (!open) {
                setCategoryToEdit(null);
              }
            }}
          />
        )}

        {/* Delete Confirmation Dialog */}
        {categoryToDelete && (
          <DeleteCategoryDialog
            category={categoryToDelete}
            open={isDeleteOpen}
            onOpenChange={open => {
              setIsDeleteOpen(open);
              if (!open) {
                setCategoryToDelete(null);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
