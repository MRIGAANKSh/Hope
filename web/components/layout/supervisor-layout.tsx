"use client"

import type React from "react"

import { SupervisorSidebar } from "./supervisor-sidebar"
import { SupervisorHeader } from "./supervisor-header"

interface SupervisorLayoutProps {
  children: React.ReactNode
}

export function SupervisorLayout({ children }: SupervisorLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <SupervisorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SupervisorHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
