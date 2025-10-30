"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { login, signup, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let userCred;

      if (mode === "signup") {
        // ✅ Create user and store role properly
        userCred = await signup(email, password, role, {
          name: email.split("@")[0],
        });

        alert("Signup successful! You can now log in.");
        setMode("login");
        setIsLoading(false);
        return;
      }

      // ✅ Login existing user
      userCred = await login(email, password);
      const uid = userCred.user.uid;

      // ✅ Redirect based on role
      if (role === "supervisor") router.push("/supervisor-dashboard");
      else if (role === "admin") router.push("/admin-dashboard");
      else router.push("/dashboard");
    } catch (err) {
      console.error(`${mode} failed:`, err);
      alert(`${mode} failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-md">
        <CardHeader className="text-center pt-6">
          <img
            src="/logo (2).png"
            alt="SewaMitr logo"
            className="mx-auto mb-3 h-16 w-20 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
              SewaMitr
            </CardTitle>
            <CardDescription className="mt-1 text-slate-600">
              {mode === "login"
                ? "Sign in to continue"
                : "Create a new account"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Role (only for signup) */}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800"
              disabled={isLoading}
            >
              {isLoading
                ? mode === "login"
                  ? "Signing in..."
                  : "Signing up..."
                : mode === "login"
                ? "Sign In"
                : "Sign Up"}
            </Button>

            {/* Switch between login/signup */}
            <div className="text-center text-sm mt-3 text-slate-600">
              {mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-indigo-600 hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-indigo-600 hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
