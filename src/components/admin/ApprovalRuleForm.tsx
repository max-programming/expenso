"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { ApprovalRule, Category, RuleType, User } from "./types"
import { StepEditor } from "./StepEditor"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  editingId: string | null
  form: Partial<ApprovalRule>
  setForm: (f: Partial<ApprovalRule>) => void
  users: User[]
  categories: Category[]
  onSave: () => void
  onAddStep: () => void
}

export function ApprovalRuleForm({
  open,
  onOpenChange,
  editingId,
  form,
  setForm,
  users,
  categories,
  onSave,
  onAddStep,
}: Props) {
  const title = editingId ? "Edit Rule" : "Add New Rule"

  const needsPercentage = form.ruleType === "percentage" || form.ruleType === "hybrid"
  const needsSpecificApprover = form.ruleType === "specific_approver" || form.ruleType === "hybrid"
  const needsSteps = form.ruleType === "sequential" || form.ruleType === "hybrid"

  const isValid = useMemo(() => {
    if (!form.name || !form.ruleType) return false
    if (needsPercentage && !form.approvalPercentage) return false
    if (needsSpecificApprover && !form.specificApproverId) return false
    if (needsSteps && !(form.steps && form.steps.length > 0)) return false
    return true
  }, [form, needsPercentage, needsSpecificApprover, needsSteps])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-pretty">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <section className="space-y-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Default Sequential Rule"
                />
              </div>

              <div>
                <Label htmlFor="category">Specific Category</Label>
                <Select
                  value={form.specificCategoryId ? form.specificCategoryId : "all"}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      specificCategoryId: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe when and how this rule should be applied..."
                  className="min-h-20"
                />
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="ruleType">Rule Type</Label>
                <Select
                  value={form.ruleType || "sequential"}
                  onValueChange={(value) => setForm({ ...form, ruleType: value as RuleType })}
                >
                  <SelectTrigger id="ruleType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="specific_approver">Specific Approver</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount Threshold</Label>
                <Input
                  id="amount"
                  type="number"
                  value={form.amount || ""}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Optional minimum amount"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <Checkbox
                  id="managerFirst"
                  checked={form.isManagerFirst || false}
                  onCheckedChange={(checked) => setForm({ ...form, isManagerFirst: checked as boolean })}
                />
                <Label htmlFor="managerFirst">Manager approves first</Label>
              </div>
            </div>

            {needsPercentage && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="percentage">Approval Percentage</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min={1}
                    max={100}
                    value={form.approvalPercentage?.toString() || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        approvalPercentage: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="e.g., 60"
                  />
                </div>
              </div>
            )}

            {needsSpecificApprover && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="specificApprover">Specific Approver</Label>
                  <Select
                    value={form.specificApproverId ? form.specificApproverId : "none"}
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        specificApproverId: value === "none" ? undefined : value,
                      })
                    }
                  >
                    <SelectTrigger id="specificApprover">
                      <SelectValue placeholder="Choose approver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select Approver</SelectItem>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {needsSteps && (
              <div className="space-y-2">
                <StepEditor
                  steps={form.steps || []}
                  users={users}
                  onChange={(updated) => setForm({ ...form, steps: updated })}
                />
                <Button type="button" variant="outline" onClick={onAddStep}>
                  Add Step
                </Button>
              </div>
            )}
          </section>

          <div className="flex items-center gap-2 pt-2">
            <Button onClick={onSave} disabled={!isValid}>
              Save Rule
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
