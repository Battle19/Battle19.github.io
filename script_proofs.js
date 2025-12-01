<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Payment Proofs</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background: #f5f5f5;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
    }
    #paymentProofs {
      max-width: 800px;
      margin: 0 auto;
    }
    .proof-box {
      background: #fff;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .proof-box p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <h1>Payment Proofs (Read-only)</h1>
  <div id="paymentProofs">Loading data...</div>

  <!-- Firebase SDK -->
  <script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore-compat.js"></script>

  <!-- Script to load withdrawals -->
  <script>
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
              <p><b>Transaction ID:</b> ${data.transactionId || "N/A"}</p>
              <p><b>Email:</b> ${data.email || "N/A"}</p>
              <p><b>Amount:</b> ${data.amount || "0"} ${data.currency || ""}</p>
              <p><b>Payment Method:</b> ${data.paymentMethod || "N/A"}</p>
              <p><b>Status:</b> ${data.status || "N/A"}</p>
              <p><b>Remark:</b> ${data.remark || "None"}</p>
              <p><b>Requested At:</b> ${data.requestedAt?.toDate() || "N/A"}</p>
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
  </script>
</body>
</html>
