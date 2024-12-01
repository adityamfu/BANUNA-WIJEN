import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyA2quhT9YlKH34xCj26Wazqn8HW-4oChpo",
    authDomain: "banuna-wijen-official-dev.firebaseapp.com",
    databaseURL: "https://banuna-wijen-official-dev-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "banuna-wijen-official-dev",
    storageBucket: "banuna-wijen-official-dev.firebasestorage.app",
    messagingSenderId: "109181040136",
    appId: "1:109181040136:web:169755049669e9f0d503bd"
};

// Initialize Firebase
// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Ekspor instance Firebase
export { app, database };

