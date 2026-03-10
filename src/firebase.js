// Imports //
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Variables d'environnements de Firebase (Vite utilise import.meta.env) //
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};
// Initialisation de Firebase //
const app = initializeApp(firebaseConfig);

// Initialisation des services Firebase //
const auth = getAuth(app);
const db = getFirestore(app);

// Exportation des services Firebase //
export {auth, db, app }; 
