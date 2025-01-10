import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC59Syrl04sY7E1zmJW_jFs1m5I7rHORB4",
  authDomain: "planego-696d3.firebaseapp.com",
  projectId: "planego-696d3",
  storageBucket: "planego-696d3.appspot.com",
  messagingSenderId: "688748545967",
  appId: "1:688748545967:web:1f241fc72beafe9ed3915a"
};

// Instance principale de Firebase pour l'application
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Instance séparée pour la création d'utilisateurs
export const userCreationApp = initializeApp(firebaseConfig, 'userCreation');
export const userCreationAuth = getAuth(userCreationApp);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Persistence disabled: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Persistence not supported by browser');
  }
});

export const SYSTEM_ADMIN_EMAIL = 'secretariatrd@h24scm.com';