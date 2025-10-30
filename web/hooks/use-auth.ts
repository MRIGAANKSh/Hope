"use client"

import { useState, useEffect } from "react"
import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/lib/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // ✅ Check if user is admin
          const adminDoc = await getDoc(doc(db, "admins", firebaseUser.uid))
          if (adminDoc.exists()) {
            const adminData = adminDoc.data()
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: "admin",
              name: adminData.name || firebaseUser.displayName || undefined,
            })
            setLoading(false)
            return
          }

          // ✅ Check if user is supervisor
          const supervisorDoc = await getDoc(doc(db, "supervisors", firebaseUser.uid))
          if (supervisorDoc.exists()) {
            const supervisorData = supervisorDoc.data()
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: "supervisor",
              name: supervisorData.name,
              dept: supervisorData.dept,
              department:supervisorData.department
            })
            setLoading(false)
            return
          }

          // ✅ Default (user exists but no role)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            role: null,
          })
        } catch (err) {
          console.error("Error fetching user role:", err)
          setError("Failed to fetch user role")
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ✅ SIGNUP (NEW)
  const signup = async (email: string, password: string, role: string, extraData?: any) => {
    try {
      setError(null)
      setLoading(true)
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const uid = cred.user.uid

      // ✅ Save user details in proper collection based on role
      if (role === "admin") {
        await setDoc(doc(db, "admins", uid), {
          email,
          name: extraData?.name || "",
          createdAt: new Date(),
        })
      } else if (role === "supervisor") {
        await setDoc(doc(db, "supervisors", uid), {
          email,
          name: extraData?.name || "",
          dept: extraData?.dept || "",
          createdAt: new Date(),
        })
      } else {
        // fallback users collection
        await setDoc(doc(db, "users", uid), {
          email,
          role,
          createdAt: new Date(),
        })
      }

      return cred
    } catch (err: any) {
      console.error("Signup failed:", err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ✅ LOGOUT
  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    login,
    signup, // ✅ added here
    logout,
  }
}
