"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"

export interface ReportsFilters {
  search: string
  issueType: string
  status: string
  assignedDept: string
  dateRange: string
}

interface ReportsFiltersProps {
  filters: ReportsFilters
  onFiltersChange: (filters: ReportsFilters) => void
  onClearFilters: () => void
}

export function ReportsFilters({ filters, onFiltersChange, onClearFilters }: ReportsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof ReportsFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Filter className="h-4 w-4 text-slate-700" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-slate-700">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-slate-700">
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search - Always visible */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm text-slate-700">Search</Label>
          <Input
            id="search"
            placeholder="Search reports by description..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="placeholder:text-slate-400 text-slate-800"
          />
        </div>

        {/* Expandable filters */}
        {isExpanded && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-slate-700">Issue Type</Label>
                <Select value={filters.issueType} onValueChange={(value) => updateFilter("issueType", value)}>
                  <SelectTrigger className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-800 placeholder:text-slate-400" />
                  <SelectValue placeholder="All types" className="text-slate-700" />
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="road">Road</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="sanitation">Sanitation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-700">Status</Label>
                <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                  <SelectTrigger className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-800 placeholder:text-slate-400" />
                  <SelectValue placeholder="All statuses" className="text-slate-700" />
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-700">Department</Label>
                <Select value={filters.assignedDept} onValueChange={(value) => updateFilter("assignedDept", value)}>
                  <SelectTrigger className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-800 placeholder:text-slate-400" />
                  <SelectValue placeholder="All departments" className="text-slate-700" />
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    <SelectItem value="water">Water Department</SelectItem>
                    <SelectItem value="roads">Roads Department</SelectItem>
                    <SelectItem value="electricity">Electricity Department</SelectItem>
                    <SelectItem value="sanitation">Sanitation Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-700">Date Range</Label>
                <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
                  <SelectTrigger className="w-full rounded-md border border-slate-200 px-3 py-2 bg-white text-slate-800 placeholder:text-slate-400" />
                  <SelectValue placeholder="All time" className="text-slate-700" />
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
