import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, get, update, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUEFs2B_3ylxAG70t04ClOVfByurXmUK8",
  authDomain: "rennigame.firebaseapp.com",
  databaseURL: "https://rennigame-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rennigame",
  storageBucket: "rennigame.firebasestorage.app",
  messagingSenderId: "849888890806",
  appId: "1:849888890806:web:9956c6eb4252197d47b17"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Ссылки на элементы UI
const starsDisplay = document.getElementById('stars-count');

// --- Функция начисления звёзд ---
async function completeTask(uid, reward) {
  const userRef = ref(db, 'users/' + uid);
  const snapshot = await get(userRef); [cite: 58]
  const currentStars = snapshot.exists() ? (snapshot.val().stars || 0) : 0;

  await update(userRef, {
    stars: currentStars + reward [cite: 59]
  });
  
  if(starsDisplay) starsDisplay.innerText = currentStars + reward; [cite: 59]
  alert("Задание выполнено! + " + reward + " ⭐");
}

// Делаем функцию доступной для кнопок в HTML (window.processTask)
window.processTask = (reward) => {
  const user = auth.currentUser; [cite: 57]
  if (user) {
    completeTask(user.uid, reward);
  } else {
    alert("Сначала войди в аккаунт!");
  }
};

// Логика входа
window.login = () => signInWithPopup(auth, provider);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Вошел как:", user.displayName);
    // Тут можно скрыть кнопку входа и показать баланс
  }
});
