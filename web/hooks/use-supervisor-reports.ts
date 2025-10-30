"use client"

import { useState, useEffect } from "react"
import { collection, query, where, orderBy, onSnapshot, or } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "./use-auth"
import type { Report } from "@/lib/types"

export function useSupervisorReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user || user.role !== "supervisor" || !user.dept) {
      setLoading(false)
      return
    }

    try {
      const reportsQuery = query(
        collection(db, "reports"),
        or(
          where("assignedDept", "==", user.dept),
          where("assignedTo", "==", user.uid)
        ),
        orderBy("createdAt", "desc")
      )

      const unsubscribe = onSnapshot(
        reportsQuery,
        (snapshot) => {
          const reportsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Report[]
          setReports(reportsData)
          setLoading(false)
        },
        (err) => {
          console.error("Error fetching supervisor reports:", err)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (err: any) {
      console.error("Error building query:", err)
      setError(err.message)
      setLoading(false)
    }
  }, [user])

  return { reports, loading, error }
}

export function useSupervisorStats(reports: Report[]) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)

  const stats = {
    total: reports.length,
    open: reports.filter((r) => r.status !== "resolved").length,
    overdue: reports.filter((r) => {
      const createdAt = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt)
      return r.status !== "resolved" && createdAt < twoDaysAgo
    }).length,
    today: reports.filter((r) => {
      const createdAt = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt)
      return createdAt >= todayStart
    }).length,
    acknowledged: reports.filter((r) => r.status === "acknowledged").length,
    inProgress: reports.filter((r) => r.status === "in_progress").length,
  }

  return stats
}
