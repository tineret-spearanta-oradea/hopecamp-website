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

export const uploadImageAndGetUrl = async (
  file,
  uid,
  email = null,
  name = null,
  folder = "users"
) => {
  try {
    let imageRef;
    if (folder === "users") {
      const usersRef = ref(storage, "users");
      imageRef = ref(usersRef, uid + ".jpg"); // add .jpg to the end of the filename
    } else {
      const daysRef = ref(storage, `days/${folder}`);
      imageRef = ref(daysRef, uid + ".jpg");
    }
    const snapshot = await uploadBytes(imageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    await updateMetadataForImage(imageRef, email, name);

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
