// Firebase v10+ Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCNtRTYbVYA9sT_-aBiZMFCJtyFeRkKn_U",
  authDomain: "waterpot-tracker-51832.firebaseapp.com",
  projectId: "waterpot-tracker-51832",
  storageBucket: "waterpot-tracker-51832.appspot.com",
  messagingSenderId: "228325247686",
  appId: "1:228325247686:web:0d1040c88f61b385b1e5c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "tracker", "pot");

const members = ["Person A", "Person B", "Person C", "Person D", "Person E"];

// Populate dropdown
function populateDropdown() {
  const select = document.getElementById("memberSelect");
  members.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.text = name;
    select.appendChild(option);
  });
}

// Load data from Firestore
async function loadData() {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("lastFilled").innerText =
      `Last filled by: ${data.lastFilledBy} at ${new Date(data.timestamp).toLocaleString()}`;
    document.getElementById("nextTurn").innerText = `Next turn: ${data.nextTurn}`;
  } else {
    await setDoc(docRef, {
      lastFilledBy: "None",
      timestamp: Date.now(),
      nextTurn: members[0]
    });
    loadData();
  }
}

// Handle button click
async function markFilled() {
  const name = document.getElementById("memberSelect").value;
  if (!name) return alert("Please select your name");

  const currentIndex = members.indexOf(name);
  const next = members[(currentIndex + 1) % members.length];

  await setDoc(docRef, {
    lastFilledBy: name,
    timestamp: Date.now(),
    nextTurn: next
  });

  loadData();
}

// Init
window.onload = () => {
  populateDropdown();
  loadData();
};
