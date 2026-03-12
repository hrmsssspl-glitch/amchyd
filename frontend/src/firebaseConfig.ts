import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// IMPORTANT: Replace these with your own Firebase project configuration
// Go to https://console.firebase.google.com/, create a project, and copy the config.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase only if config is present (prevents crash on default)
// If you haven't set up Firebase, the app will degrade gracefully to localStorage
import { Database } from "firebase/database";

let app;
let database: Database | undefined;

try {
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        database = getDatabase(app);
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

export { database };
