"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { StatusDistributionChart } from "@/components/analytics/status-distribution-chart"
import { IssueTypeChart } from "@/components/analytics/issue-type-chart"
import { ResolutionTimeChart } from "@/components/analytics/resolution-time-chart"
import { TopLocations } from "@/components/analytics/top-locations"
import { AnalyticsFilters, type AnalyticsFilters as FiltersType } from "@/components/analytics/analytics-filters"
import { ReportsChart } from "@/components/dashboard/reports-chart"
import { KPICard } from "@/components/dashboard/kpi-card"
import { useReports } from "@/hooks/use-reports"
import { useFilteredAnalytics } from "@/hooks/use-filtered-analytics"
import { exportReportsToCSV } from "@/utils/csv-export"
import { BarChart3, TrendingUp, Clock, MapPin } from "lucide-react"

const initialFilters: FiltersType = {
  dateRange: "all",
  issueType: "all",
  status: "all",
  department: "all",
}

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<FiltersType>(initialFilters)
  const { reports, loading } = useReports()
  const filteredReports = useFilteredAnalytics(reports, filters)
   // --- DEBUG LOGS (temporary) ---
  console.log("=== ANALYTICS DEBUG ===")
  console.log("total reports from hook:", Array.isArray(reports) ? reports.length : "not-array")
  console.log("filteredReports:", Array.isArray(filteredReports) ? filteredReports.length : "not-array")
  console.log(
    "resolved in filtered:",
    Array.isArray(filteredReports) ? filteredReports.filter((r) => r.status === "resolved").length : "n/a"
  )

  if (Array.isArray(reports) && reports.length > 0) {
    const s = reports[0]
    console.log("SAMPLE report keys:", Object.keys(s))
    console.log(
      "SAMPLE createdAt:",
      s.createdAt,
      "toDate?",
      typeof s.createdAt?.toDate,
      "toMillis?",
      typeof s.createdAt?.toMillis
    )
    console.log("SAMPLE statusHistory:", s.statusHistory && s.statusHistory.slice && s.statusHistory.slice(0, 3))
  }
  // --- END DEBUG ---

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const handleExportCSV = () => {
    exportReportsToCSV(filteredReports, `analytics-export-${new Date().toISOString().split("T")[0]}.csv`)
  }

  // Calculate analytics metrics
  const totalReports = filteredReports.length
  const resolvedReports = filteredReports.filter((r) => r.status === "resolved").length
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0

  const avgResolutionTime =
    resolvedReports > 0
      ? Math.round(
          filteredReports
            .filter((r) => r.status === "resolved")
            .reduce((acc, report) => {
              const resolvedEntry = report.statusHistory.find((entry) => entry.status === "resolved")
              if (resolvedEntry) {
                return acc + (resolvedEntry.changedAt.toMillis() - report.createdAt.toMillis()) / (1000 * 60 * 60)
              }
              return acc
            }, 0) / resolvedReports,
        )
      : 0

  const reportsWithLocation = filteredReports.filter((r) => r.location).length

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights for report management</p>
        </div>

        <AnalyticsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          onExportCSV={handleExportCSV}
          reportCount={filteredReports.length}
        />

        {/* Analytics KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard title="Total Reports" value={totalReports} description="In selected period" icon={BarChart3} />
          <KPICard
            title="Resolution Rate"
            value={`${resolutionRate}%`}
            description={`${resolvedReports} of ${totalReports} resolved`}
            icon={TrendingUp}
          />
          <KPICard
            title="Avg Resolution Time"
            value={`${avgResolutionTime}h`}
            description="Hours to resolve"
            icon={Clock}
          />
          <KPICard
            title="Geo-tagged Reports"
            value={reportsWithLocation}
            description={`${Math.round((reportsWithLocation / totalReports) * 100)}% have location`}
            icon={MapPin}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <StatusDistributionChart reports={filteredReports} />
          <IssueTypeChart reports={filteredReports} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ResolutionTimeChart reports={filteredReports} />
          </div>
          <div>
            <TopLocations reports={filteredReports} />
          </div>
        </div>

        {/* Time Series */}
        <div className="grid gap-6 lg:grid-cols-2">
               <ReportsChart reports={filteredReports} days={90} />
        </div>
      </div>
    </AdminLayout>
  )
}
