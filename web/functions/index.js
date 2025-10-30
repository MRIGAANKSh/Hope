const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore")
const { initializeApp } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")
const { getMessaging } = require("firebase-admin/messaging")

// Initialize Firebase Admin
initializeApp()

// Notification when a new report is created
exports.onReportCreated = onDocumentCreated("reports/{reportId}", async (event) => {
  const reportData = event.data.data()
  const reportId = event.params.reportId

  console.log(`New report created: ${reportId}`)

  // Auto-assign to department based on issue type (optional logic)
  if (reportData.issueType && !reportData.assignedDept) {
    const departmentMapping = {
      water: "water",
      road: "roads",
      electricity: "electricity",
      sanitation: "sanitation",
      other: "general",
    }

    const assignedDept = departmentMapping[reportData.issueType] || "general"

    try {
      await getFirestore().collection("reports").doc(reportId).update({
        assignedDept: assignedDept,
        updatedAt: new Date(),
      })

      console.log(`Auto-assigned report ${reportId} to department: ${assignedDept}`)
    } catch (error) {
      console.error("Error auto-assigning report:", error)
    }
  }

  return null
})

// Notification when a report is assigned to a supervisor
exports.onReportAssigned = onDocumentUpdated("reports/{reportId}", async (event) => {
  const beforeData = event.data.before.data()
  const afterData = event.data.after.data()
  const reportId = event.params.reportId

  // Check if assignedTo field was updated
  if (beforeData.assignedTo !== afterData.assignedTo && afterData.assignedTo) {
    console.log(`Report ${reportId} assigned to supervisor: ${afterData.assignedTo}`)

    try {
      // Get supervisor data to find their FCM token (if stored)
      const supervisorDoc = await getFirestore().collection("supervisors").doc(afterData.assignedTo).get()

      if (supervisorDoc.exists) {
        const supervisorData = supervisorDoc.data()

        // If supervisor has FCM token, send notification
        if (supervisorData.fcmToken) {
          const message = {
            token: supervisorData.fcmToken,
            notification: {
              title: "New Report Assigned",
              body: `You have been assigned a new ${afterData.issueType} report: ${afterData.issueLabel}`,
            },
            data: {
              reportId: reportId,
              issueType: afterData.issueType,
              status: afterData.status,
            },
          }

          await getMessaging().send(message)
          console.log(`FCM notification sent to supervisor: ${afterData.assignedTo}`)
        }

        // Send email notification (optional - requires email service setup)
        if (supervisorData.email) {
          console.log(`Email notification should be sent to: ${supervisorData.email}`)
          // Implement email sending logic here (SendGrid, Nodemailer, etc.)
        }
      }
    } catch (error) {
      console.error("Error sending notification:", error)
    }
  }

  return null
})

// Notification when report status changes to resolved
exports.onReportResolved = onDocumentUpdated("reports/{reportId}", async (event) => {
  const beforeData = event.data.before.data()
  const afterData = event.data.after.data()
  const reportId = event.params.reportId

  // Check if status changed to resolved
  if (beforeData.status !== "resolved" && afterData.status === "resolved") {
    console.log(`Report ${reportId} has been resolved`)

    // Optional: Send notification to the original reporter
    // Optional: Update department statistics
    // Optional: Trigger any cleanup or archival processes

    return null
  }

  return null
})
