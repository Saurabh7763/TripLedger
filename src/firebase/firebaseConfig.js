import { initializeApp } from "firebase/app";
import {collection, getFirestore} from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDKPzog8_jcsTXn6b0P04APuNpAWtUmbA",
  authDomain: "tripledger-9835b.firebaseapp.com",
  projectId: "tripledger-9835b",
  storageBucket: "tripledger-9835b.firebasestorage.app",
  messagingSenderId: "932083352411",
  appId: "1:932083352411:web:2e39a1776e0e9de8b3d07e"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app) ;
export const auth = getAuth(app)
export const tripsRef = collection(db, 'trips')
export const expensesRef = collection(db, 'expenses')

export default app;