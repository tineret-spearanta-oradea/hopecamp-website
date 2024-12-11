import { db } from "./config";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { FormData } from "@/types/form";
import { DocumentData } from "firebase/firestore";
import { Message } from "@/types/message";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

const slopeActivityMap: Record<string, string> = {
  no: "nu",
  visit: "vizita",
  ski: "schi",
  sled: "sanie",
};

export const createUserDocument = async (
  uid: string,
  formData: FormData,
  imageUrl: string
) => {
  try {
    const userDoc = {
      uid,
      email: formData.authData.email,
      name: formData.userData.name,
      age: formData.userData.age,
      phone: formData.userData.phone,
      church:
        formData.userData.church === "alta"
          ? formData.userData.churchOther
          : formData.userData.church,
      churchContact: formData.userData.churchContact || "",
      payTaxTo: formData.userData.payTaxTo,
      transport: formData.userData.transport,
      preferences: formData.userData.preferences,
      startDate: formData.userData.startDate,
      endDate: formData.userData.endDate,
      imageUrl: formData.userData.imageUrl,
      slopeActivity: slopeActivityMap[formData.userData.slopeActivity] || "nu",
      createdAt: new Date(),
      updatedAt: new Date(),
      isConfirmed: false,
      isAdmin: false,
      isSuperAdmin: false,
      amountPaid: 0,
      withFamilyMember: false,
    };

    await setDoc(doc(db, "users", uid), userDoc);
    return userDoc;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserMessages = async (userId: string): Promise<Message[]> => {
  const messagesRef = collection(db, "messages");

  try {
    const q = query(
      messagesRef,
      where("userId", "==", userId),
      orderBy("sentDate", "desc")
    );

    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        userId: data.userId,
        userName: data.userName,
        phone: data.phone,
        text: data.text,
        sentDate: data.sentDate.toDate(),
        isRead: data.isRead,
      });
    });

    return messages;
  } catch (error: any) {
    if (error.code === "failed-precondition") {
      // If index doesn't exist, fall back to client-side sorting
      const q = query(messagesRef, where("userId", "==", userId));

      const querySnapshot = await getDocs(q);
      const messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          phone: data.phone,
          text: data.text,
          sentDate: data.sentDate.toDate(),
          isRead: data.isRead,
        });
      });

      return messages.sort(
        (a, b) => b.sentDate.getTime() - a.sentDate.getTime()
      );
    }
    console.error("Error fetching user messages:", error);
    return [];
  }
};
