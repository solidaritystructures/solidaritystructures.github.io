// login.js

import app from './firebaseConfig.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set authentication persistence to local
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

// Reference to the login form
const loginForm = document.getElementById("login-form");

// Hide the login form initially
loginForm.style.display = "none";

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, redirect to admin dashboard
    window.location.href = "admin.html";
  } else {
    // No user is signed in, display the login form
    loginForm.style.display = "block";
  }
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Retrieve email and password inputs
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    // Sign in the user
    await signInWithEmailAndPassword(auth, email, password);
    // Redirect to admin dashboard upon successful login
    window.location.href = "admin.html";
  } catch (error) {
    // Display error message
    alert("Login failed: " + error.message);
  }
});
