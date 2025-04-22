// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCNtRTYbVYA9sT_-aBiZMFCJtyFeRkKn_U",
  authDomain: "waterpot-tracker-51832.firebaseapp.com",
  projectId: "waterpot-tracker-51832",
  storageBucket: "waterpot-tracker-51832.firebasestorage.app",
  messagingSenderId: "228325247686",
  appId: "1:228325247686:web:0d1040c88f61b385b1e5c7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const docRef = db.collection("tracker").doc("pot");

async function loadData() {
  const doc = await docRef.get();
  if (doc.exists) {
    const data = doc.data();
    document.getElementById("lastFilled").innerText = `Last filled by: ${data.lastFilledBy} at ${new Date(data.timestamp).toLocaleString()}`;
    document.getElementById("nextTurn").innerText = `Next turn: ${data.nextTurn}`;
  } else {
    await docRef.set({ lastFilledBy: "None", timestamp: Date.now(), nextTurn: "Person A" });
  }
}
loadData();

async function markFilled() {
  const name = document.getElementById("nameInput").value.trim();
  if (!name) return alert("Please enter your name");

  const doc = await docRef.get();
  let next;
  const order = ["Person A", "Person B", "Person C", "Person D", "Person E"];
  const currentIndex = order.indexOf(name);
  next = order[(currentIndex + 1) % order.length];

  await docRef.set({
    lastFilledBy: name,
    timestamp: Date.now(),
    nextTurn: next
  });

  loadData();
}
