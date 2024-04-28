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

  // transformiing the data to march the structure of the table
  users.sort((a, b) => {
    let signupDateA, signupDateB;
    if (a.signupDate instanceof Timestamp) {
      signupDateA = a.signupDate.seconds;
    } else {
      signupDateA = new Date(a.signupDate).getTime();
    }
    if (b.signupDate instanceof Timestamp) {
      signupDateB = b.signupDate.seconds;
    } else {
      signupDateB = new Date(b.signupDate).getTime();
    }
    return signupDateA - signupDateB;
  });

  users.forEach((user, index) => {
    user.uid = docSnap.docs[index].id;

    var signupDate, startDate, endDate;
    if (user.signupDate instanceof Timestamp) {
      signupDate = user.signupDate.toDate();
    } else {
      signupDate = new Date(user.signupDate);
    }
    if (user.startDate instanceof Timestamp) {
      startDate = user.startDate.toDate();
    } else {
      startDate = new Date(user.startDate);
    }
    if (user.endDate instanceof Timestamp) {
      endDate = user.endDate.toDate();
    } else {
      endDate = new Date(user.endDate);
    }

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    user.numberOfDays = diffDays;
    user.signupDate = signupDate.toLocaleString();
    user.startDate = startDate.toLocaleDateString();
    user.endDate = endDate.toLocaleDateString();
  });

  return users;
};

export const updateUserData = async (userToUpdate) => {
  // normalize data
  const uid = userToUpdate.uid;
  // remove fields that by nature, will not be updated
  const normalizedUserData = Object.fromEntries(
    Object.entries(userToUpdate)
      .filter(([key, value]) => value !== undefined)
      .filter(([key]) => key !== "uid")
      .filter(([key]) => key !== "signupDate")
      .filter(([key]) => key !== "numberOfDays")
  );
  // transform date fields
  normalizedUserData.startDate = Timestamp.fromDate(
    new Date(normalizedUserData.startDate)
  );
  normalizedUserData.endDate = Timestamp.fromDate(
    new Date(normalizedUserData.endDate)
  );

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = docSnap.data();
    const newDocData = { ...docData, ...normalizedUserData };
    await setDoc(docRef, newDocData);
  }
};
