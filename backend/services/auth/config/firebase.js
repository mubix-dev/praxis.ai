
import { cert, initializeApp } from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is not set")
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

export const app = initializeApp({
  credential: cert(serviceAccount)
});
