import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin (you'll need to download service account key)
// const serviceAccount = require("./path-to-service-account-key.json");
// initializeApp({
//   credential: cert(serviceAccount)
// });

const db = getFirestore()
const auth = getAuth()

async function createAdminUser(email: string, password: string, name: string, role: "admin" | "superadmin" = "admin") {
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name,
    })

    console.log(`Created user: ${userRecord.uid}`)

    // Add admin document to Firestore
    await db.collection("admins").doc(userRecord.uid).set({
      role: role,
      name: name,
      email: email,
      createdAt: new Date(),
    })

    console.log(`Added admin document for: ${email}`)
    return userRecord.uid
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  }
}

async function createSupervisorUser(email: string, password: string, name: string, dept: string, phone?: string) {
  try {
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name,
    })

    console.log(`Created supervisor user: ${userRecord.uid}`)

    // Add supervisor document to Firestore
    await db
      .collection("supervisors")
      .doc(userRecord.uid)
      .set({
        name: name,
        email: email,
        dept: dept,
        phone: phone || "",
        createdAt: new Date(),
      })

    console.log(`Added supervisor document for: ${email}`)
    return userRecord.uid
  } catch (error) {
    console.error("Error creating supervisor user:", error)
    throw error
  }
}

async function createDepartment(deptId: string, name: string, contactEmail: string, defaultSupervisorUid?: string) {
  try {
    await db
      .collection("departments")
      .doc(deptId)
      .set({
        name: name,
        contactEmail: contactEmail,
        defaultSupervisorUid: defaultSupervisorUid || null,
        createdAt: new Date(),
      })

    console.log(`Created department: ${deptId}`)
  } catch (error) {
    console.error("Error creating department:", error)
    throw error
  }
}

// Example usage
async function setupInitialData() {
  try {
    // Create admin user
    const adminUid = await createAdminUser("admin@sewamitr.gov", "admin123456", "System Administrator", "superadmin")

    // Create departments
    await createDepartment("water", "Water Department", "water@sewamitr.gov")
    await createDepartment("roads", "Roads Department", "roads@sewamitr.gov")
    await createDepartment("electricity", "Electricity Department", "electricity@sewamitr.gov")
    await createDepartment("sanitation", "Sanitation Department", "sanitation@sewamitr.gov")

    // Create supervisor users
    const waterSupervisorUid = await createSupervisorUser(
      "water.supervisor@sewamitr.gov",
      "supervisor123",
      "Water Supervisor",
      "water",
      "+91-9876543210",
    )

    const roadsSupervisorUid = await createSupervisorUser(
      "roads.supervisor@sewamitr.gov",
      "supervisor123",
      "Roads Supervisor",
      "roads",
      "+91-9876543211",
    )

    // Update departments with default supervisors
    await db.collection("departments").doc("water").update({
      defaultSupervisorUid: waterSupervisorUid,
    })

    await db.collection("departments").doc("roads").update({
      defaultSupervisorUid: roadsSupervisorUid,
    })

    console.log("Initial setup completed successfully!")
    console.log("\nTest Credentials:")
    console.log("Admin: admin@sewamitr.gov / admin123456")
    console.log("Water Supervisor: water.supervisor@sewamitr.gov / supervisor123")
    console.log("Roads Supervisor: roads.supervisor@sewamitr.gov / supervisor123")
  } catch (error) {
    console.error("Setup failed:", error)
  }
}

// Uncomment to run setup
// setupInitialData();
