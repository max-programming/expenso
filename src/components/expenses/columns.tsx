import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import type { Expense } from "./types";

export const createExpenseColumns = (): ColumnDef<Expense>[] => [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "categoryId",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("categoryId") || "Uncategorized"}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount") as string);
      const currencyCode = row.original.currencyCode;
      return (
        <div className="font-medium">
          {currencyCode} {amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "expenseDate",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("expenseDate") as string | Date;
      return <div>{dayjs(date).format("MMM DD, YYYY")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Expense["status"];
      const statusColors = {
        draft: "bg-gray-500",
        pending: "bg-yellow-500",
        approved: "bg-green-500",
        rejected: "bg-red-500",
      };

      return (
        <Badge
          className={`${statusColors[status]} text-white capitalize`}
          variant="secondary"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => {
      const submittedAt = row.getValue("submittedAt") as Date | null;
      return submittedAt ? (
        <div className="text-sm text-muted-foreground">
          {dayjs(submittedAt).format("MMM DD, HH:mm")}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">-</div>
      );
    },
  },
];
