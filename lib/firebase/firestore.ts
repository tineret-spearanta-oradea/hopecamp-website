import { db } from "./config";
import { doc, setDoc } from "firebase/firestore";
import { FormData } from "@/types/form";
import { DocumentData } from "firebase/firestore";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
      church: formData.userData.church,
      payTaxTo: formData.userData.payTaxTo,
      transport: formData.userData.transport,
      preferences: formData.userData.preferences,
      startDate: formData.userData.startDate,
      endDate: formData.userData.endDate,
      imageUrl,
      signupDate: new Date(),
      isConfirmed: false,
      isAdmin: false,
      isSuperAdmin: false,
    };

    await setDoc(doc(db, "users", uid), userDoc);
    return userDoc;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
