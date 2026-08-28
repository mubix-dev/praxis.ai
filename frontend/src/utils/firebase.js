// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "praxis-ai-v1.firebaseapp.com",
  projectId: "praxis-ai-v1",
  storageBucket: "praxis-ai-v1.firebasestorage.app",
  messagingSenderId: "863272222749",
  appId: "1:863272222749:web:8d5fca0a9dd516644e86f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()