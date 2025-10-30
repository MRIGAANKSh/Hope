import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MapLegend() {
  const issueTypes = [
    { type: "water", label: "Water", color: "#3b82f6" },
    { type: "road", label: "Road", color: "#6b7280" },
    { type: "electricity", label: "Electricity", color: "#eab308" },
    { type: "sanitation", label: "Sanitation", color: "#22c55e" },
    { type: "other", label: "Other", color: "#a855f7" },
  ]

  const statusTypes = [
    { status: "submitted", label: "Submitted", color: "#ef4444" },
    { status: "acknowledged", label: "Acknowledged", color: "#f59e0b" },
    { status: "in_progress", label: "In Progress", color: "#3b82f6" },
    { status: "resolved", label: "Resolved", color: "#10b981" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Map Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-xs font-medium mb-2 text-muted-foreground">Issue Types (Inner Circle)</h4>
          <div className="space-y-1">
            {issueTypes.map((item) => (
              <div key={item.type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.color }} />
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2 text-muted-foreground">Status (Marker Color)</h4>
          <div className="space-y-1">
            {statusTypes.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.color }} />
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Click on markers to view report details. Markers are clustered when zoomed out.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
