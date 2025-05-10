// Firebase v10+ Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZePQEZqIGmquwnM7m6VS10wK3d4Fy3po",
  authDomain: "water-pot-tracker.firebaseapp.com",
  projectId: "water-pot-tracker",
  storageBucket: "water-pot-tracker.firebasestorage.app",
  messagingSenderId: "701527837249",
  appId: "1:701527837249:web:0f7b594891455e350294c0",
  measurementId: "G-WL94X6DP4Z"
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
  try {
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
      await loadData(); // Recursive call after initialization
    }
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load data. Please try again.");
  }
}

// Handle button click
async function markFilled() {
  const select = document.getElementById("memberSelect");
  const name = select.value;
  if (!name) return alert("Please select your name");

  try {
    const currentIndex = members.indexOf(name);
    const next = members[(currentIndex + 1) % members.length];

    await setDoc(docRef, {
      lastFilledBy: name,
      timestamp: Date.now(),
      nextTurn: next
    });

    select.value = ""; // Reset dropdown to default
    await loadData();
  } catch (error) {
    console.error("Error updating data:", error);
    alert("Failed to update. Please try again.");
  }
}

// Init
window.onload = () => {
  populateDropdown();
  loadData();
  document.getElementById("fillButton").addEventListener("click", markFilled);
};