//This file will call the functions related to the firebase database
import { db } from "./firebase-config";
import {
  doc,
  setDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

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

export const getArchivedUserData = async (email) => {
  const archivedUsersRef = collection(db, "archivedUsers");
  const q = query(archivedUsersRef, where("email", "==", email));

  const querySnapshot = await getDocs(q);
  const firstDoc = querySnapshot.docs[0];
  if (firstDoc) {
    return firstDoc.data();
  }
  return null;
};
