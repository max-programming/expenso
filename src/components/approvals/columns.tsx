import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Approval, ApprovalStatus } from "./types";

interface CreateColumnsProps {
  onApprove: (approvalId: string) => void;
  onReject: (approvalId: string) => void;
}

export function createColumns({
  onApprove,
  onReject,
}: CreateColumnsProps): ColumnDef<Approval>[] {
  return [
    {
      accessorKey: "approvalSubject",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Approval Subject
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const subject = row.getValue("approvalSubject") as string;
        return <div className="font-medium">{subject || "—"}</div>;
      },
    },
    {
      accessorKey: "requestOwner",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Request Owner
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const owner = row.getValue("requestOwner") as string;
        return <div>{owner}</div>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return <div className="capitalize">{category}</div>;
      },
    },
    {
      accessorKey: "requestStatus",
      header: "Request Status",
      cell: ({ row }) => {
        const status = row.getValue("requestStatus") as ApprovalStatus;

        const statusConfig = {
          pending: { label: "Pending", variant: "secondary" as const },
          approved: { label: "Approved", variant: "default" as const },
          rejected: { label: "Rejected", variant: "destructive" as const },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
          <Badge variant={config.variant} className="capitalize">
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-start"
          >
            Total Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue("totalAmount") as number;
        const currency = row.original.currency;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const approval = row.original;
        const isPending = approval.requestStatus === "pending";

        if (!isPending) {
          return <div className="text-muted-foreground text-sm">—</div>;
        }

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => onApprove(approval.id)}
              className="bg-primary hover:bg-primary/90"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject(approval.id)}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        );
      },
    },
  ];
}
