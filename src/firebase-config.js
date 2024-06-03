// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTJIzPxNfNvxckND7Ma4cMfvNpdu9oJgY",
  authDomain: "nusreviews-78805.firebaseapp.com",
  projectId: "nusreviews-78805",
  storageBucket: "nusreviews-78805.appspot.com",
  messagingSenderId: "1064000299331",
  appId: "1:1064000299331:web:16e98d63bd11ea02218ff6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };