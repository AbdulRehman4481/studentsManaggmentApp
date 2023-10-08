// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYGo1wCN_TxRIid9K3R4mtTDQr3CV5vNs",
  authDomain: "student-management-web-c0c5f.firebaseapp.com",
  projectId: "student-management-web-c0c5f",
  storageBucket: "student-management-web-c0c5f.appspot.com",
  messagingSenderId: "1030582666168",
  appId: "1:1030582666168:web:d2ec2f03a8247fda0f454d",
  measurementId: "G-HNVGNT8WK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { analytics,  firestore }
