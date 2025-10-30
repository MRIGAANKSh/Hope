import type { Timestamp, GeoPoint } from "firebase/firestore"

export interface Report {
  id: string
  uid: string
  description: string
  issueType: "water" | "road" | "electricity" | "sanitation" | "other"
  issueLabel: string
  customIssue?: string | null
  classification?: string | null
  classificationNote?: string | null
  imageUrl?: string | null
  audioUrl?: string | null
  location?: GeoPoint | null
  status: "submitted" | "acknowledged" | "in_progress" | "resolved"
  assignedDept?: string | null
  assignedTo?: string | null
  statusHistory: StatusHistoryEntry[]
  createdAt: Timestamp
  updatedAt: Timestamp
  priority?: "high" | "medium" | "low" | null
}

export interface StatusHistoryEntry {
  kind?: "status" | "classification"
  status?: string
  classification?: string
  changedBy: string
  changedAt: Timestamp
  note?: string
}

export interface Admin {
  role: "superadmin" | "admin"
  name?: string
  email?: string
  createdAt: Timestamp
}

export interface Supervisor {
  name: string
  email: string
  dept: string
  phone?: string
  createdAt: Timestamp
}

export interface Department {
  name: string
  contactEmail: string
  defaultSupervisorUid?: string
  createdAt: Timestamp
}

export interface Category {
  label: string
  dept: string
  priority: number
  createdAt: Timestamp
}

export interface User {
  uid: string
  email: string
  role: "admin" | "supervisor" | null
  name?: string
  dept?: string
}