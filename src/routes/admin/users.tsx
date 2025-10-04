import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import {
  User,
  createColumns,
  AddUserDialog,
  // EditUserDialog,
  // DeleteUserDialog,
  SendPasswordDialog,
  DeleteUserDialog,
  EditUserDialog,
} from "@/components/users";
import { getUsers } from "@/server/users/getUsers";

export const Route = createFileRoute("/admin/users")({
  component: RouteComponent,
  loader: () => getUsers(),
});

function RouteComponent() {
  const users = Route.useLoaderData();
  const context = Route.useRouteContext();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSendPasswordOpen, setIsSendPasswordOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [sendPasswordUserId, setSendPasswordUserId] = useState<string | null>(
    null
  );

  const availableManagers = useMemo(
    () => users.filter(user => user.role === "manager"),
    [users]
  );

  // Derive user objects from IDs to ensure we always have fresh data
  const editingUser = editingUserId
    ? users.find(u => u.id === editingUserId) || null
    : null;

  const deletingUser = deletingUserId
    ? users.find(u => u.id === deletingUserId) || null
    : null;

  const sendPasswordUser = sendPasswordUserId
    ? users.find(u => u.id === sendPasswordUserId) || null
    : null;

  // Edit User Handlers
  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setIsEditOpen(true);
  };

  // Delete User Handlers
  const handleDelete = (userId: string) => {
    setDeletingUserId(userId);
    setIsDeleteOpen(true);
  };

  // Send Password Handlers
  const handleSendPassword = (userId: string) => {
    setSendPasswordUserId(userId);
    setIsSendPasswordOpen(true);
  };

  const handleSendPasswordOpenChange = (open: boolean) => {
    setIsSendPasswordOpen(open);
    if (!open) {
      setSendPasswordUserId(null);
    }
  };

  const handleConfirmSendPassword = () => {
    // TODO: Implement actual password sending logic
    setIsSendPasswordOpen(false);
    setSendPasswordUserId(null);
  };

  // Table Columns
  const columns = useMemo(
    () =>
      createColumns(
        {
          onEdit: handleEdit,
          onDelete: handleDelete,
          onSendPassword: handleSendPassword,
          availableManagers,
        },
        context.session!.user.id
      ),
    [availableManagers]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Users
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage roles, reporting lines, and credentials for your team
              members.
            </p>
          </div>

          <AddUserDialog
            open={isAddOpen}
            onOpenChange={setIsAddOpen}
            availableManagers={availableManagers}
          />
        </div>

        <DataTable
          columns={columns}
          data={users}
          searchKey="name"
          searchPlaceholder="Search by name..."
        />
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={isEditOpen}
          onOpenChange={open => {
            setIsEditOpen(open);
            if (!open) {
              setEditingUserId(null);
            }
          }}
          availableManagers={availableManagers}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          open={isDeleteOpen}
          onOpenChange={open => {
            setIsDeleteOpen(open);
            if (!open) {
              setDeletingUserId(null);
            }
          }}
        />
      )}

      <SendPasswordDialog
        open={isSendPasswordOpen}
        onOpenChange={handleSendPasswordOpenChange}
        user={sendPasswordUser}
        onConfirm={handleConfirmSendPassword}
      />
    </div>
  );
}
