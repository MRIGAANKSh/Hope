"use client"

import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "./status-badge"
import { IssueTypeBadge } from "./issue-type-badge"
import { Eye, MapPin, ImageIcon } from "lucide-react"
import type { Report } from "@/lib/types"

interface ReportsTableProps {
  reports: Report[]
  onViewReport: (report: Report) => void
  loading?: boolean
}

export function ReportsTable({ reports, onViewReport, loading }: ReportsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No reports found matching your criteria.</p>
      </div>
    )
  }

  // 🧠 Sort by priority: High → Medium → Low
  const priorityOrder = { high: 1, medium: 2, low: 3 }
  const sortedReports = [...reports].sort((a, b) => {
    return (priorityOrder[a.priority || "low"] ?? 3) - (priorityOrder[b.priority || "low"] ?? 3)
  })

  return (
    <div className="border rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-slate-800">Report</TableHead>
            <TableHead className="text-slate-800">Type</TableHead>
            <TableHead className="text-slate-800">Status</TableHead>
            <TableHead className="text-slate-800">Department</TableHead>
            <TableHead className="text-slate-800">Assigned To</TableHead>
            <TableHead className="text-slate-800">Priority</TableHead> {/* 🟡 Added */}
            <TableHead className="text-slate-800">Created</TableHead>
            <TableHead className="text-slate-800">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <div className="flex items-start gap-3">
                  {report.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={report.imageUrl || "/placeholder.svg"}
                        alt="Report"
                        className="w-12 h-12 rounded object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate text-slate-900">{report.issueLabel}</p>
                    <p className="text-xs text-slate-600 line-clamp-2">{report.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {report.imageUrl && <ImageIcon className="h-3 w-3 text-slate-500" />}
                      {report.location && <MapPin className="h-3 w-3 text-slate-500" />}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <IssueTypeBadge issueType={report.issueType} />
              </TableCell>

              <TableCell>
                <StatusBadge status={report.status} />
              </TableCell>

              <TableCell>
                {report.assignedDept ? (
                  <Badge variant="outline">{report.assignedDept}</Badge>
                ) : (
                  <span className="text-slate-600 text-sm">Unassigned</span>
                )}
              </TableCell>

              <TableCell>
                {report.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {report.assignedTo.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-800">{report.assignedTo}</span>
                  </div>
                ) : (
                  <span className="text-slate-600 text-sm">Unassigned</span>
                )}
              </TableCell>

              {/* 🟢 Priority Column */}
              <TableCell>
                {report.priority ? (
                  <Badge
                    variant={
                      report.priority === "high"
                        ? "destructive"
                        : report.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {report.priority}
                  </Badge>
                ) : (
                  <span className="text-slate-600 text-sm">N/A</span>
                )}
              </TableCell>

              <TableCell>
                <div className="text-sm text-slate-800">
                  {format(report.createdAt.toDate(), "MMM dd, yyyy")}
                  <div className="text-xs text-slate-600">{format(report.createdAt.toDate(), "HH:mm")}</div>
                </div>
              </TableCell>

              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onViewReport(report)}>
                  <Eye className="h-4 w-4 text-slate-700" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}