"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// ✅ Replace Input with a dropdown (Select)
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 🔹 Department options
const ISSUE_TYPES = [
  { key: "road_pothole", label: "Pothole / Road Damage", dept: "roads" },
  { key: "streetlight", label: "Streetlight / Electricity", dept: "electrical" },
  { key: "sanitation", label: "Garbage / Sanitation", dept: "sanitation" },
  { key: "water", label: "Water / Drainage", dept: "water" },
  { key: "tree", label: "Tree / Vegetation", dept: "parks" },
  { key: "others", label: "Other Issues", dept: "others" },
]

export default function SupervisorSettingsPage() {
  const { user } = useAuth()
  const [dept, setDept] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 🔹 Fetch supervisor's current department
  useEffect(() => {
    const fetchSupervisor = async () => {
      if (!user?.email) return
      try {
        const q = query(collection(db, "supervisors"), where("email", "==", user.email))
        const snap = await getDocs(q)

        if (!snap.empty) {
          const data = snap.docs[0].data()
          setDept(data.department || "")
        } else {
          toast.error("Supervisor record not found")
        }
      } catch (err) {
        console.error("Error fetching supervisor data:", err)
        toast.error("Failed to load supervisor data")
      } finally {
        setLoading(false)
      }
    }

    fetchSupervisor()
  }, [user])

  // 🔹 Save department selection
  const handleSave = async () => {
    if (!dept) {
      toast.error("Please select a department")
      return
    }

    try {
      const q = query(collection(db, "supervisors"), where("email", "==", user.email))
      const snap = await getDocs(q)

      if (snap.empty) {
        toast.error("Supervisor record not found!")
        return
      }

      const ref = snap.docs[0].ref
      await updateDoc(ref, {
        department: dept,
        updatedAt: new Date(),
      })

      toast.success("Department updated successfully!")

      setTimeout(() => {
        router.push("/supervisor")
      }, 1000)
    } catch (err) {
      console.error("Error updating department:", err)
      toast.error("Failed to update department")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Supervisor Settings</h2>

        <label className="block text-sm font-medium mb-2">Select Department</label>
        <Select value={dept} onValueChange={(val) => setDept(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose your department" />
          </SelectTrigger>
          <SelectContent>
            {ISSUE_TYPES.map((item) => (
              <SelectItem key={item.dept} value={item.dept}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="w-full mt-4" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
