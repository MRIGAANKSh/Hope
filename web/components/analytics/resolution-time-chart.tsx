// components/analytics/resolution-time-chart.tsx
"use client"

import React, { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, subDays, eachDayOfInterval } from "date-fns"
import type { Report } from "@/lib/types"

interface ResolutionTimeChartProps {
  reports: Report[]
  days?: number
}

function timestampToMillis(ts: any): number | null {
  if (!ts && ts !== 0) return null
  if (typeof ts.toDate === "function") {
    try {
      return ts.toDate().getTime()
    } catch {
      // fallthrough
    }
  }
  if (typeof ts.toMillis === "function") {
    try {
      return ts.toMillis()
    } catch {
      // fallthrough
    }
  }
  if (ts instanceof Date) return ts.getTime()
  if (typeof ts === "number") return ts
  return null
}

export function ResolutionTimeChart({ reports = [], days = 30 }: ResolutionTimeChartProps) {
  const chartData = useMemo(() => {
    const now = new Date()
    const startDate = subDays(now, days - 1)
    const dateRange = eachDayOfInterval({ start: startDate, end: now })

    return dateRange.map((date) => {
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
      const dayEnd = dayStart + 24 * 60 * 60 * 1000

      const dayResolvedReports = reports.filter((report) => {
        const history = Array.isArray(report.statusHistory) ? report.statusHistory : []
        const resolvedEntry = history.find((entry) => entry && entry.status === "resolved")
        if (!resolvedEntry) return false
        const resolvedMs = timestampToMillis(resolvedEntry.changedAt)
        if (resolvedMs === null) return false
        return resolvedMs >= dayStart && resolvedMs < dayEnd
      })

      const avgResolutionTime =
        dayResolvedReports.length > 0
          ? dayResolvedReports.reduce((acc, report) => {
              const history = Array.isArray(report.statusHistory) ? report.statusHistory : []
              const resolvedEntry = history.find((entry) => entry && entry.status === "resolved")
              if (!resolvedEntry) return acc
              const createdMs = timestampToMillis(report.createdAt)
              const resolvedMs = timestampToMillis(resolvedEntry.changedAt)
              if (createdMs === null || resolvedMs === null || resolvedMs < createdMs) return acc
              return acc + (resolvedMs - createdMs) / (1000 * 60 * 60)
            }, 0) / dayResolvedReports.length
          : 0

      return {
        date: format(date, "MMM dd"),
        avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
        resolvedCount: dayResolvedReports.length,
      }
    })
  }, [reports, days])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Resolution Time</CardTitle>
        <CardDescription>Daily average time to resolve reports (in hours)</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: any, name: string) => {
                  if (name === "avgResolutionTime") return [`${value}h`, "Avg Resolution Time"]
                  return [value, name]
                }}
              />
              <Line type="monotone" dataKey="avgResolutionTime" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Avg Resolution Time" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
