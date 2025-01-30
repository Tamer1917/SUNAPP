import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

let progress = localStorage.getItem("progress") ? parseInt(localStorage.getItem("progress")) : 0;

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

            // تحديث العناصر في الصفحة
            document.getElementById("username").textContent = userData.username || username;
            document.getElementById("points").textContent = userData.points || 0;
        } else {
            // 🆕 المستخدم جديد، منحه 5 نقاط
            console.log("🚀 مستخدم جديد! يتم منحه 5 نقاط.");
            await setDoc(userRef, {
                username: username,
                points: 5
            });

            // تحديث العناصر في الصفحة
            document.getElementById("username").textContent = username;
            document.getElementById("points").textContent = 5;
        }
    }

    checkAndCreateUser(userId, username);

    // 🔹 تحديث التقدم
    function updateProgress() {
        if (progress < 100) {
            progress += 20;
            localStorage.setItem("progress", progress);
            document.getElementById("mining-progress").style.width = progress + "%";
            document.getElementById("progress-text").innerText = `${progress / 20} / 5`;
        }

        if (progress === 100) {
            document.getElementById("claim-btn").style.display = "block";
        }
    }

    // 🔹 تنفيذ CLAIM
    async function claimReward() {
        alert("🎉 تم استلام المكافأة!");

        // تحديث النقاط في Firebase
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const newPoints = userData.points + 5; // إضافة 5 نقاط للمستخدم
            await updateDoc(userRef, { points: newPoints });

            // تحديث النقاط في الصفحة
            document.getElementById("points").textContent = newPoints;
        }

        // إعادة تعيين التقدم
        progress = 0;
        document.getElementById("mining-progress").style.width = "0%";
        document.getElementById("progress-text").innerText = "0 / 5";
        localStorage.setItem("progress", progress);

        document.getElementById("claim-btn").style.display = "none";
    }

    // ربط الدالة مع الزر
    document.getElementById("claim-btn").onclick = claimReward;

    setInterval(updateProgress, 2000); // تحديث التقدم بشكل دوري
} else {
    console.log("تعذر الحصول على بيانات المستخدم من Telegram.");
}
