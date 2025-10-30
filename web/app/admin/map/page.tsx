"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { ReportMap } from "@/components/map/report-map"
import { MapFilters, type MapFilters as FiltersType } from "@/components/map/map-filters"
import { MapLegend } from "@/components/map/map-legend"
import { ReportDetailModal } from "@/components/reports/report-detail-modal"
import { useReports } from "@/hooks/use-reports"
import { useFilteredMapReports } from "@/hooks/use-filtered-map-reports"
import type { Report } from "@/lib/types"

const initialFilters: FiltersType = {
  issueType: "all",
  status: "all",
  dateRange: "all",
}

export default function MapPage() {
  const [filters, setFilters] = useState<FiltersType>(initialFilters)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { reports, loading } = useReports()
  const filteredReports = useFilteredMapReports(reports, filters)

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

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
          <h1 className="text-3xl font-bold">Map View</h1>
          <p className="text-muted-foreground">Geographical visualization of all reports with location data</p>
        </div>

        <MapFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          reportCount={filteredReports.length}
        />

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <ReportMap reports={filteredReports} onViewReport={handleViewReport} height="600px" />
          </div>
          <div>
            <MapLegend />
          </div>
        </div>

        <ReportDetailModal report={selectedReport} open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </AdminLayout>
  )
}
