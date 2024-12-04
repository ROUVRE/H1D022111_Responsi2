// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCC-0VO5W9xpqI9NqjnJRBJ5ENqyV8wZk0",
  authDomain: "fir-responsi2.firebaseapp.com",
  projectId: "fir-responsi2",
  storageBucket: "fir-responsi2.firebasestorage.app",
  messagingSenderId: "703896525646",
  appId: "1:703896525646:web:5f882cc06c9be3500b9c1f",
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };
