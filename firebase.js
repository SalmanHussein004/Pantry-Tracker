// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz4oJ8RtXR6htemm6--ZkxQiHe4EpNcyI",
  authDomain: "inventory-management-b80ce.firebaseapp.com",
  projectId: "inventory-management-b80ce",
  storageBucket: "inventory-management-b80ce.appspot.com",
  messagingSenderId: "21965207656",
  appId: "1:21965207656:web:d29c5223390d079db9e3dd",
  measurementId: "G-VBH05N6T2B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export{firestore}