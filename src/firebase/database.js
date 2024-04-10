//This file will call the functions related to the firebase database
import { db } from "./firebase-config";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const writeUserData = async (userData) => {
  // Here you can add default values to the user data
  userData.amountPayed = 0;

  const normalizedUserData = Object.fromEntries(
    Object.entries(userData)
      .filter(([key, value]) => value !== undefined)
      .filter(([key]) => key !== "uid")
  );

  const docData = {
    normalizedUserData,
  };

  await setDoc(doc(db, "users", userData.uid), docData);
};
