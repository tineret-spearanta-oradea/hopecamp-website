import { createUserWithEmailAndPassword, GoogleAuthProvider, SignInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return SignInWithEmailAndPassword(auth, email, password);
};

// export const doSignInWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     // result.user
//     return result
// };

export const doSignOut = () => {
    return auth.SignOut();
};

// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// }

// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password);
// }

// export const doSendEmailVerification = (email) => {
//     return SendEmailVerification(auth.currentUser, password, {
//         url: `${window.location.origin}/home`,
//     });
// }