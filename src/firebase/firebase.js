import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwUUICAR38G8M43QBSnCegzSkbYUGrQTU",
  authDomain: "hopecamp-69aa4.firebaseapp.com",
  projectId: "hopecamp-69aa4",
  storageBucket: "hopecamp-69aa4.appspot.com",
  messagingSenderId: "854377150009",
  appId: "1:854377150009:web:bcb2e26a3e5f202d59bfe8",
  measurementId: "G-JR0TC62DPH"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { app, auth }