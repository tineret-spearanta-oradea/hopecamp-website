// Each individual file e.g. auth.js, will have their own functions
// This file will manage the functions from the individual files
// Maybe this will not be needed, but for now, I will write the first version of it

import { doCreateUserWithEmailAndPassword, doDeleteAuthUser } from "./auth";
import { writeUserData, deleteUserData } from "./database";
import { uploadImageAndGetUrl } from "./storage";
import { contactInfo } from "../constants";
//TODO [Optional]: Log errors in a log file
//TODO: Instead of returning a message, throw an error and catch it in the component. Then, in the component, display the error message to the user.
export const registerAndCreateUser = async (formData, imageFile) => {
  const authData = formData.authData;
  const userData = formData.userData;
  userData["email"] = authData["email"];

  // Sanity check, but this should be checked at the form level
  if (authData["password"] !== authData["confirmPassword"]) {
    return {
      success: false,
      message: "Parola și confirmarea parolei nu sunt la fel!",
    };
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
      await doDeleteAuthUser().catch((deleteError) => {
        console.error("Error deleting auth user:", deleteError);
      });
      return { success: false, message: "Error creating user!" };
    }
  } catch (authError) {
    if (authError.code === "auth/email-already-in-use") {
      return {
        success: false,
        message:
          "Adresa de email este deja folosită! Te rugăm sa folosesti altă adresă de email",
      };
    }
    console.error("Error creating auth user:", authError);
    return {
      success: false,
      message: `Eroare de autentificare. ${authError.code}. \n Dacă problema persistă, te rugăm să ne contactezi la ${contactInfo.phone}.`,
    };
  }
};

export const deleteUserFromSystem = async (uid) => {
  try {
    // TODO: find a proper solution for this
    // await doDeleteAuthUser(); // this is not supported. right now we'll let the auth user be
    // await deleteUserData(uid);
  } catch (authError) {
    console.error("Error deleting auth user:", authError);
  }
};
