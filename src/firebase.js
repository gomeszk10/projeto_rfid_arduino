import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// (Opcional) import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB2BAfengQH_B0mKFynzVOGn77ugtbMIsc",
  authDomain: "projetoarduino-bb522.firebaseapp.com",
  projectId: "projetoarduino-bb522",
  storageBucket: "projetoarduino-bb522.appspot.com",
  messagingSenderId: "276470144376",
  appId: "1:276470144376:web:b7493185849e62206a3c8d",
  measurementId: "G-XJRLE5J0GG",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Realtime Database
const database = getDatabase(app);

// Exporte ambos, se necessário
export { app, database };