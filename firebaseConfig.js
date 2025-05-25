// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcrM0217k_SdkavllQSQ01q0ckS0H9en0",
  authDomain: "proxiclass.firebaseapp.com",
  projectId: "proxiclass",
  storageBucket: "proxiclass.firebasestorage.app",
  messagingSenderId: "240001721167",
  appId: "1:240001721167:web:e96d304f44f749966e1b3a",
  measurementId: "G-K1PWF2S60X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
export { db };