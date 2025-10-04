import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserFormData, UserRole } from "./types";

type UserFormFieldsProps = {
  formData: UserFormData;
  onChange: (data: Partial<UserFormData>) => void;
  availableManagers: User[];
  fieldPrefix?: string;
};

export function UserFormFields({
  formData,
  onChange,
  availableManagers,
  fieldPrefix = "user",
}: UserFormFieldsProps) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor={`${fieldPrefix}-name`}>Name</Label>
        <Input
          id={`${fieldPrefix}-name`}
          placeholder="Jane Cooper"
          value={formData.name}
          onChange={event => onChange({ name: event.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${fieldPrefix}-email`}>Email</Label>
        <Input
          id={`${fieldPrefix}-email`}
          placeholder="jane.cooper@example.com"
          type="email"
          value={formData.email}
          onChange={event => onChange({ email: event.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label>Role</Label>
        <Select
          value={formData.role}
          onValueChange={value =>
            onChange({
              role: value as UserRole,
              managerId: value === "employee" ? formData.managerId : "",
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.role === "employee" && (
        <div className="grid gap-2">
          <Label>Manager</Label>
          <Select
            value={formData.managerId || undefined}
            onValueChange={value => onChange({ managerId: value })}
            disabled={availableManagers.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  availableManagers.length === 0
                    ? "No managers available"
                    : "Select a manager"
                }
              />
            </SelectTrigger>
            <SelectContent align="start">
              {availableManagers.map(manager => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}

