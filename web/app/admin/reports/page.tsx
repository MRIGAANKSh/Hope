"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AdminLayout } from "@/components/layout/admin-layout"
import { ReportsFilters, type ReportsFilters as FiltersType } from "@/components/reports/reports-filters"
import { ReportsTable } from "@/components/reports/reports-table"
import { ReportDetailModal } from "@/components/reports/report-detail-modal"
import { useReports } from "@/hooks/use-reports"
import { useFilteredReports } from "@/hooks/use-filtered-reports"
import type { Report } from "@/lib/types"

const initialFilters: FiltersType = {
  search: "",
  issueType: "",
  status: "",
  assignedDept: "",
  dateRange: "",
}

export default function ReportsPage() {
  const [filters, setFilters] = useState<FiltersType>(initialFilters)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { reports, loading } = useReports()
  const filteredReports = useFilteredReports(reports, filters)
  const searchParams = useSearchParams()

  // Handle URL filter parameters
  useEffect(() => {
    const urlFilter = searchParams.get("filter")
    if (urlFilter) {
      switch (urlFilter) {
        case "unresolved":
          setFilters((prev) => ({ ...prev, status: "submitted" }))
          break
        case "today":
          setFilters((prev) => ({ ...prev, dateRange: "today" }))
          break
        case "all":
          setFilters(initialFilters)
          break
      }
    }
  }, [searchParams])

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports Management</h1>
          <p className="text-muted-foreground">
            View and manage all submitted reports. Total: {filteredReports.length} of {reports.length}
          </p>
        </div>

        <ReportsFilters filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />

        <ReportsTable reports={filteredReports} onViewReport={handleViewReport} loading={loading} />

        <ReportDetailModal report={selectedReport} open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </AdminLayout>
  )
}
