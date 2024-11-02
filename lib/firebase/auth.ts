/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "./config";
import { createUserWithEmailAndPassword, User } from "firebase/auth";

export const createUserAccount = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const currentUser: User | null = auth.currentUser;
