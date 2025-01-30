import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

            // تحديث عرض اسم المستخدم والنقاط
            document.getElementById("username").textContent = userData.username || username;
            document.getElementById("points").textContent = userData.points || 0;

            // بدء شريط التقدم
            startProgress(userData.points || 0, userRef);
        } else {
            // 🆕 المستخدم جديد، منحه 5 نقاط
            console.log("🚀 مستخدم جديد! يتم منحه 5 نقاط.");

            await setDoc(userRef, {
                username: username,
                points: 5
            });

            document.getElementById("username").textContent = username;
            document.getElementById("points").textContent = 5;

            // بدء شريط التقدم
            startProgress(5, userRef);
        }
    }

    checkAndCreateUser(userId, username);
} else {
    console.log("تعذر الحصول على بيانات المستخدم من Telegram.");
}

// بدء شريط التقدم
function startProgress(initialPoints, userRef) {
    let progress = 0;
    const progressBar = document.getElementById("mining-progress");
    const progressText = document.getElementById("progress-text");

    // تحديث النص في البداية
    progressText.textContent = `${progress} / 100`;

    // تحديد الوقت الكامل لملء شريط التقدم (مثلاً 10 ثواني)
    const progressInterval = setInterval(() => {
        progress += 1;
        const progressPercentage = (progress / 100) * 100;

        // تحديث شريط التقدم
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progress} / 100`;

        // عند اكتمال التقدم
        if (progress >= 100) {
            clearInterval(progressInterval);

            // عرض زر CLAIM
            document.getElementById("claim-btn").classList.remove("hidden");
        }
    }, 100); // كل 100 ميللي ثانية سيتم تحديث شريط التقدم
}

// وظيفة سحب النقاط عند الضغط على زر CLAIM
async function claimReward() {
    const userId = window.Telegram.WebApp.initDataUnsafe?.user.id.toString();
    const userRef = doc(db, "users", userId);

    // جلب النقاط الحالية للمستخدم
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentPoints = userData.points;

        // إضافة النقاط إلى رصيد المستخدم
        await updateUserPoints(userRef, currentPoints + 5);

        // إخفاء زر CLAIM بعد السحب
        document.getElementById("claim-btn").classList.add("hidden");

        // إعادة تعيين شريط التقدم
        resetProgress();
    }
}

// تحديث النقاط في قاعدة البيانات
async function updateUserPoints(userRef, newPoints) {
    await updateDoc(userRef, {
        points: newPoints
    });
    document.getElementById("points").textContent = newPoints; // تحديث عدد النقاط في الصفحة
}

// إعادة تعيين شريط التقدم
function resetProgress() {
    const progressBar = document.getElementById("mining-progress");
    const progressText = document.getElementById("progress-text");

    progressBar.style.width = "0%";
    progressText.textContent = "0 / 100";
}

// إخفاء شاشة التحميل بعد 2 ثانية وعرض المحتوى
window.addEventListener("load", function() {
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').classList.remove('hidden');
    }, 2000);
});
