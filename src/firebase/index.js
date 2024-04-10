// Each individual file e.g. auth.js, will have their own functions
// This file will manage the functions from the individual files
// Maybe this will not be needed, but for now, I will write the first version of it

import { doCreateUserWithEmailAndPassword, doDeleteAuthUser } from "./auth";
import { writeUserData } from "./database";
import { uploadFile } from "./storage";

export const registerAndCreateUser = async (formData) => {
  const authData = formData.authData;
  const userData = formData.userData;
  userData["email"] = authData["email"];

  // Sanity check, but this should be checked at the form level
  if (authData["password"] !== authData["confirmPassword"]) {
    //TODO: Change alert with an UI error component
    alert("Passwords do not match");
    return;
  }

  try {
    const userCredential = await doCreateUserWithEmailAndPassword(
      authData["email"],
      authData["password"]
    );
    const user = userCredential.user;
    userData["uid"] = user.uid;

    try {
      try {
        await uploadFile(userData["imageFile"]);
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        //TODO: Log error
      }
      await writeUserData(userData);
    } catch (createError) {
      //TODO: Change alert with an UI error component
      alert("Error creating user!");
      console.error("Error creating user data:", createError);
      //TODO: Log error

      try {
        // Delete the user in the auth system if the user creation in db fails
        await doDeleteAuthUser();
      } catch (deleteError) {
        //TODO: Log error
        alert("Error creating user!");
        console.error("Error deleting auth user:", deleteError);
      }
    }
  } catch (authError) {
    //TODO: Log error
    //TODO: Change alert with an UI error component
    alert("Error creating user!");
    console.error("Error creating user data:", authError);
  }
};
