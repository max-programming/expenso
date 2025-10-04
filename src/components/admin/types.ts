export type RuleType = "sequential" | "percentage" | "specific_approver" | "hybrid"

export type ApprovalStep = {
  approverId: string
  stepOrder: number
}

export type ApprovalRule = {
  id: string
  name: string
  description?: string
  specificCategoryId?: string
  ruleType: RuleType
  isManagerFirst: boolean
  amount?: string
  approvalPercentage?: number
  specificApproverId?: string
  steps: ApprovalStep[]
}

export type User = { id: string; name: string }
export type Category = { id: string; name: string }
