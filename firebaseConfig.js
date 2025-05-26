// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

// 🔐 Replace with your actual Firebase config:
const firebaseConfig = {
  apiKey: "AIzaSyBPsK0xs5j7RpA2t8JbC0Wi3xZ2xyuYztQ",
  authDomain: "solidarity-structures-3b7d9.firebaseapp.com",
  projectId: "solidarity-structures-3b7d9",
  storageBucket: "solidarity-structures-3b7d9.appspot.com"
,
  messagingSenderId: "16596536591",
  appId: "1:16596536591:web:15612e3d701fb695c6827a"
};

const app = initializeApp(firebaseConfig);

export default app;
