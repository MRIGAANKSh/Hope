import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyByLYQyYsmbmlT2-sSePW2mP44SzzXCdis",
  authDomain: "sewamitruser-48301.firebaseapp.com",
  projectId: "sewamitruser-48301",
  storageBucket: "sewamitruser-48301.firebasestorage.app",
  messagingSenderId: "514092840910",
  appId: "1:514092840910:web:6cbffba560a34e11be9d9f"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
