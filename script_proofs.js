// --------------------
// Firebase Config
// --------------------
const firebaseConfig = {
  apiKey: "AIzaSyC7eHggBdYQL5cw9uNtgDT-SPCxgQbJPko",
  authDomain: "project1-2d8c8.firebaseapp.com",
  projectId: "project1-2d8c8",
  storageBucket: "project1-2d8c8.firebasestorage.app",
  messagingSenderId: "968474886137",
  appId: "1:968474886137:web:794a36114ecf18d7d8c728",
  measurementId: "G-TED8VLZ8TV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ------------------------------
// Helper functions to mask sensitive info
// ------------------------------
function maskEmail(email) {
  if (!email || !email.includes("@")) return email || "N/A";
  const [name, domain] = email.split("@");
  const parts = name.split(/[\._-]/); // split by dot/underscore/hyphen
  let maskedName = parts[0] + "XXXXXXX"; // keep first part + mask
  return maskedName + "@" + domain;
}

function maskPaymentMethod(payment) {
  if (!payment) return "N/A";
  const type = payment.split(":")[0]; // take only before colon
  return type;
}

// ------------------------------
// Load only SUCCESS withdrawals
// ------------------------------
function loadSuccessfulWithdrawals() {
  const container = document.getElementById("paymentProofs");

  if (!container) {
    console.error("Container #paymentProofs not found.");
    return;
  }

  container.innerHTML = "Loading...";

  db.collection("withdrawalRequests")
    .where("status", "==", "success")
    .orderBy("requestedAt", "desc")
    .get()
    .then(snapshot => {
      container.innerHTML = "";

      if (snapshot.empty) {
        container.innerHTML = "<p>No successful withdrawals yet.</p>";
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();

        const box = document.createElement("div");
        box.className = "proof-box";

        box.innerHTML = `
          <p><b>Transaction ID:</b> ${data.transactionId || 'N/A'}</p>
          <p><b>Email:</b> ${maskEmail(data.email)}</p>
          <p><b>Amount:</b> ${data.amount || 0} ${data.currency || ''}</p>
          <p><b>Payment Method:</b> ${maskPaymentMethod(data.paymentMethod)}</p>
          <p><b>Status:</b> ${data.status || 'N/A'}</p>
          <p><b>Remark:</b> ${data.remark || "None"}</p>
          <p><b>Requested At:</b> ${data.requestedAt ? data.requestedAt.toDate() : 'N/A'}</p>
        `;

        container.appendChild(box);
      });
    })
    .catch(err => {
      container.innerHTML = "Error loading withdrawals.";
      console.error("Firestore error:", err);
    });
}

window.addEventListener('DOMContentLoaded', loadSuccessfulWithdrawals);
