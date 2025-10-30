"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./status-badge";
import { IssueTypeBadge } from "./issue-type-badge";
import type { Report, StatusHistoryEntry } from "@/lib/types";
import { useReportActions } from "@/hooks/use-report-actions";
import { useAuth } from "@/hooks/use-auth";

function toDateSafe(ts: any): Date | null {
  if (!ts && ts !== 0) return null;
  if (typeof ts.toDate === "function") {
    try {
      return ts.toDate();
    } catch {}
  }
  if (ts instanceof Date) return ts;
  if (typeof ts === "number") return new Date(ts);
  return null;
}

interface ReportDetailModalProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportDetailModal({ report, open, onOpenChange }: ReportDetailModalProps) {
  const [classification, setClassification] = useState("");
  const [classificationNote, setClassificationNote] = useState("");
  const [assignedDept, setAssignedDept] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [reporterName, setReporterName] = useState<string | null>(null);
  const [reporterLoading, setReporterLoading] = useState(false);
  const [supervisors, setSupervisors] = useState<{ id: string; name: string; email: string }[]>([]);
  const [loadingSupervisors, setLoadingSupervisors] = useState(false);

  const { updateReportAssignment } = useReportActions();
  const { currentUser } = useAuth();

  // Reset fields when a new report opens
  useEffect(() => {
    setClassification("");
    setClassificationNote("");
    setAssignedDept("");
    setAssignedTo("");
    setStatus("");
  }, [report]);

  // Fetch supervisors from Firestore
  useEffect(() => {
    if (!open) return;

    const fetchSupervisors = async () => {
      setLoadingSupervisors(true);
      try {
        const q = query(collection(db, "users"), where("role", "==", "supervisor"));
        const snapshot = await getDocs(q);
        const supervisorList = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || data.displayName || data.fullName || data.email || "Unnamed",
            email: data.email || "",
          };
        });
        setSupervisors(supervisorList);
      } catch (error) {
        console.error("Error fetching supervisors:", error);
        setSupervisors([]);
      } finally {
        setLoadingSupervisors(false);
      }
    };

    fetchSupervisors();
  }, [open]);

  // Fetch reporter details
  useEffect(() => {
    if (!report?.uid) return;
    async function fetchReporter() {
      setReporterLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", report.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const name =
            (data as any).name ?? (data as any).displayName ?? (data as any).fullName ?? null;
          setReporterName(name);
        }
      } catch {
        setReporterName(null);
      } finally {
        setReporterLoading(false);
      }
    }
    fetchReporter();
  }, [report?.uid]);

  if (!open || !report) return null;

  const handleAssignmentUpdate = async () => {
    if (!assignedTo) return;
    setIsUpdating(true);
    try {
      await updateReportAssignment(
        report.id,
        assignedDept || "general",
        assignedTo,
        currentUser?.name || "Admin"
      );

      alert(`✅ Report assigned to ${assignedTo}`);
      setAssignedTo("");

      // 🔄 Refresh UI
      report.assignedTo = assignedTo;
    } catch (err) {
      console.error("Assignment failed:", err);
      alert("❌ Failed to assign supervisor. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const statusHistory: StatusHistoryEntry[] = Array.isArray(report.statusHistory)
    ? report.statusHistory
    : [];
  const createdAtDate = toDateSafe(report.createdAt);
  const createdAtText = createdAtDate ? format(createdAtDate, "MMMM dd, yyyy 'at' HH:mm") : "Unknown";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-xl shadow-xl w-[95vw] max-w-[1200px] h-[90vh] flex flex-col overflow-hidden z-[10000]">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Report Details</h3>
            <StatusBadge status={report.status} />
          </div>
          <div className="text-sm text-muted-foreground">{createdAtText}</div>
        </header>

        <main className="flex flex-1 overflow-hidden p-4 gap-4">
          {/* Left Column */}
          <div className="w-3/5 overflow-y-auto pr-2">
            <section className="mb-4">
              <h4 className="font-semibold">Report Information</h4>
              <div className="mt-2 space-y-3">
                <div className="flex gap-2 items-center">
                  <IssueTypeBadge issueType={report.issueType} />
                  {report.classification && (
                    <Badge variant="secondary">{report.classification}</Badge>
                  )}
                </div>
                <div>
                  <Label>Issue</Label>
                  <div className="mt-1">{report.issueLabel}</div>
                </div>
                <div>
                  <Label>Description</Label>
                  <div className="mt-1 whitespace-pre-wrap">{report.description}</div>
                </div>
                <div>
                  <Label>Reporter</Label>
                  <div className="mt-1">
                    {reporterLoading ? "Loading…" : reporterName ?? report.uid}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="w-2/5 border-l pl-4 overflow-y-auto">
            {/* Current Assignment */}
            <section className="mb-3">
              <h4 className="font-semibold">Current Assignment</h4>
              <div className="mt-2">
                <Label>Department</Label>
                <div className="mt-1">
                  {report.assignedDept ? (
                    <Badge variant="outline">{report.assignedDept}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </div>
                <Label className="mt-2 block">Supervisor Assigned</Label>
                <div className="mt-1">
                  {report.assignedTo ? (
                    <span>{report.assignedTo}</span>
                  ) : (
                    <span className="text-muted-foreground">No supervisor assigned</span>
                  )}
                </div>
              </div>
            </section>

            <Separator />

            {/* --- Admin Assigns Supervisor --- */}
            <section style={{ marginTop: 12 }}>
              <h4 style={{ margin: 0, fontWeight: 600 }}>Assign to Supervisor</h4>

              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                <Select
                  value={assignedTo}
                  onValueChange={(v) => setAssignedTo(v)}
                  disabled={loadingSupervisors}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingSupervisors
                          ? "Loading supervisors..."
                          : "Select supervisor"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {supervisors.length > 0 ? (
                      supervisors.map((sup) => (
                        <SelectItem key={sup.id} value={sup.email}>
                          {sup.name} ({sup.email})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="none">
                        No supervisors available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleAssignmentUpdate}
                  disabled={!assignedTo || isUpdating}
                >
                  {isUpdating ? "Assigning..." : "Assign to Supervisor"}
                </Button>
              </div>
            </section>

            <Separator className="my-3" />

            {/* Status / Assignment History */}
            <section>
              <h4 className="font-semibold">Status & Assignment History</h4>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                {statusHistory.length > 0 ? (
                  statusHistory.map((entry, idx) => {
                    const changedAtText = entry.changedAt
                      ? format(toDateSafe(entry.changedAt)!, "MMM dd, HH:mm")
                      : "Unknown";
                    return (
                      <div key={idx} className="p-2 bg-slate-50 rounded-md">
                        <div className="flex justify-between">
                          <div>
                            {entry.kind === "assignment"
                              ? `Admin assigned to ${entry.supervisor} (${entry.dept})`
                              : `Status changed to ${entry.status}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {changedAtText}
                          </div>
                        </div>
                        {entry.note && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {entry.note}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          by {entry.changedBy}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No history for this report.
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
