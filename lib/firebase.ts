// /lib/firebase.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaZ0WZYyXrzd6ANfU7pqRDlytdTjDK69Y",
  authDomain: "readily-424819.firebaseapp.com",
  projectId: "readily-424819",
  storageBucket: "readily-424819.appspot.com",
  messagingSenderId: "1004522555160",
  appId: "1:1004522555160:web:14359be1e01f5a65d0006d"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

export const fetchUserData = async (email: string) => {
  const userRef = doc(db, "users", email);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    throw new Error("No such document!");
  }
};

export const uploadUserData = async (email: string, data: object) => {
  const userRef = doc(db, "users", email);
  await setDoc(userRef, data);
};