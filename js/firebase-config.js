import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { performLogin } from "./data-controller.js";

const firebaseConfig = {
    apiKey: "AIzaSyDv-xso1RgJOKQjWjhfzaGY25vU0irZz5c",
    authDomain: "banuna-wijen-frozen.firebaseapp.com",
    databaseURL: "https://banuna-wijen-frozen-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "banuna-wijen-frozen",
    storageBucket: "banuna-wijen-frozen.firebasestorage.app",
    messagingSenderId: "219821145800",
    appId: "1:219821145800:web:480bbbc3e391d74ef92ffd",
};


// Initialize Firebase
// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
// Ekspor instance Firebase
export async function authLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.email);
        return { success: true, datauser: userCredential };
    } catch (error) {
        console.error(`Login Error: ${error.message}`);
        return { success: false };
    }
}
export function checkLogin() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
        } else {
            performLogin()
        }
    });
}

export async function authLogout() {
    try {
        await signOut(auth);
        console.log("Logout berhasil!");
        return { success: true, message: "Logout berhasil!" }; // Return berhasil
    } catch (error) {
        console.error(`Logout Error: ${error.message}`);
        return { success: false, message: error.message }; // Return gagal dengan pesan error
    }
}

export { app, database, auth };

