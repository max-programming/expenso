import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import {
  User,
  UserFormData,
  createColumns,
  AddUserDialog,
  EditUserDialog,
  DeleteUserDialog,
  SendPasswordDialog,
} from "@/components/users";
import { getUsers } from "@/server/users/getUsers";

export const Route = createFileRoute("/admin/users")({
  component: RouteComponent,
  loader: () => getUsers(),
});

const initialFormData: UserFormData = {
  name: "",
  email: "",
  role: "employee",
  managerId: "",
};

function RouteComponent() {
  const users = Route.useLoaderData();
  const context = Route.useRouteContext();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSendPasswordOpen, setIsSendPasswordOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [sendPasswordUserId, setSendPasswordUserId] = useState<string | null>(
    null
  );
  const [editUserForm, setEditUserForm] =
    useState<UserFormData>(initialFormData);

  const availableManagers = useMemo(
    () => users.filter(user => user.role === "manager"),
    [users]
  );

  const deletingUser = deletingUserId
    ? users.find(u => u.id === deletingUserId) || null
    : null;

  const sendPasswordUser = sendPasswordUserId
    ? users.find(u => u.id === sendPasswordUserId) || null
    : null;

  // Edit User Handlers
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditUserForm({
      name: user.name,
      email: user.email,
      // @ts-ignore
      role: user.role,
      managerId: user.managerId || "",
    });
    setIsEditOpen(true);
  };

  const handleEditOpenChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setEditingUser(null);
      setEditUserForm(initialFormData);
    }
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const trimmedName = editUserForm.name.trim();
    const trimmedEmail = editUserForm.email.trim();

    if (!trimmedName || !trimmedEmail) {
      return;
    }

    // TODO: Implement update user logic with server function

    setIsEditOpen(false);
    setEditingUser(null);
    setEditUserForm(initialFormData);
  };

  // Delete User Handlers
  const handleDelete = (userId: string) => {
    setDeletingUserId(userId);
    setIsDeleteOpen(true);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    setIsDeleteOpen(open);
    if (!open) {
      setDeletingUserId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingUserId) return;

    // TODO: Implement delete user logic with server function

    setIsDeleteOpen(false);
    setDeletingUserId(null);
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

      <EditUserDialog
        open={isEditOpen}
        onOpenChange={handleEditOpenChange}
        formData={editUserForm}
        onFormChange={data => setEditUserForm(prev => ({ ...prev, ...data }))}
        onSubmit={handleUpdateUser}
        availableManagers={availableManagers}
      />

      <DeleteUserDialog
        open={isDeleteOpen}
        onOpenChange={handleDeleteOpenChange}
        user={deletingUser}
        onConfirm={handleConfirmDelete}
      />

      <SendPasswordDialog
        open={isSendPasswordOpen}
        onOpenChange={handleSendPasswordOpenChange}
        user={sendPasswordUser}
        onConfirm={handleConfirmSendPassword}
      />
    </div>
  );
}
