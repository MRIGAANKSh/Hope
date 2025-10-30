"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AdminHeader() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          {/* Title: explicit dark color */}
          <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
          {/* Subtitle: explicit muted color */}
          <p className="text-sm text-slate-500">Manage reports and monitor system activity</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative" aria-label="Notifications">
            <Bell className="h-4 w-4 text-slate-700" />
            {/* red dot for unread (visible) */}
            <span
              aria-hidden
              className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full ring-2 ring-white"
              title="1 new notification"
            />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-800 text-white">
                    {(user?.name && user.name.charAt(0)) ||
                      (user?.email && user.email.charAt(0)) ||
                      "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">{user?.name || "Admin"}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-sm text-slate-700">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm text-slate-700">
                <User className="mr-2 h-4 w-4 text-slate-700" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-sm text-slate-700">
                <LogOut className="mr-2 h-4 w-4 text-slate-700" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
