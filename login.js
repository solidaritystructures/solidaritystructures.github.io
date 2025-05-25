// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPsK0xs5j7RpA2t8JbC0Wi3xZ2xyuYztQ",
  authDomain: "solidarity-structures-3b7d9.firebaseapp.com",
  projectId: "solidarity-structures-3b7d9",
  storageBucket: "solidarity-structures-3b7d9.appspot.com",
  messagingSenderId: "16596536591",
  appId: "1:16596536591:web:15612e3d701fb695c6827a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin.html";
  } catch (error) {
    alert("Login failed: " + error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "admin.html";
  }
});
