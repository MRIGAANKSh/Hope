// components/analytics/status-distribution-chart.tsx
"use client"

import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Report } from "@/lib/types"

interface StatusDistributionChartProps {
  reports: Report[]
}

export function StatusDistributionChart({ reports = [] }: StatusDistributionChartProps) {
  const statusCounts = reports.reduce((acc, report) => {
    const key = report.status || "unknown"
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mapping: { key: string; label: string; color: string }[] = [
    { key: "submitted", label: "Submitted", color: "hsl(var(--chart-1))" },
    { key: "acknowledged", label: "Acknowledged", color: "hsl(var(--chart-2))" },
    { key: "in_progress", label: "In Progress", color: "hsl(var(--chart-3))" },
    { key: "resolved", label: "Resolved", color: "hsl(var(--chart-4))" },
  ]

  const data = mapping
    .map((m) => ({ name: m.label, value: statusCounts[m.key] || 0, color: m.color }))
    .filter((d) => d.value > 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const count = data.value || 0
      const pct = reports.length ? ((count / reports.length) * 100).toFixed(1) : "0.0"
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {count} reports ({pct}%)
          </p>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>No status data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No reports to display</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
        <CardDescription>Current status breakdown of all reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} labelLine={false} label={(entry: any) => `${entry.name} ${(entry.value ? ((entry.value / reports.length) * 100).toFixed(0) : 0)}%`}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
