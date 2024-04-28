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

export const getAllUsers = async () => {
  const docRef = collection(db, "users");
  const docSnap = await getDocs(docRef);
  const users = docSnap.docs.map((doc) => doc.data());

  users.sort((a, b) => a.signupDate.seconds - b.signupDate.seconds);
  users.forEach((user, index) => {
    user.numberOfDays = Math.abs((user.endDate - user.startDate) / 86400);
    user.uid = docSnap.docs[index].id;
    user.signupDate = user.signupDate.toDate().toLocaleString();
    user.startDate = user.startDate.toDate().toLocaleDateString();
    user.endDate = user.endDate.toDate().toLocaleDateString();
  });

  return users;
};

export const updateUserData = async (updatedUserData) => {
  // normalize data
  updateUserData.signupDate = Timestamp.fromDate(
    new Date(updatedUserData.signupDate)
  );
  updateUserData.startDate = Date.parse(updatedUserData.startDate);
  updateUserData.endDate = Date.parse(updatedUserData.endDate);
  const docRef = doc(db, "users", updatedUserData.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = docSnap.data();
    const newDocData = { ...docData, ...updatedUserData };
    await setDoc(docRef, newDocData);
  }
};
