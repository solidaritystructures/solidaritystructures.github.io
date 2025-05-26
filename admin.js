// admin.js
import app from './firebaseConfig.js';
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Initialize Firebase services using the shared app instance
const auth = getAuth(app);
const db = getFirestore(app);

// Set authentication persistence
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Persistence setting error:", error);
});

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadQuotes();
  } else {
    window.location.href = "login.html";
  }
});

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout error:", error);
    });
});

// Inactivity auto-logout
(function inactivityTime() {
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
})();

// Function to load quotes from Firestore
async function loadQuotes() {
  const quoteList = document.getElementById("quote-list");
  quoteList.innerHTML = "Loading...";

  try {
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

    // Add event listeners to save buttons
    document.querySelectorAll(".save-btn").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.getAttribute("data-id");
        const status = document.querySelector(`select[data-id='${id}']`).value;
        const notes = document.querySelector(`textarea[data-id='${id}']`).value;

        await updateDoc(doc(db, "drywall quotes", id), {
          status,
          adminNotes: notes
        });

        alert("Quote updated successfully.");
      });
    });
  } catch (error) {
    console.error("Error loading quotes:", error);
    quoteList.innerHTML = "Failed to load quotes.";
  }
}
