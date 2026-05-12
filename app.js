import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUEFs2B_3ylxAG70t04ClOVfByurXmUK8", // Твой ключ со скрина
  authDomain: "rennigame.firebaseapp.com",
  databaseURL: "https://rennigame-default-rtdb.europe-west1.firebasedatabase.app", // Ссылка из твоей БД
  projectId: "rennigame",
  storageBucket: "rennigame.firebasestorage.app",
  messagingSenderId: "849888890806",
  appId: "1:849888890806:web:9956c6eb4252197d47b17"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Элементы интерфейса
const loginBtn = document.getElementById('login-btn');
const starsDisplay = document.getElementById('stars-count');

// Вход в систему
loginBtn.onclick = () => signInWithPopup(auth, provider);

// Следим за состоянием игрока
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    loadUserData(user.uid);
  }
});

// Загрузка данных игрока
async function loadUserData(uid) {
  const userRef = ref(db, 'users/' + uid);
  const snapshot = await get(userRef);
  
  if (snapshot.exists()) {
    starsDisplay.innerText = snapshot.val().stars || 0;
  } else {
    // Если новый игрок — создаем запись
    set(userRef, { stars: 0, completedTasks: [] });
  }
}
