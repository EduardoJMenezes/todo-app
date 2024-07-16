// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2GzMYkDnxudOfnilJaPAa9Xe7k1Pab2M",
  authDomain: "firestreamapp-9d296.firebaseapp.com",
  projectId: "firestreamapp-9d296",
  storageBucket: "firestreamapp-9d296.appspot.com",
  messagingSenderId: "922934519924",
  appId: "1:922934519924:web:a1441e771c2e6cfbb04921"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig)
export const FIRESTORE_DB = getFirestore(FIREBASE_APP)
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)

