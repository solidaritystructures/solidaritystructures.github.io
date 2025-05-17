import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 🔐 Replace with your actual Firebase config:
const firebaseConfig = {
  apiKey: "AIzaSyBPsK0xs5j7RpA2t8JbC0Wi3xZ2xyuYztQ",
  authDomain: "solidarity-structures-3b7d9.firebaseapp.com",
  projectId: "solidarity-structures-3b7d9",
  storageBucket: "solidarity-structures-3b7d9.firebasestorage.app",
  messagingSenderId: "16596536591",
  appId: "1:16596536591:web:15612e3d701fb695c6827a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById("quote-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const preferredDate = document.getElementById("preferredDate").value;
  const preferredTime = document.getElementById("preferredTime").value;
  const imageFile = document.getElementById("image").files[0];

  let imageUrl = "";

  try {
    // 🔼 Upload image if provided
    if (imageFile) {
      const storageRef = ref(storage, `quoteImages/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    // 🗂 Save data to Firestore
    await addDoc(collection(db, "drywall quotes"), {
      name,
      email,
      address,
      preferredDate,
      preferredTime,
      imageUrl,
      submittedAt: serverTimestamp()
    });

    // 📧 Send confirmation email
    emailjs.send("Yservice_12xanlm", "Ytemplate_6zhsxmc", {
      name,
      email,
      preferredDate,
      preferredTime,
    })
    .then(() => {
      alert("Your quote has been submitted and a confirmation email was sent.");
    })
    .catch((emailErr) => {
      console.error("EmailJS error:", emailErr);
      alert("Quote submitted, but email confirmation failed.");
    });

    document.getElementById("quote-form").reset();

  } catch (err) {
    console.error("Submission error:", err);
    alert("There was a problem submitting your quote. Please try again.");
  }
});
