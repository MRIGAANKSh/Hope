import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "submitted" | "acknowledged" | "in_progress" | "resolved"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    submitted: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    acknowledged: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    in_progress: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    resolved: "bg-green-100 text-green-800 hover:bg-green-100",
  }

  const labels = {
    submitted: "Submitted",
    acknowledged: "Acknowledged",
    in_progress: "In Progress",
    resolved: "Resolved",
  }

  return (
    <Badge variant="secondary" className={cn(variants[status], className)}>
      {labels[status]}
    </Badge>
  )
}
