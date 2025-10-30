"use client"

import { useMemo } from "react"
import type { Report } from "@/lib/types"
import type { MapFilters } from "@/components/map/map-filters"

export function useFilteredMapReports(reports: Report[], filters: MapFilters) {
  return useMemo(() => {
    return reports.filter((report) => {
      // Only include reports with location data
      if (!report.location) return false

      // Issue type filter
      if (filters.issueType && filters.issueType !== "all" && report.issueType !== filters.issueType) {
        return false
      }

      // Status filter
      if (filters.status && filters.status !== "all" && report.status !== filters.status) {
        return false
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange !== "all") {
        const now = new Date()
        const reportDate = report.createdAt.toDate()

        switch (filters.dateRange) {
          case "today":
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            if (reportDate < todayStart) return false
            break
          case "week":
            const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            if (reportDate < weekStart) return false
            break
          case "month":
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            if (reportDate < monthStart) return false
            break
        }
      }

      return true
    })
  }, [reports, filters])
}
