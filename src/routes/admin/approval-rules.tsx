"use client";
import { createFileRoute } from "@tanstack/react-router";

import { useMemo, useState } from "react";
import type { ApprovalRule, RuleType } from "../../components/admin/types";
import { RuleCard } from "../../components/admin/RuleCard";
import { ApprovalRuleForm } from "../../components/admin/ApprovalRuleForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { getApprovalRulesQuery } from "@/lib/queries/approval-rules";
import { getManagersQuery } from "@/lib/queries/getManagers";
import { getCategoriesQuery } from "@/lib/queries/getCategories";
import { useQuery } from "@tanstack/react-query";
import {
  useAddApprovalRule,
  useUpdateApprovalRule,
  useDeleteApprovalRule,
} from "@/lib/mutations/approval-rules";

export const Route = createFileRoute("/admin/approval-rules")({
  component: ApprovalRules,
});

function ApprovalRules() {
  // const { toast } = useToast()

  const { data: rules = [], isLoading: rulesLoading } = useQuery(
    getApprovalRulesQuery
  );
  const { data: managers = [], isLoading: managersLoading } =
    useQuery(getManagersQuery);
  const { data: categories = [], isLoading: categoriesLoading } =
    useQuery(getCategoriesQuery);
  const addRuleMutation = useAddApprovalRule();
  const updateRuleMutation = useUpdateApprovalRule();
  const deleteRuleMutation = useDeleteApprovalRule();

  const isLoading = rulesLoading || managersLoading || categoriesLoading;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ApprovalRule>>({
    ruleType: "sequential",
    isManagerFirst: true,
    steps: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | RuleType>("all");

  const [pendingDelete, setPendingDelete] = useState<ApprovalRule | null>(null);

  const handleAdd = () => {
    setForm({
      ruleType: "sequential",
      isManagerFirst: true,
      steps: [],
      name: "",
      description: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (rule: ApprovalRule) => {
    setForm({ ...rule });
    setEditingId(rule.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name) return;

    if (editingId) {
      updateRuleMutation.mutate(
        { ...form, id: editingId } as unknown as Parameters<
          typeof updateRuleMutation.mutate
        >[0],
        {
          onSuccess: () => {
            setShowForm(false);
            setForm({});
            setEditingId(null);
            // toast success
          },
        }
      );
    } else {
      addRuleMutation.mutate(
        form as unknown as Parameters<typeof addRuleMutation.mutate>[0],
        {
          onSuccess: () => {
            setShowForm(false);
            setForm({});
            setEditingId(null);
            // toast success
          },
        }
      );
    }
  };

  const handleDelete = (rule: ApprovalRule) => {
    setPendingDelete(rule);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteRuleMutation.mutate(
      { id: pendingDelete.id } as unknown as Parameters<
        typeof deleteRuleMutation.mutate
      >[0],
      {
        onSuccess: () => {
          setPendingDelete(null);
          // toast success
        },
      }
    );
  };

  const addStep = () => {
    const steps = form.steps || [];
    setForm({
      ...form,
      steps: [...steps, { approverId: "", stepOrder: steps.length + 1 }],
    });
  };

  const filtered = useMemo(() => {
    let res = rules;
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      res = res.filter(
        (r) =>
          r.name.toLowerCase().includes(t) ||
          (r.description || "").toLowerCase().includes(t)
      );
    }
    if (typeFilter !== "all") {
      res = res.filter((r) => r.ruleType === typeFilter);
    }
    return res;
  }, [rules, q, typeFilter]);

  return (
    <main className="container mx-auto max-w-6xl p-6">
      <header className="mb-6">
        <h1 className="text-balance text-3xl font-bold">Approval Rules</h1>
        <p className="text-muted-foreground">
          Define flexible multi-level approval logic for expenses. Use
          sequences, percentages, specific approvers, or hybrid combinations.
        </p>
      </header>

      <section className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search by name or description"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search approval rules"
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}
          >
            <SelectTrigger className="w-48" aria-label="Filter by rule type">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sequential">Sequential</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="specific_approver">
                Specific Approver
              </SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Add Rule
        </Button>
      </section>

      <section className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Total: {rules.length}</Badge>
        {typeFilter !== "all" && (
          <Badge variant="outline">Type: {typeFilter.replace("_", " ")}</Badge>
        )}
        {q && <Badge variant="outline">Search: {q}</Badge>}
        {isLoading && <Badge variant="outline">Loading...</Badge>}
      </section>

      <Separator className="mb-6" />

      {isLoading ? (
        <div className="grid place-items-center rounded-lg border bg-muted/30 p-10 text-center">
          <div>
            <h3 className="text-lg font-semibold">Loading approval rules...</h3>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="grid place-items-center rounded-lg border bg-muted/30 p-10 text-center">
          <div>
            <h3 className="text-lg font-semibold">No rules found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or create a new rule.
            </p>
            <div className="mt-4">
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Create your first rule
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule as ApprovalRule}
              users={managers}
              categories={categories as any}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ApprovalRuleForm
        open={showForm}
        onOpenChange={setShowForm}
        editingId={editingId}
        form={form}
        setForm={setForm}
        users={managers}
        categories={categories as any}
        onSave={handleSave}
        onAddStep={addStep}
      />

      <AlertDialog open={!!pendingDelete} onOpenChange={(o: any) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this rule?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The rule{" "}
            <span className="font-medium">{pendingDelete?.name}</span> will be
            permanently removed.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
