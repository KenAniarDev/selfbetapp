
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDwDCgOpBbaRWSUOHiTa4gn6ItU-T17tE",
  authDomain: "self-bet-app.firebaseapp.com",
  projectId: "self-bet-app",
  storageBucket: "self-bet-app.firebasestorage.app",
  messagingSenderId: "1011898671248",
  appId: "1:1011898671248:web:55510676420f653b1f7815"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
