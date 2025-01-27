import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 🔹 إعداد Firebase
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 جلب بيانات المستخدم من Telegram
window.Telegram.WebApp.ready();
const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

if (tgUser) {
    const userId = tgUser.id.toString(); // معرف المستخدم في تيليجرام

    console.log("User ID:", userId);

    // 🔹 البحث عن المستخدم في Firebase
    async function fetchUserData(userId) {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log("بيانات المستخدم:", userData);

            document.getElementById("username").textContent = userData.username || tgUser.first_name;
            document.getElementById("points").textContent = userData.points || 0;
        } else {
            console.log("⚠️ المستخدم غير موجود في قاعدة البيانات.");
            document.getElementById("username").textContent = tgUser.first_name;
            document.getElementById("points").textContent = "غير مسجل";
        }
    }

    fetchUserData(userId);
} else {
    console.log("تعذر الحصول على بيانات المستخدم من Telegram.");
}
