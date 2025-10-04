import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Plus, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/admin/users')({
  component: RouteComponent,
})

type UserRole = 'admin' | 'manager' | 'employee'

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  managerId: string | null
}

type NewUserForm = {
  name: string
  email: string
  role: UserRole
  managerId: string
}

const initialUsers: User[] = [
  {
    id: 'u-101',
    name: 'Olivia Rhye',
    email: 'olivia.rhye@example.com',
    role: 'admin',
    managerId: null,
  },
  {
    id: 'u-102',
    name: 'Phoenix Baker',
    email: 'phoenix.baker@example.com',
    role: 'manager',
    managerId: null,
  },
  {
    id: 'u-103',
    name: 'Lana Steiner',
    email: 'lana.steiner@example.com',
    role: 'employee',
    managerId: 'u-102',
  },
  {
    id: 'u-104',
    name: 'Demi Wilkinson',
    email: 'demi.wilkinson@example.com',
    role: 'employee',
    managerId: 'u-102',
  },
]

function RouteComponent() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [confirmUserId, setConfirmUserId] = useState<string | null>(null)
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: '',
    email: '',
    role: 'employee',
    managerId: '',
  })

  const availableManagers = useMemo(
    () => users.filter((user) => user.role === 'manager'),
    [users],
  )

  const userPendingPassword = confirmUserId
    ? users.find((user) => user.id === confirmUserId)
    : null

  const handleRoleChange = (userId: string, role: UserRole) => {
    setUsers((prev) => {
      const updatedUsers = prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              role,
              managerId: role === 'employee' ? user.managerId : null,
            }
          : user,
      )

      if (role === 'manager') {
        return updatedUsers
      }

      return updatedUsers.map((user) =>
        user.managerId === userId
          ? {
              ...user,
              managerId: null,
            }
          : user,
      )
    })
  }

  const handleManagerChange = (userId: string, managerId: string | null) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              managerId,
            }
          : user,
      ),
    )
  }

  const handleEmailChange = (userId: string, email: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              email,
            }
          : user,
      ),
    )
  }

  const resetNewUserForm = () => {
    setNewUserForm({ name: '', email: '', role: 'employee', managerId: '' })
  }

  const handleAddUser = () => {
    const trimmedName = newUserForm.name.trim()
    const trimmedEmail = newUserForm.email.trim()

    if (!trimmedName || !trimmedEmail) {
      return
    }

    const roleIsEmployee = newUserForm.role === 'employee'
    const managerId = roleIsEmployee ? newUserForm.managerId || null : null

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      role: newUserForm.role,
      managerId,
    }

    setUsers((prev) => [...prev, newUser])
    setIsAddOpen(false)
    resetNewUserForm()
  }

  const confirmSendDisabled = !userPendingPassword

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Users</h1>
            <p className="mt-2 text-muted-foreground">
              Manage roles, reporting lines, and credentials for your team members.
            </p>
          </div>

          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open)
            if (!open) {
              resetNewUserForm()
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 self-start sm:self-auto">
                <Plus className="h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add a new team member</DialogTitle>
                <DialogDescription>
                  Capture the basics so you can send credentials right away.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-user-name">Name</Label>
                  <Input
                    id="new-user-name"
                    placeholder="Jane Cooper"
                    value={newUserForm.name}
                    onChange={(event) =>
                      setNewUserForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-user-email">Email</Label>
                  <Input
                    id="new-user-email"
                    placeholder="jane.cooper@example.com"
                    type="email"
                    value={newUserForm.email}
                    onChange={(event) =>
                      setNewUserForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select
                    value={newUserForm.role}
                    onValueChange={(value) =>
                      setNewUserForm((prev) => ({
                        ...prev,
                        role: value as UserRole,
                        managerId: value === 'employee' ? prev.managerId : '',
                      }))
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
                {newUserForm.role === 'employee' && (
                  <div className="grid gap-2">
                    <Label>Manager</Label>
                    <Select
                      value={newUserForm.managerId || undefined}
                      onValueChange={(value) =>
                        setNewUserForm((prev) => ({ ...prev, managerId: value }))
                      }
                      disabled={availableManagers.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          availableManagers.length === 0
                            ? 'No managers available'
                            : 'Select a manager'
                        } />
                      </SelectTrigger>
                      <SelectContent align="start">
                        {availableManagers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddOpen(false)
                    resetNewUserForm()
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[220px]">User</TableHead>
                <TableHead className="w-[160px]">Role</TableHead>
                <TableHead className="w-[220px]">Manager</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[160px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isEmployee = user.role === 'employee'
                const managerDisabled = !isEmployee || availableManagers.length === 0
                const selectedManager = user.managerId ?? 'none'

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="start">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={selectedManager}
                        onValueChange={(value) =>
                          handleManagerChange(user.id, value === 'none' ? null : value)
                        }
                        disabled={managerDisabled}
                      >
                        <SelectTrigger className="w-[200px]" disabled={managerDisabled}>
                          <SelectValue placeholder="Assign manager" />
                        </SelectTrigger>
                        <SelectContent align="start">
                          <SelectItem value="none">No manager</SelectItem>
                          {availableManagers.map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={user.email}
                        onChange={(event) => handleEmailChange(user.id, event.target.value)}
                        className="w-full"
                        type="email"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setConfirmUserId(user.id)}
                      >
                        <Send className="h-4 w-4" />
                        Send Password
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={Boolean(confirmUserId)} onOpenChange={(open) => !open && setConfirmUserId(null)}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Share password?</DialogTitle>
            <DialogDescription>
              {userPendingPassword
                ? `We will email a temporary password to ${userPendingPassword.email}.`
                : 'We will email a temporary password to the selected user.'}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action will send a reset link and temporary password to the user. Make sure the
            email address is correct before continuing.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmUserId(null)}>
              Cancel
            </Button>
            <Button disabled={confirmSendDisabled} onClick={() => setConfirmUserId(null)}>
              Yes, send it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
