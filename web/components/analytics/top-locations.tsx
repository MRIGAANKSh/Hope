// components/analytics/top-locations.tsx
"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import type { Report } from "@/lib/types"

interface TopLocationsProps {
  reports: Report[]
  limit?: number
}

export function TopLocations({ reports = [], limit = 10 }: TopLocationsProps) {
  const locationClusters = useMemo(() => {
    const reportsWithLocation = reports.filter((r) => r.location)

    const clusters = reportsWithLocation.reduce((acc, report) => {
      // Accept both Firestore GeoPoint { latitude, longitude } and { lat, lng }
      const latRaw = (report.location as any).latitude ?? (report.location as any).lat
      const lngRaw = (report.location as any).longitude ?? (report.location as any).lng
      if (typeof latRaw !== "number" || typeof lngRaw !== "number") return acc

      const lat = Math.round(latRaw * 1000) / 1000
      const lng = Math.round(lngRaw * 1000) / 1000
      const key = `${lat},${lng}`

      if (!acc[key]) {
        acc[key] = { lat, lng, count: 0, reports: [] as Report[] }
      }
      acc[key].count++
      acc[key].reports.push(report)
      return acc
    }, {} as Record<string, { lat: number; lng: number; count: number; reports: Report[] }>)

    return Object.values(clusters).sort((a, b) => b.count - a.count).slice(0, limit)
  }, [reports, limit])

  const getMostCommonIssueType = (items: Report[]) => {
    if (!items || items.length === 0) return "N/A"
    const counts = items.reduce((acc, r) => {
      const t = r.issueType || "other"
      acc[t] = (acc[t] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted[0] ? sorted[0][0] : "N/A"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Top Report Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locationClusters.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No location data available</p>
        ) : (
          <div className="space-y-3">
            {locationClusters.map((cluster, index) => (
              <div key={`${cluster.lat},${cluster.lng}`} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">#{index + 1}</span>
                    <Badge variant="secondary">{cluster.count} reports</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Lat: {cluster.lat}, Lng: {cluster.lng}</p>
                  <p className="text-xs text-muted-foreground mt-1">Most common: {getMostCommonIssueType(cluster.reports)}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{cluster.count}</div>
                  <div className="text-xs text-muted-foreground">reports</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
