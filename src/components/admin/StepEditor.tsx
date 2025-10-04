"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ApprovalStep, User } from "./types";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

type Props = {
  steps: ApprovalStep[];
  users: User[];
  onChange: (steps: ApprovalStep[]) => void;
  showSequence?: boolean;
};

export function StepEditor({
  steps,
  users,
  onChange,
  showSequence = true,
}: Props) {
  const move = (index: number, dir: "up" | "down") => {
    const next = [...steps];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    // normalize stepOrder
    const normalized = next.map((s, i) => ({ ...s, stepOrder: i + 1 }));
    onChange(normalized);
  };

  const remove = (index: number) => {
    const next = steps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, stepOrder: i + 1 }));
    onChange(next);
  };

  const updateApprover = (index: number, approverId: string) => {
    const next = [...steps];
    next[index] = { ...next[index], approverId };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm">
          {showSequence ? "Approval Steps" : "Approvers"}
        </Label>
      </div>
      <Separator />
      <div className="space-y-2">
        {steps.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {showSequence
              ? "No steps added yet. Add approvers in the sequence they should approve."
              : "No approvers added yet. Add approvers who can approve this expense."}
          </p>
        )}
        {steps.map((step, index) => {
          const name =
            users.find((u) => u.id === step.approverId)?.name ||
            "Select approver";
          return (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md border bg-card p-2"
            >
              {showSequence && (
                <div className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
                  Step {step.stepOrder}
                </div>
              )}
              <Select
                value={step.approverId || "none"}
                onValueChange={(val) =>
                  updateApprover(index, val === "none" ? "" : val)
                }
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select approver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select approver</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                {showSequence && (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => move(index, "up")}
                            aria-label="Move up"
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move step up</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => move(index, "down")}
                            aria-label="Move down"
                            disabled={index === steps.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move step down</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(index)}
                        aria-label={
                          showSequence ? "Remove step" : "Remove approver"
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showSequence ? "Remove step" : "Remove approver"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
