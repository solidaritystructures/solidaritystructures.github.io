// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, proceed to load quotes
    loadQuotes();
  } else {
    // No user is signed in, redirect to login page
    window.location.href = "login.html";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
});

import { setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Persistence setting error:", error);
  });

let inactivityTime = function () {
  let time;
  const maxInactivity = 15 * 60 * 1000; // 15 minutes

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(() => {
      signOut(auth)
        .then(() => {
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Auto-logout error:", error);
        });
    }, maxInactivity);
  }

  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeypress = resetTimer;
  document.onclick = resetTimer;
  document.onscroll = resetTimer;
};

inactivityTime();

const firebaseConfig = {
  apiKey: "AIzaSyBPsK0xs5j7RpA2t8JbC0Wi3xZ2xyuYztQ",
  authDomain: "solidarity-structures-3b7d9.firebaseapp.com",
  projectId: "solidarity-structures-3b7d9",
  storageBucket: "solidarity-structures-3b7d9.appspot.com",
  messagingSenderId: "16596536591",
  appId: "1:16596536591:web:15612e3d701fb695c6827a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadQuotes() {
  const quoteList = document.getElementById("quote-list");
  quoteList.innerHTML = "Loading...";

  const querySnapshot = await getDocs(collection(db, "drywall quotes"));
  quoteList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "quote-entry";
    div.innerHTML = `
      <h3>${data.name}</h3>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Submitted At:</strong> ${data.submittedAt?.toDate().toLocaleString() || "N/A"}</p>
      <p><strong>Status:</strong> 
        <select data-id="${docSnap.id}" class="status-dropdown">
          ${["Submitted", "Reviewed", "Contacted", "Scheduled", "In Progress", "Completed", "Declined"].map(status => `
            <option value="${status}" ${data.status === status ? "selected" : ""}>${status}</option>
          `).join("")}
        </select>
      </p>
      <p><strong>Admin Notes:</strong></p>
      <textarea data-id="${docSnap.id}" class="admin-notes">${data.adminNotes || ""}</textarea>
      <button data-id="${docSnap.id}" class="save-btn">Save</button>
      <hr />
    `;

    quoteList.appendChild(div);
  });

  document.querySelectorAll(".save-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      const status = document.querySelector(`select[data-id='${id}']`).value;
      const notes = document.querySelector(`textarea[data-id='${id}']`).value;

      await updateDoc(doc(db, "drywall_quotes", id), {
        status,
        adminNotes: notes
      });

      alert("Quote updated successfully.");
    });
  });
}

loadQuotes();
