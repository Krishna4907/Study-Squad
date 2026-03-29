// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCziLAwIbGnnruQ8dQiOaGPJf0YtE_TbL8",
  authDomain: "study-squad-c948d.firebaseapp.com",
  projectId: "study-squad-c948d",
  storageBucket: "study-squad-c948d.firebasestorage.app",
  messagingSenderId: "144543120182",
  appId: "1:144543120182:web:2ccb8a9918eaaa9ad61197"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
