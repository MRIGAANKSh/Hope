-- Sample SQL script to create sample report data
-- This would be converted to Firestore documents in practice

-- Sample reports data structure (for reference)
-- These would be created as Firestore documents via the mobile app or admin interface

/*
Sample Report Document Structure:

{
  "id": "report_001",
  "uid": "user123",
  "description": "Water pipe burst on Main Street causing flooding",
  "issueType": "water",
  "issueLabel": "Pipe Burst",
  "customIssue": null,
  "classification": "Emergency",
  "classificationNote": "Requires immediate attention",
  "imageUrl": "https://res.cloudinary.com/db06jof6r/image/upload/v1234567890/sample.jpg",
  "audioUrl": null,
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "status": "in_progress",
  "assignedDept": "water",
  "assignedTo": "water_supervisor_uid",
  "statusHistory": [
    {
      "kind": "status",
      "status": "submitted",
      "changedBy": "user123",
      "changedAt": "2024-01-15T10:00:00Z",
      "note": "Initial submission"
    },
    {
      "kind": "status", 
      "status": "acknowledged",
      "changedBy": "water_supervisor_uid",
      "changedAt": "2024-01-15T10:30:00Z",
      "note": "Acknowledged by water department"
    },
    {
      "kind": "classification",
      "classification": "Emergency",
      "changedBy": "admin_uid",
      "changedAt": "2024-01-15T11:00:00Z",
      "note": "Classified as emergency due to flooding risk"
    },
    {
      "kind": "status",
      "status": "in_progress", 
      "changedBy": "water_supervisor_uid",
      "changedAt": "2024-01-15T12:00:00Z",
      "note": "Repair team dispatched"
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T12:00:00Z"
}
*/
