// Each individual file e.g. auth.js, will have their own functions
// This file will manage the functions from the individual files
// Maybe this will not be needed, but for now, I will write the first version of it

import { doCreateUserWithEmailAndPassword } from "./auth";
import { writeUserData } from "./database";
import UserData from "../models/UserData";

// const formData = new UserData();

export const registerAndCreateUser = async (formData) => {
  // var userData = new UserData();
  // userData = formData;
  // console.log(typeof userData);
  // console.log(typeof formData);
  await doCreateUserWithEmailAndPassword(
    formData["email"],
    formData["password"]
  ).then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    formData["uid"] = user.uid;
    writeUserData(formData);
  });
};
//TODO: I can delete the user in the auth system if the user creation fails
