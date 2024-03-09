// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJr8sPcjmq1F8hnlz6lbspDMlfDPj3pDU",
  authDomain: "vender-bc1c4.firebaseapp.com",
  projectId: "vender-bc1c4",
  storageBucket: "vender-bc1c4.appspot.com",
  messagingSenderId: "1089525053487",
  appId: "1:1089525053487:web:f2db7d33f26f45c2482eda",
  measurementId: "G-2EE760TCZF"
};

const app = initializeApp(firebaseConfig);

export const database = getFirestore();
export const realtimeDB = getDatabase(app);
export const storage = getStorage();
export const authentication = getAuth(app);