import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtbxNofigZaGBC8RV8MMnl2InJTCZddlI",
    authDomain: "vacaciones-gestion.firebaseapp.com",
    projectId: "vacaciones-gestion",
    storageBucket: "vacaciones-gestion.firebasestorage.app",
    messagingSenderId: "418774974188",
    appId: "1:418774974188:web:7ee8e5d68d1cb300742fc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
