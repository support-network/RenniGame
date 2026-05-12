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

// Инициализация
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const starsDisplay = document.getElementById('stars-count');

// Функция входа
window.login = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Ошибка входа:", error);
    alert("Ошибка при входе: " + error.message);
  }
};

// Начисление звёзд
async function completeTask(uid, reward) {
  const userRef = ref(db, 'users/' + uid);
  const snapshot = await get(userRef);
  const currentStars = snapshot.exists() ? (snapshot.val().stars || 0) : 0;

  await update(userRef, {
    stars: currentStars + reward
  });
  
  if (starsDisplay) starsDisplay.innerText = currentStars + reward;
  alert("Задание выполнено! + " + reward + " ⭐");
}

window.processTask = (reward) => {
  const user = auth.currentUser;
  if (user) {
    completeTask(user.uid, reward);
  } else {
    alert("Сначала войди в аккаунт!");
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Пользователь вошел:", user.displayName);
    const userRef = ref(db, 'users/' + user.uid);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        if (starsDisplay) starsDisplay.innerText = snapshot.val().stars || 0;
      } else {
        set(userRef, { stars: 0 });
      }
    });
  }
});
