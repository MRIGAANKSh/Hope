"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface QuickFiltersProps {
  stats: {
    total: number
    open: number
    today: number
  }
  onFilterClick: (filter: string) => void
}

export function QuickFilters({ stats, onFilterClick }: QuickFiltersProps) {
  const filters = [
    {
      id: "unresolved",
      label: "Unresolved Reports",
      count: stats.open,
      icon: AlertTriangle,
      variant: "destructive" as const,
    },
    {
      id: "today",
      label: "New Today",
      count: stats.today,
      icon: Clock,
      variant: "secondary" as const,
    },
    {
      id: "all",
      label: "All Reports",
      count: stats.total,
      icon: CheckCircle,
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant="ghost"
            className="w-full justify-between h-auto p-3"
            onClick={() => onFilterClick(filter.id)}
          >
            <div className="flex items-center gap-3">
              <filter.icon className="h-4 w-4" />
              <span>{filter.label}</span>
            </div>
            <Badge variant={filter.variant}>{filter.count}</Badge>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
