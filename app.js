// Firebase v10+ Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config (paste your config here)
const firebaseConfig = {
  apiKey: "AIzaSyDZePQEZqIGmquwnM7m6VS10wK3d4Fy3po",
  authDomain: "water-pot-tracker.firebaseapp.com",
  projectId: "water-pot-tracker",
  storageBucket: "water-pot-tracker.firebasestorage.app",
  messagingSenderId: "701527837249",
  appId: "1:701527837249:web:0f7b594891455e350294c0",
  measurementId: "G-WL94X6DP4Z"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const docRef = doc(db, "tracker", "pot");

let members = [], history = [];

// Populate user dropdown
function populateDropdown() {
  const sel = document.getElementById("memberSelect");
  sel.innerHTML = `<option value=\"\" disabled selected>Select your name</option>`;
  members.forEach(name => sel.add(new Option(name, name)));
}

// Render round history table
function renderHistory() {
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = "";
  history.forEach(entry => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${entry.name}</td><td>${new Date(entry.timestamp).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });
}

// Load or initialize Firestore data
async function loadData() {
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    members = ["Person A","Person B","Person C","Person D","Person E"];
    history = [];
    await setDoc(docRef, { members, history, lastFilledBy: "None", timestamp: 0, nextTurn: members[0] });
  } else {
    const data = snap.data();
    members = data.members;
    history = data.history || [];
    if (history.length >= members.length) {
      history = [];
      await updateDoc(docRef, { history });
    }
  }

  const data = (await getDoc(docRef)).data();
  document.getElementById("lastFilled").innerText =
    `Last filled by: ${data.lastFilledBy} at ${new Date(data.timestamp).toLocaleString()}`;
  document.getElementById("nextTurn").innerText = `Next turn: ${data.nextTurn}`;

  populateDropdown();
  renderHistory();
}

// Handle fill action
async function markFilled() {
  const name = document.getElementById("memberSelect").value;
  if (!name) return alert("Select your name");
  if (history.some(e => e.name === name)) return alert(`${name} has already filled this round.`);

  history.push({ name, timestamp: Date.now() });
  const remaining = members.filter(m => !history.some(e => e.name === m));
  const nextTurn = remaining[0] || members[0];

  await updateDoc(docRef, {
    lastFilledBy: name,
    timestamp: Date.now(),
    nextTurn,
    history
  });

  loadData();
}

// Expose for inline onclicks and initialize
window.markFilled = markFilled;
window.addEventListener('DOMContentLoaded', loadData);