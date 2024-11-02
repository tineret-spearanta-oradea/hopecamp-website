import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getApps } from "firebase/app";

const db = getFirestore(getApps()[0]);

export async function getUserData(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
