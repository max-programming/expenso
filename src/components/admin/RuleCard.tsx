"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { ApprovalRule, Category, User } from "./types"
import { Pencil, Trash2, Workflow } from "lucide-react"

type Props = {
  rule: ApprovalRule
  users: User[]
  categories: Category[]
  onEdit: (rule: ApprovalRule) => void
  onDelete: (rule: ApprovalRule) => void
}

const ruleTypeLabel: Record<ApprovalRule["ruleType"], string> = {
  sequential: "Sequential",
  percentage: "Percentage",
  specific_approver: "Specific Approver",
  hybrid: "Hybrid",
}

export function RuleCard({ rule, users, categories, onEdit, onDelete }: Props) {
  const categoryName = rule.specificCategoryId
    ? categories.find((c) => c.id === rule.specificCategoryId)?.name
    : "All Categories"

  const specificApprover = rule.specificApproverId
    ? users.find((u) => u.id === rule.specificApproverId)?.name
    : undefined

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-pretty">{rule.name}</CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{ruleTypeLabel[rule.ruleType]}</Badge>
              <Badge variant="outline">Manager first: {rule.isManagerFirst ? "Yes" : "No"}</Badge>
              <Badge variant="outline">Category: {categoryName}</Badge>
              {rule.amount && <Badge variant="outline">Min: {rule.amount}</Badge>}
              {typeof rule.approvalPercentage === "number" && (
                <Badge variant="outline">{rule.approvalPercentage}% required</Badge>
              )}
              {specificApprover && <Badge variant="outline">Needs: {specificApprover}</Badge>}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(rule)}>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(rule)}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        {rule.description && <p className="text-sm text-muted-foreground">{rule.description}</p>}
      </CardHeader>
      <CardContent>
        {rule.steps.length > 0 ? (
          <div>
            <Label className="mb-2 inline-flex items-center gap-2 text-sm">
              <Workflow className="h-4 w-4" />
              Approval Steps
            </Label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {rule.steps.map((s) => {
                const n = users.find((u) => u.id === s.approverId)?.name || "Unknown"
                return (
                  <div
                    key={`${s.stepOrder}-${s.approverId}`}
                    className="inline-flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-xs"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                      {s.stepOrder}
                    </span>
                    <span className="text-foreground">{n}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No sequential steps configured.</p>
        )}
      </CardContent>
    </Card>
  )
}
