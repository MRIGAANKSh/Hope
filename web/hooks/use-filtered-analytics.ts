// hooks/use-filtered-analytics.ts
"use client"

import { useMemo } from "react"
import type { Report } from "@/lib/types"
import type { AnalyticsFilters } from "@/components/analytics/analytics-filters"

export function useFilteredAnalytics(reports: Report[] = [], filters: AnalyticsFilters) {
  return useMemo(() => {
    return reports.filter((report) => {
      // Date range filter
      try {
        if (filters.dateRange && filters.dateRange !== "all") {
          const now = new Date()
          const reportDate = typeof report.createdAt?.toDate === "function" ? report.createdAt.toDate() : report.createdAt instanceof Date ? report.createdAt : new Date(report.createdAt)

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
            case "quarter": {
              const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
              if (reportDate < quarterStart) return false
              break
            }
            case "year": {
              const yearStart = new Date(now.getFullYear(), 0, 1)
              if (reportDate < yearStart) return false
              break
            }
            default:
              break
          }
        }
      } catch {
        // if date parsing fails, exclude the report (safe)
        return false
      }

      // Issue type filter
      if (filters.issueType && filters.issueType !== "all" && (report.issueType || "other") !== filters.issueType) return false

      // Status filter
      if (filters.status && filters.status !== "all" && (report.status || "unknown") !== filters.status) return false

      // Department filter (some reports use assignedDept or department)
      const dept = (report as any).assignedDept ?? (report as any).department ?? ""
      if (filters.department && filters.department !== "all" && dept !== filters.department) return false

      return true
    })
  }, [reports, filters])
}
