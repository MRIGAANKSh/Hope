// components/analytics/issue-type-chart.tsx
"use client"

import React, { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Report } from "@/lib/types"

const DEFAULT_COLORS = [
  "#4f46e5", // indigo
  "#ef4444", // red
  "#06b6d4", // teal
  "#f59e0b", // amber
  "#10b981", // green
]

interface IssueTypeChartProps {
  reports: Report[]
}

export function IssueTypeChart({ reports = [] }: IssueTypeChartProps) {
  const counts = useMemo(() => {
    return reports.reduce((acc, report) => {
      const t = (report.issueType as string) || "other"
      acc[t] = (acc[t] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [reports])

  const data = useMemo(() => {
    return Object.entries(counts).map(([name, value], i) => ({
      name: name.replace(/_/g, " "),
      value,
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }))
  }, [counts])

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reports by Issue Type</CardTitle>
          <CardDescription>No data</CardDescription>
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
        <CardTitle>Reports by Issue Type</CardTitle>
        <CardDescription>Distribution of reports across different categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              barCategoryGap="30%"    // more gap between categories
              barGap={6}              // gap between bars (if multiple)
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
