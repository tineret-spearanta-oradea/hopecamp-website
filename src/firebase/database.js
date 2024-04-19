//This file will call the functions related to the firebase database
import { db } from "./firebase-config";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

export const writeUserData = async (userData) => {
  const normalizedUserData = Object.fromEntries(
    Object.entries(userData)
      .filter(([key, value]) => value !== undefined)
      .filter(([key]) => key !== "uid")
  );

  const docData = normalizedUserData;

  await setDoc(doc(db, "users", userData.uid), docData);
};

export const getUserData = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  console.log(uid);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};
