// hooks/use-reports.ts
"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Report } from "@/lib/types"

export function useReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const reportsQuery = query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(100))

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        const reportsData = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
          } as Report
        })

        setReports(reportsData)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching reports:", err)
        setError(err.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  return { reports, loading, error }
}

export function useReportStats(reports: Report[]) {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const stats = {
    total: reports.length,
    open: reports.filter((r) => r.status !== "resolved").length,
    last7Days: reports.filter((r) => {
      try {
        const createdAt = typeof r.createdAt?.toDate === "function" ? r.createdAt.toDate() : r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt)
        return createdAt >= sevenDaysAgo
      } catch {
        return false
      }
    }).length,
    today: reports.filter((r) => {
      try {
        const createdAt = typeof r.createdAt?.toDate === "function" ? r.createdAt.toDate() : r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt)
        return createdAt >= todayStart
      } catch {
        return false
      }
    }).length,
    avgResolutionTime: calculateAvgResolutionTime(reports),
  }

  return stats
}

function calculateAvgResolutionTime(reports: Report[]): number {
  const resolvedReports = reports.filter((r) => r.status === "resolved")
  if (resolvedReports.length === 0) return 0

  const totalTime = resolvedReports.reduce((acc, report) => {
    const resolvedEntry = Array.isArray(report.statusHistory) ? report.statusHistory.find((entry) => entry.status === "resolved") : undefined
    if (resolvedEntry) {
      try {
        const createdTime = typeof report.createdAt?.toMillis === "function" ? report.createdAt.toMillis() : report.createdAt instanceof Date ? report.createdAt.getTime() : Number(report.createdAt)
        const resolvedTime = typeof resolvedEntry.changedAt?.toMillis === "function" ? resolvedEntry.changedAt.toMillis() : resolvedEntry.changedAt instanceof Date ? resolvedEntry.changedAt.getTime() : Number(resolvedEntry.changedAt)
        if (!Number.isFinite(createdTime) || !Number.isFinite(resolvedTime)) return acc
        return acc + (resolvedTime - createdTime)
      } catch {
        return acc
      }
    }
    return acc
  }, 0)

  return Math.round(totalTime / resolvedReports.length / (1000 * 60 * 60))
}
