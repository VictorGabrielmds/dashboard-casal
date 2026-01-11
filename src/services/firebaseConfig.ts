import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZeM3_Qmn-tE15ZtW7w8-0qceMWN0WnbE",
  authDomain: "nosso-dashboard.firebaseapp.com",
  projectId: "nosso-dashboard",
  storageBucket: "nosso-dashboard.firebasestorage.app",
  messagingSenderId: "254828736134",
  appId: "1:254828736134:web:00b63d380725199340eb07"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);