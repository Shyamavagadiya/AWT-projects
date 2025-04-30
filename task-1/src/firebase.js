// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcYtgdTSRbR5U583BYTO8EUMkwqmyYhNM",
  authDomain: "awt-1-bcc94.firebaseapp.com",
  projectId: "awt-1-bcc94",
  storageBucket: "awt-1-bcc94.appspot.com",
  messagingSenderId: "354479235190",
  appId: "1:354479235190:web:967263277141d1f668ff57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };