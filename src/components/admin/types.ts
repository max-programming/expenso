export type RuleType = "sequential" | "percentage" | "specific_approver" | "hybrid"

export type ApprovalStep = {
  approverId: string
  stepOrder: number
}

import type { ExpenseCategoriesId } from "@/lib/id";

export type ApprovalRule = {
  id: string
  name: string
  description?: string
  specificCategoryId?: ExpenseCategoriesId
  ruleType: RuleType
  isManagerFirst: boolean
  approvalPercentage?: number
  specificApproverId?: string
  steps: ApprovalStep[]
}

export type User = { id: string; name: string; email?: string }
export type Category = { id: ExpenseCategoriesId; name: string; description?: string }
