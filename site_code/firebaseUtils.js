import { use } from "express/lib/application";
import { initializeApp } from "firebase/app"
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, set } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyCvWFB27eewjZtKwlEk4F0qvMm6nn2uoGY",
    authDomain: "hand-recognition-a7ca9.firebaseapp.com",
    projectId: "hand-recognition-a7ca9",
    storageBucket: "hand-recognition-a7ca9.firebasestorage.app",
    messagingSenderId: "864510647675",
    appId: "1:864510647675:web:60cd762ff6ecafd10631de",
  };

const app = initializeApp(firebaseConfig)
export default app;

export const auth = getAuth()

export const curruser="temp";

onAuthStateChanged(auth, (user)=>{curruser =user })

export const doSignOut = () => signOut(auth)

export const authStateChange = (func) => onAuthStateChanged(auth, func)

export const getdb = getDatabase() 

// Sign up with email and password
export const signUpWithEmailPassword = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};


// Sign in with email and password
export const signInWithEmailPassword = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const setUserDir = (path, val) => {
    const userRef = ref(getdb, path);
    set(userRef,val)
}