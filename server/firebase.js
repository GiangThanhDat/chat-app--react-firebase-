// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPO4h475zEqZdvkR7bNWCbUAd-ysNdDP4",
  authDomain: "employee-tasks-management.firebaseapp.com",
  projectId: "employee-tasks-management",
  storageBucket: "employee-tasks-management.appspot.com",
  messagingSenderId: "543068524532",
  appId: "1:543068524532:web:0b82bf5d56edb98eb533a1",
  measurementId: "G-7LBSSDNXJN",
  databaseURL:
    "https://employee-tasks-management-default-rtdb.asia-southeast1.firebasedatabase.app",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
