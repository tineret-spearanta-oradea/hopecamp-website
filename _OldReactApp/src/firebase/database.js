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
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { formatDate } from "../utils";

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

  //TODO: *kind of optional*: Add this to a transformation function
  if (docSnap.exists()) {
    //add uid to the returned data
    const userData = docSnap.data();
    userData.uid = docSnap.id;
    var signupDate, startDate, endDate;
    if (userData.signupDate instanceof Timestamp) {
      signupDate = userData.signupDate.toDate();
    } else {
      signupDate = new Date(userData.signupDate);
    }
    if (userData.startDate instanceof Timestamp) {
      startDate = userData.startDate.toDate();
    } else {
      startDate = new Date(userData.startDate);
    }
    if (userData.endDate instanceof Timestamp) {
      endDate = userData.endDate.toDate();
    } else {
      endDate = new Date(userData.endDate);
    }

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    userData.numberOfDays = diffDays;
    userData.signupDate = signupDate.toLocaleString();
    userData.startDate = startDate.toLocaleDateString();
    userData.endDate = endDate.toLocaleDateString();
    return userData;
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
  const q = query(docRef, orderBy("signupDate"));
  const docSnap = await getDocs(q);
  const users = docSnap.docs.map((doc) => doc.data());

  // transforming the data to match the structure of the table
  users.forEach((user, index) => {
    user.uid = docSnap.docs[index].id;
    user.age = parseInt(user.age);

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
    // Changing the format of these dates might break the updateUser function
    user.signupDate = formatDate(signupDate, "yyyy-mm-dd hh:mm:ss");
    user.startDate = formatDate(startDate);
    user.endDate = formatDate(endDate);
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
  const startDate = new Date(normalizedUserData.startDate);
  const endDate = new Date(normalizedUserData.endDate);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error(
      "Invalid date range: " +
        normalizedUserData.startDate +
        " - " +
        normalizedUserData.endDate
    );
  }
  normalizedUserData.startDate = Timestamp.fromDate(startDate);
  normalizedUserData.endDate = Timestamp.fromDate(endDate);

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const docData = docSnap.data();
    const newDocData = { ...docData, ...normalizedUserData };
    await setDoc(docRef, newDocData);
  } else {
    throw new Error("User not found");
  }
};

export const deleteUserData = async (uid) => {
  const docRef = doc(db, "users", uid);
  await deleteDoc(docRef);
};

export const writeMessageData = async (messageData) => {
  const uid = messageData.uid;
  const normalizedMessageData = Object.fromEntries(
    Object.entries(messageData)
      .filter(([key, value]) => value !== undefined)
      .filter(([key]) => key !== "uid")
  );
  const docData = normalizedMessageData;

  await setDoc(doc(db, "messages", uid), docData);
};

export const getMessageData = async (uid) => {
  const docRef = doc(db, "messages", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const messageData = docSnap.data();
    messageData.uid = docSnap.id;

    // Join on the users table to retrieve user name and phone
    const userData = await getUserData(messageData.uid);
    if (userData) {
      messageData.userName = userData.name;
      messageData.phone = userData.phone;
    }

    return messageData;
  }
  return null;
};

export const getAllMessages = async () => {
  const docRef = collection(db, "messages");
  const docSnap = await getDocs(docRef);
  const messages = docSnap.docs.map((doc) => doc.data());

  messages.forEach(async (message, index) => {
    message.uid = docSnap.docs[index].id;
    message.sentDate = message.sentDate.toDate().toLocaleString();
    
    console.log(message.isRead);
    // Join on the users table to retrieve user name and phone
    const userData = await getUserData(message.uid);
    if (userData) {
      message.userName = userData.name;
      message.phone = userData.phone;
    }
  });

  return messages;
};

export const getNumberOfUnreadMessages = async () => {
  const docRef = collection(db, "messages");
  const docSnap = await getDocs(docRef);
  const messages = docSnap.docs.map((doc) => doc.data());

  const unreadMessages = messages.filter((message) => !message.isRead);

  return unreadMessages.length;
};
