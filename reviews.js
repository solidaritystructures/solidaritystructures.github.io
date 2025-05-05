import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPsK0xs5j7RpA2t8JbC0Wi3xZ2xyuYztQ",
  authDomain: "solidarity-structures-3b7d9.firebaseapp.com",
  projectId: "solidarity-structures-3b7d9",
  storageBucket: "solidarity-structures-3b7d9.firebasestorage.app",
  messagingSenderId: "16596536591",
  appId: "1:16596536591:web:15612e3d701fb695c6827a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

document.getElementById("login-btn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    alert("Welcome " + result.user.displayName);
    document.getElementById("review-form").style.display = "block";
  } catch (err) {
    console.error("Login error", err);
  }
});

document.getElementById("submit-review").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  try {
    await addDoc(collection(db, "reviews"), { name, message, timestamp: new Date() });
    alert("Review submitted!");
  } catch (err) {
    console.error("Error submitting review:", err);
  }
});
