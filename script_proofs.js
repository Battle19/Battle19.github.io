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
// Load only SUCCESS withdrawals
// ------------------------------
function loadSuccessfulWithdrawals() {

  const container = document.getElementById("paymentProofs");
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
          <p><b>Transaction ID:</b> ${data.transactionId}</p>
          <p><b>Email:</b> ${data.email}</p>
          <p><b>Amount:</b> ${data.amount} ${data.currency}</p>
          <p><b>Payment Method:</b> ${data.paymentMethod}</p>
          <p><b>Status:</b> ${data.status}</p>
          <p><b>Remark:</b> ${data.remark || "None"}</p>
          <p><b>Requested At:</b> ${data.requestedAt?.toDate()}</p>
        `;

        container.appendChild(box);
      });
    })
    .catch(err => {
      container.innerHTML = "Error loading: " + err;
      console.error(err);
    });
}

window.onload = loadSuccessfulWithdrawals;
