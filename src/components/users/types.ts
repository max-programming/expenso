import { getUsers } from "@/server/users/getUsers";

export type UserRole = "admin" | "manager" | "employee";

export type User = Awaited<ReturnType<typeof getUsers>>[number];

export type UserFormData = {
  name: string;
  email: string;
  role: UserRole;
  managerId: string;
};
