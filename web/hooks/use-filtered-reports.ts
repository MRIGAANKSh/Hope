"use client"

import { useMemo } from "react"
import type { Report } from "@/lib/types"
import type { ReportsFilters } from "@/components/reports/reports-filters"

export function useFilteredReports(reports: Report[], filters: ReportsFilters) {
  return useMemo(() => {
    // normalize search term once
    const searchTerm = (filters.search || "").toLowerCase().trim()

    return reports.filter((report) => {
      // --- Search filter ---
      if (searchTerm) {
        const description = (report.description || "").toString().toLowerCase()
        const issueLabel = (report.issueLabel || "").toString().toLowerCase()
        const customIssue = (report.customIssue || "").toString().toLowerCase()

        const matchesSearch =
          description.includes(searchTerm) ||
          issueLabel.includes(searchTerm) ||
          customIssue.includes(searchTerm)

        if (!matchesSearch) return false
      }

      // --- Issue type filter ---
      if (filters.issueType && report.issueType !== filters.issueType) {
        return false
      }

      // --- Status filter ---
      if (filters.status && report.status !== filters.status) {
        return false
      }

      // --- Department filter ---
      if (filters.assignedDept && report.assignedDept !== filters.assignedDept) {
        return false
      }

      // --- Date range filter ---
      if (filters.dateRange) {
        const now = new Date()

        // Try to get a Date object from report.createdAt safely.
        // Supports Firestore Timestamp (has toDate), Date, or numeric/timestamp string.
        let reportDate: Date | null = null
        try {
          if (report.createdAt && typeof (report.createdAt as any).toDate === "function") {
            reportDate = (report.createdAt as any).toDate()
          } else if (report.createdAt instanceof Date) {
            reportDate = report.createdAt
          } else if (typeof report.createdAt === "number") {
            reportDate = new Date(report.createdAt)
          } else if (typeof report.createdAt === "string") {
            const parsed = Date.parse(report.createdAt)
            if (!isNaN(parsed)) reportDate = new Date(parsed)
          }
        } catch {
          reportDate = null
        }

        // If we can't determine the report date, treat it as not matching the date filter
        if (!reportDate) return false

        switch (filters.dateRange) {
          case "today": {
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            if (reportDate < todayStart) return false
            break
          }
          case "week": {
            const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            if (reportDate < weekStart) return false
            break
          }
          case "month": {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            if (reportDate < monthStart) return false
            break
          }
        }
      }

      return true
    })
  }, [reports, filters])
}
