// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGNOgSAP8I-ZtPosgMpmyZ0-nK5C8uA68",
  authDomain: "social-app-fa8b0.firebaseapp.com",
  projectId: "social-app-fa8b0",
  storageBucket: "social-app-fa8b0.appspot.com",
  messagingSenderId: "701865248051",
  appId: "1:701865248051:web:1b8e28afb6512b602f6a46",
  measurementId: "G-RKCDRERRHS"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage()

// const analytics = getAnalytics(app);

export { app, db, storage }