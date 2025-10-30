// components/dashboard/reports-chart.tsx
"use client"

import React, { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Report } from "@/lib/types"
import { format, subDays, eachDayOfInterval } from "date-fns"

interface Props {
  reports: Report[] | undefined
  days?: number
}

function toMillisSafe(ts: any): number | null {
  if (ts == null) return null
  if (typeof ts.toMillis === "function") {
    try { return ts.toMillis() } catch {}
  }
  if (typeof ts.toDate === "function") {
    try { return ts.toDate().getTime() } catch {}
  }
  if (ts instanceof Date) return ts.getTime()
  if (typeof ts === "number") return ts
  return null
}

export function ReportsChart({ reports = [], days = 30 }: Props) {
  const chartData = useMemo(() => {
    const now = new Date()
    const startDate = subDays(now, days - 1)
    const dateRange = eachDayOfInterval({ start: startDate, end: now })

    // initialize map
    const map = dateRange.map((date) => ({ dateKey: format(date, "MMM dd"), count: 0 }))

    // count reports whose createdAt falls inside
    reports.forEach((r) => {
      const ms = toMillisSafe(r.createdAt)
      if (ms == null) return
      const d = new Date(ms)
      // if within range
      if (d >= startDate && d <= now) {
        const key = format(d, "MMM dd")
        const idx = map.findIndex((m) => m.dateKey === key)
        if (idx >= 0) map[idx].count += 1
      }
    })

    return map.map((m) => ({ date: m.dateKey, count: m.count }))
  }, [reports, days])

  const hasAny = chartData.some((d) => d.count > 0)

  if (!hasAny) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reports Trend</CardTitle>
          <CardDescription>Daily report submissions over the last {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No reports in the selected range.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports Trend</CardTitle>
        <CardDescription>Daily report submissions over the last {days} days</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
