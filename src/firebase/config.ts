
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIZ_6mjNpAOC8HPaWNd_WtGkgucjebVmE",
  authDomain: "self-bet-app-fc3f4.firebaseapp.com",
  projectId: "self-bet-app-fc3f4",
  storageBucket: "self-bet-app-fc3f4.firebasestorage.app",
  messagingSenderId: "441431703149",
  appId: "1:441431703149:web:120b142cdde82be6ca0964",
  measurementId: "G-RFBGEJ2403"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
