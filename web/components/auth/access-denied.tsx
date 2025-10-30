"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function AccessDenied() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
          <CardDescription>You don't have permission to access this portal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Please contact your system administrator to request access.</p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Contact Information:</p>
            <p className="text-sm text-muted-foreground">
              Email: admin@sewamitr.gov
              <br />
              Phone: +91-XXXX-XXXXXX
            </p>
          </div>
          <Button onClick={logout} variant="outline" className="w-full bg-transparent">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
