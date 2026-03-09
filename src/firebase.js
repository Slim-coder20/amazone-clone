// Imports //
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFireStore } from "firebase/firestore";

// Variables d'environnements de Firebase //
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};
// Initialisation de Firebase //
const app = initializeApp(firebaseConfig);

// Initialisation des services Firebase //
const auth = getAuth(app);
const db = getFireStore(app);

// Exportation des services Firebase //
export {auth, db, app }; 
