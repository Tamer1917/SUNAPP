import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 🔹 إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBrfHwGulQyWW36LodXqNbcPtvV2J1wk8U",
    authDomain: "sunapp-85501.firebaseapp.com",
    projectId: "sunapp-85501",
    storageBucket: "sunapp-85501.firebasestorage.app",
    messagingSenderId: "146439638941",
    appId: "1:146439638941:web:abef499250246650c6e974"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 جلب بيانات المستخدم من Telegram
window.Telegram.WebApp.ready();
const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

if (tgUser) {
    const userId = tgUser.id.toString();
    const username = tgUser.first_name;

    console.log("User ID:", userId);
    console.log("First Name:", username);

    async function checkAndCreateUser(userId, username) {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            // 🔹 المستخدم موجود، جلب بياناته
            const userData = userSnap.data();
            console.log("المستخدم موجود:", userData);

            document.getElementById("username").textContent = userData.username || username;
            document.getElementById("points").textContent = userData.points || 0;
        } else {
            // 🆕 المستخدم جديد، منحه 5 نقاط
            console.log("🚀 مستخدم جديد! يتم منحه 5 نقاط.");

            await setDoc(userRef, {
                username: username,
                points: 5
            });

            document.getElementById("username").textContent = username;
            document.getElementById("points").textContent = 5;
        }
    }

    checkAndCreateUser(userId, username);
} else {
    console.log("تعذر الحصول على بيانات المستخدم من Telegram.");
}
