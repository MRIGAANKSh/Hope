"use client"

import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./use-auth"

export function useSupervisorActions() {
  const { user } = useAuth()

  const updateReportStatus = async (reportId: string, status: string, note?: string) => {
    if (!user || user.role !== "supervisor") {
      throw new Error("Unauthorized: Only supervisors can update report status")
    }

    const reportRef = doc(db, "reports", reportId)

    const statusEntry = {
      kind: "status",
      status,
      changedBy: user.uid,
      changedAt: serverTimestamp(),
      note: note || "",
    }

    await updateDoc(reportRef, {
      status,
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion(statusEntry),
    })
  }

  const addReportNote = async (reportId: string, note: string) => {
    if (!user || user.role !== "supervisor") {
      throw new Error("Unauthorized: Only supervisors can add notes")
    }

    const reportRef = doc(db, "reports", reportId)

    const noteEntry = {
      kind: "note",
      note,
      changedBy: user.uid,
      changedAt: serverTimestamp(),
    }

    await updateDoc(reportRef, {
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion(noteEntry),
    })
  }

  return {
    updateReportStatus,
    addReportNote,
  }
}
