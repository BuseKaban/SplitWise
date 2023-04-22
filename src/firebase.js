import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"



const firebaseConfig = {
  apiKey: "AIzaSyC89_HHCP1-It1WW7uARIq3tcH8hzuxBHk",
  authDomain: "split-82a23.firebaseapp.com",
  projectId: "split-82a23",
  storageBucket: "split-82a23.appspot.com",
  messagingSenderId: "612355658836",
  appId: "1:612355658836:web:08e5aab7ad1d36fbdb89c1",
  measurementId: "G-2CLXP31DG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)