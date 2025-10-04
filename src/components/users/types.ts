export type UserRole = "admin" | "manager" | "employee";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId: string | null;
};

export type UserFormData = {
  name: string;
  email: string;
  role: UserRole;
  managerId: string;
};

