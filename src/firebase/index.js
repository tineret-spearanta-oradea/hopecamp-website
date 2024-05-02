// Each individual file e.g. auth.js, will have their own functions
// This file will manage the functions from the individual files
// Maybe this will not be needed, but for now, I will write the first version of it

import { doCreateUserWithEmailAndPassword, doDeleteAuthUser } from "./auth";
import { writeUserData } from "./database";
import { uploadImageAndGetUrl } from "./storage";

//TODO [Optional]: Log errors in a log file

export const registerAndCreateUser = async (formData, imageFile) => {
  const authData = formData.authData;
  const userData = formData.userData;
  userData["email"] = authData["email"];

  // Sanity check, but this should be checked at the form level
  if (authData["password"] !== authData["confirmPassword"]) {
    return { success: false, message: "Parola și confirmarea parolei nu sunt la fel!" };
  }

  try {
    const userCredential = await doCreateUserWithEmailAndPassword(
      authData["email"],
      authData["password"]
    );
    const user = userCredential.user;
    userData["uid"] = user.uid;

    if (imageFile !== null) {
      try {
        const imageUrl = await uploadImageAndGetUrl(
          imageFile,
          userData["uid"],
          userData["email"],
          userData["name"]
        );
        userData["imageUrl"] = imageUrl;
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
      }
    }

    try {
      await writeUserData(userData);
      return { success: true };
    } catch (createError) {
      console.error("Error creating user data:", createError);
      await doDeleteAuthUser().catch(deleteError => {
        console.error("Error deleting auth user:", deleteError);
      });
      return { success: false, message: "Error creating user!" };
    }
  } catch (authError) {
    console.error("Error creating user data:", authError);
    return { success: false, message: "Error creating user!" };
  }
};
