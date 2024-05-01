import {
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase-config";

//TODO: change the naming. Shouldn't have "do" in the name
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result;
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result;
};

export const doSignOut = async () => {
  await signOut(auth);
};

export const doDeleteAuthUser = async () => {
  const user = auth.currentUser;
  await deleteUser(user);
};

export const doPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = async (password) => {
  await updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = async (email) => {
  await sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
