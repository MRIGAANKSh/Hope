"use client"

import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./use-auth"

export function useReportActions() {
  const { user } = useAuth()

  const updateReportStatus = async (reportId: string, status: string, note?: string) => {
    if (!user) throw new Error("User not authenticated")

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

  const updateReportAssignment = async (reportId: string, assignedDept?: string, assignedTo?: string) => {
    if (!user) throw new Error("User not authenticated")

    const reportRef = doc(db, "reports", reportId)

    const updateData: any = {
      updatedAt: serverTimestamp(),
    }

    if (assignedDept !== undefined) {
      updateData.assignedDept = assignedDept
    }

    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo
    }

    await updateDoc(reportRef, updateData)
  }

  const updateReportClassification = async (reportId: string, classification: string, note?: string) => {
    if (!user) throw new Error("User not authenticated")

    const reportRef = doc(db, "reports", reportId)

    const classificationEntry = {
      kind: "classification",
      classification,
      changedBy: user.uid,
      changedAt: serverTimestamp(),
      note: note || "",
    }

    await updateDoc(reportRef, {
      classification,
      classificationNote: note || "",
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion(classificationEntry),
    })
  }

  return {
    updateReportStatus,
    updateReportAssignment,
    updateReportClassification,
  }
}
