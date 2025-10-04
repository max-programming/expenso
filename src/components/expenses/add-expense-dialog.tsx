import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExpenseFormData } from "./types";
import type { ExpenseCategoriesId as ExpenseCatId } from "@/lib/id";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (
    expense: Omit<
      ExpenseFormData,
      | "id"
      | "submittedAt"
      | "companyId"
      | "employeeId"
      | "createdAt"
      | "updatedAt"
    >
  ) => void;
  users: User[];
  categories: Category[];
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onAddExpense,
  users,
  categories,
}: AddExpenseDialogProps) {
  const [form, setForm] = useState({
    categoryId: "",
    description: "",
    amount: "",
    currencyCode: "INR",
    expenseDate: "",
    paidBy: "",
    remarks: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.description ||
      !form.categoryId ||
      !form.amount ||
      !form.expenseDate
    ) {
      return;
    }

    const newExpense: Omit<
      ExpenseFormData,
      | "id"
      | "submittedAt"
      | "companyId"
      | "employeeId"
      | "createdAt"
      | "updatedAt"
    > = {
      categoryId: form.categoryId as ExpenseCatId,
      description: form.description,
      amount: parseFloat(form.amount),
      currencyCode: form.currencyCode,
      expenseDate: new Date(form.expenseDate),
      paidBy: form.paidBy || undefined,
      status: "draft",
    };

    onAddExpense(newExpense);

    // Reset form
    setForm({
      categoryId: "",
      description: "",
      amount: "",
      currencyCode: "INR",
      expenseDate: "",
      paidBy: "",
      remarks: "",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={e =>
                setForm(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe the expense..."
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={form.categoryId}
              onValueChange={value =>
                setForm(prev => ({ ...prev, categoryId: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={e =>
                setForm(prev => ({ ...prev, amount: e.target.value }))
              }
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="currencyCode">Currency</Label>
            <Select
              value={form.currencyCode}
              onValueChange={value =>
                setForm(prev => ({ ...prev, currencyCode: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expenseDate">Expense Date *</Label>
            <Input
              id="expenseDate"
              type="date"
              value={form.expenseDate}
              onChange={e =>
                setForm(prev => ({ ...prev, expenseDate: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="paidBy">Paid By</Label>
            <Select
              value={form.paidBy}
              onValueChange={value =>
                setForm(prev => ({ ...prev, paidBy: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={form.remarks}
              onChange={e =>
                setForm(prev => ({ ...prev, remarks: e.target.value }))
              }
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Expense</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
