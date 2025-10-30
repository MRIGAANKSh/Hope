import { format } from "date-fns"
import type { Report } from "@/lib/types"

export function exportReportsToCSV(reports: Report[], filename?: string) {
  const headers = [
    "ID",
    "Issue Type",
    "Issue Label",
    "Description",
    "Status",
    "Classification",
    "Assigned Department",
    "Assigned To",
    "Reporter UID",
    "Has Image",
    "Has Audio",
    "Latitude",
    "Longitude",
    "Created At",
    "Updated At",
    "Resolution Time (Hours)",
  ]

  const csvData = reports.map((report) => {
    const resolvedEntry = report.statusHistory.find((entry) => entry.status === "resolved")
    const resolutionTime = resolvedEntry
      ? Math.round((resolvedEntry.changedAt.toMillis() - report.createdAt.toMillis()) / (1000 * 60 * 60))
      : null

    return [
      report.id,
      report.issueType,
      report.issueLabel,
      `"${report.description.replace(/"/g, '""')}"`, // Escape quotes in description
      report.status,
      report.classification || "",
      report.assignedDept || "",
      report.assignedTo || "",
      report.uid,
      report.imageUrl ? "Yes" : "No",
      report.audioUrl ? "Yes" : "No",
      report.location?.latitude || "",
      report.location?.longitude || "",
      format(report.createdAt.toDate(), "yyyy-MM-dd HH:mm:ss"),
      format(report.updatedAt.toDate(), "yyyy-MM-dd HH:mm:ss"),
      resolutionTime || "",
    ]
  })

  const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename || `reports-export-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
