import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "../ui/table";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useLoaderData } from "@tanstack/react-router";
import { Badge } from "../ui/badge";
import { getCategories } from "@/server/categories/getCategories";

type Category = Awaited<ReturnType<typeof getCategories>>[number];

interface CategoriesTableProps {
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoriesTable({ onEdit, onDelete }: CategoriesTableProps) {
  const categories = useLoaderData({ from: "/admin/categories" });

  return (
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
                <Badge>{category.name}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {category.description}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit?.(category)}
                  className="mr-1 h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit {category.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete?.(category)}
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
  );
}
