import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBItH44BiF0cVM3hAuhP0eQaeJZTk_jSY0",
  authDomain: "shotclock-38e59.firebaseapp.com",
  projectId: "shotclock-38e59",
  storageBucket: "shotclock-38e59.appspot.com",
  messagingSenderId: "872020447704",
  appId: "1:872020447704:web:6893c38068cf60ba9122ad",
  measurementId: "G-TFVLNYV7G1"
};
let app;
// if this firebase project has initialized apps
if (!firebase.apps.length)
{
    app = firebase.initializeApp(firebaseConfig)
}
const storage = getStorage(app);

export { firebase, storage };
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);