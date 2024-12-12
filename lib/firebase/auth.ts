/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "./config";
import { createUserWithEmailAndPassword, User } from "firebase/auth";

export const createUserAccount = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const currentUser: User | null = auth.currentUser;
