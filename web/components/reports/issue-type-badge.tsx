import { Badge } from "@/components/ui/badge"

interface IssueTypeBadgeProps {
  issueType: "water" | "road" | "electricity" | "sanitation" | "other"
  className?: string
}

export function IssueTypeBadge({ issueType, className }: IssueTypeBadgeProps) {
  const variants = {
    water: "bg-blue-50 text-blue-700 border-blue-200",
    road: "bg-gray-50 text-gray-700 border-gray-200",
    electricity: "bg-yellow-50 text-yellow-700 border-yellow-200",
    sanitation: "bg-green-50 text-green-700 border-green-200",
    other: "bg-purple-50 text-purple-700 border-purple-200",
  }

  const labels = {
    water: "Water",
    road: "Road",
    electricity: "Electricity",
    sanitation: "Sanitation",
    other: "Other",
  }

  return (
    <Badge variant="outline" className={`${variants[issueType]} ${className}`}>
      {labels[issueType]}
    </Badge>
  )
}
