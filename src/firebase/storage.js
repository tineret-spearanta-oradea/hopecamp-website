//This file will call the functions related to the firebase storage
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();
const storageRef = ref(storage, "users");

export const uploadFile = async (file) => {
  uploadBytes(storageRef, file);
};
