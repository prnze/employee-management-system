import { CheckSquare, Square, Play, X, RotateCcw, Trash2, Download } from "lucide-react";
import { useFx } from "@/lib/store";
import { runJob, cancelJob, downloadJob } from "@/lib/orchestrator";

export function BatchActions() {
  const jobs = useFx((s) => s.jobs);
  const selectedIds = useFx((s) => s.selectedIds);
  const selectAll = useFx((s) => s.selectAll);
  const clearSelection = useFx((s) => s.clearSelection);
  const removeJob = useFx((s) => s.removeJob);
  const clearCompleted = useFx((s) => s.clearCompleted);

  const selected = jobs.filter((j) => selectedIds.includes(j.id));
  const target = selected.length > 0 ? selected : jobs;
  const allSelected = selected.length === jobs.length && jobs.length > 0;

  const action = (label: string, icon: any, onClick: () => void, danger = false) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg glass px-2.5 py-1.5 text-[11px] hover-lift ${
        danger ? "text-destructive" : "text-foreground"
      }`}
      title={label}
    >
      {icon} {label}
    </button>
  );

  const Icon = ({ as: As, className = "h-3 w-3" }: { as: any; className?: string }) => <As className={className} />;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => (allSelected ? clearSelection() : selectAll())}
        className="inline-flex items-center gap-1.5 rounded-lg glass px-2.5 py-1.5 text-[11px] hover-lift"
        title={allSelected ? "Deselect all" : "Select all"}
      >
        {allSelected ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
        {selected.length > 0 ? `${selected.length} selected` : "Select all"}
      </button>

      {action(
        "Convert",
        <Icon as={Play} />,
        () => target.filter((j) => j.status === "queued" || j.status === "error").forEach(runJob),
      )}
      {action(
        "Retry failed",
        <Icon as={RotateCcw} />,
        () =>
          target
            .filter((j) => j.status === "error" && !j.needsBackend && j.sourceFile)
            .forEach((j) => runJob({ ...j, status: "queued", progress: 0, errorMessage: undefined })),
      )}
      {action("Cancel", <Icon as={X} />, () => target.filter((j) => j.status === "converting").forEach((j) => cancelJob(j.id)))}
      {action(
        "Download",
        <Icon as={Download} />,
        () => target.filter((j) => j.status === "done").forEach(downloadJob),
      )}
      {action(
        "Delete",
        <Icon as={Trash2} />,
        () => {
          if (!confirm(`Delete ${target.length} job(s)?`)) return;
          target.forEach((j) => removeJob(j.id));
          clearSelection();
        },
        true,
      )}
      {action("Clear completed", <Icon as={Trash2} />, clearCompleted)}
    </div>
  );
}
