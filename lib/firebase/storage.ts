/* eslint-disable @typescript-eslint/no-explicit-any */
import { storage } from "./config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  StorageReference,
} from "firebase/storage";

export const uploadImage = async (uid: string, imageFile: File) => {
  try {
    const storageRef: StorageReference = ref(storage, `user-photos/${uid}`);
    await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
