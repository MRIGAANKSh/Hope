# SewaMitr Admin Portal

A production-ready web portal for managing municipal reports with role-based access for admins and supervisors.

## Features

- **Role-based Authentication**: Admin and Supervisor dashboards with Firebase Auth
- **Real-time Report Management**: Live updates with Firestore
- **Interactive Map View**: Leaflet-based geographical visualization
- **Comprehensive Analytics**: Charts, metrics, and CSV export
- **Mobile Integration**: Seamless integration with mobile app submissions
- **Secure Access Control**: Firestore security rules and proper authorization

## Tech Stack

- **Frontend**: React + TypeScript + Next.js
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Maps**: React Leaflet (OpenStreetMap)
- **Charts**: Recharts
- **Media Storage**: Cloudinary

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase and Cloudinary credentials:

\`\`\`bash
cp .env.example .env
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Firebase Setup

#### Deploy Security Rules
\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`

#### Create Firestore Indexes
\`\`\`bash
firebase deploy --only firestore:indexes
\`\`\`

#### Setup Cloud Functions (Optional)
\`\`\`bash
cd functions
npm install
firebase deploy --only functions
\`\`\`

### 4. Create Admin and Supervisor Accounts

Use the setup script to create initial users:

\`\`\`bash
# Edit scripts/setup-admin.ts with your service account key
npx ts-node scripts/setup-admin.ts
\`\`\`

Or manually create documents in Firestore:

#### Admin Document (`admins/{uid}`)
\`\`\`json
{
  "role": "admin",
  "name": "System Administrator", 
  "email": "admin@sewamitr.gov",
  "createdAt": "2024-01-15T10:00:00Z"
}
\`\`\`

#### Supervisor Document (`supervisors/{uid}`)
\`\`\`json
{
  "name": "Water Supervisor",
  "email": "water.supervisor@sewamitr.gov", 
  "dept": "water",
  "phone": "+91-9876543210",
  "createdAt": "2024-01-15T10:00:00Z"
}
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the portal.

## Test Credentials

After running the setup script:

- **Admin**: admin@sewamitr.gov / admin123456
- **Water Supervisor**: water.supervisor@sewamitr.gov / supervisor123
- **Roads Supervisor**: roads.supervisor@sewamitr.gov / supervisor123

## Firestore Collections

### Reports (`reports/{reportId}`)
- Submitted by mobile app users
- Contains issue details, media URLs, location data
- Status tracking with history
- Assignment to departments and supervisors

### Admins (`admins/{uid}`)
- Admin user authorization
- Role-based permissions (admin, superadmin)

### Supervisors (`supervisors/{uid}`)
- Supervisor user data
- Department assignment
- Contact information

### Departments (`departments/{deptId}`)
- Department information
- Contact details
- Default supervisor assignment

### Categories (`categories/{categoryId}`)
- Classification labels for reports
- Department mapping
- Priority levels

## Security Rules

The Firestore security rules enforce:

- **Admins**: Full read/write access to all reports and admin functions
- **Supervisors**: Read/write access only to reports assigned to their department or specifically to them
- **Mobile Users**: Can create reports and read their own submissions
- **Authentication Required**: All operations require valid Firebase Auth

## Cloud Functions

Optional notification functions:

- **onReportCreated**: Auto-assign reports to departments
- **onReportAssigned**: Send FCM/email notifications to supervisors  
- **onReportResolved**: Trigger completion workflows

## Production Deployment

### Vercel Deployment
\`\`\`bash
npm run build
# Deploy to Vercel via GitHub integration or CLI
\`\`\`

### Firebase Hosting (Alternative)
\`\`\`bash
npm run build
firebase deploy --only hosting
\`\`\`

## API Integration

The portal integrates with mobile app submissions via Firestore. Mobile apps should:

1. Authenticate users with Firebase Auth
2. Submit reports to `reports` collection with required fields
3. Upload media to Cloudinary and store URLs in report documents
4. Include location data as GeoPoint for map visualization

## Troubleshooting

### Common Issues

1. **Access Denied**: Ensure user has proper admin/supervisor document in Firestore
2. **Map Not Loading**: Check if reports have valid location data (GeoPoint)
3. **Charts Empty**: Verify reports exist and have proper timestamp fields
4. **Export Failing**: Check browser permissions for file downloads

### Security Rules Testing

Use Firebase Console Rules Simulator to test access patterns:

\`\`\`javascript
// Test admin access
auth.uid == 'admin_uid' && exists(/databases/$(database)/documents/admins/$(auth.uid))

// Test supervisor access  
auth.uid == 'supervisor_uid' && exists(/databases/$(database)/documents/supervisors/$(auth.uid))
\`\`\`

## Support

For issues or questions:
- Email: admin@sewamitr.gov
- Phone: +91-XXXX-XXXXXX

## License

Government of India - Municipal Services
