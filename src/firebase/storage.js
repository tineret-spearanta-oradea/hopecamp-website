import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  updateMetadata,
  getMetadata,
} from "firebase/storage";

// This file will call the functions related to the Firebase Storage

const storage = getStorage();
const usersRef = ref(storage, "users");

export const uploadImageAndGetUrl = async (
  file,
  uid,
  email = null,
  name = null
) => {
  try {
    const imageRef = ref(usersRef, uid);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    updateMetadataForImage(imageRef, email, name);

    return downloadUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

const updateMetadataForImage = async (imageRef, email = null, name = null) => {
  try {
    const updatedMetadata = {
      contentType: "image/.*",
      customMetadata: {},
    };

    if (name || email) {
      if (name) {
        updatedMetadata.customMetadata.createdBy = name;
      }
      if (email) {
        updatedMetadata.customMetadata.createdByEmail = email;
      }
    }

    await updateMetadata(imageRef, updatedMetadata);
  } catch (error) {
    console.error("Error updating metadata:", error);
    return null;
  }
};
