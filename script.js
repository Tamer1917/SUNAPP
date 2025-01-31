import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// إعداد Firebase
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

// جلب بيانات المستخدم من Telegram
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
            const userData = userSnap.data();
            console.log("المستخدم موجود:", userData);

            document.getElementById("username").textContent = userData.username || username;
            document.getElementById("points").textContent = userData.points || 0;

            // بدء شريط التقدم
            startProgress(userRef);
        } else {
            console.log("🚀 مستخدم جديد! يتم منحه 5 نقاط.");

            await setDoc(userRef, {
                username: username,
                points: 5
            });

            document.getElementById("username").textContent = username;
            document.getElementById("points").textContent = 5;

            // بدء شريط التقدم
            startProgress(userRef);
        }
    }

    checkAndCreateUser(userId, username);
} else {
    console.log("تعذر الحصول على بيانات المستخدم من Telegram.");
}

// بدء شريط التقدم
function startProgress(userRef) {
    let progress = 0;
    const progressBar = document.getElementById("mining-progress");
    const progressText = document.getElementById("progress-text");
    progressText.textContent = `${progress} / 100`;

    const progressInterval = setInterval(() => {
        progress += 1;
        const progressPercentage = (progress / 100) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progress} / 100`;

        if (progress >= 100) {
            clearInterval(progressInterval);
            document.getElementById("claim-btn").style.display = "block";
        }
    }, 100);
}

// وظيفة سحب النقاط عند الضغط على زر CLAIM
async function claimReward() {
    const userId = window.Telegram.WebApp.initDataUnsafe?.user.id.toString();
    const userRef = doc(db, "users", userId);

    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const userData = userSnap.data();
        const newPoints = userData.points + 5;

        await updateDoc(userRef, { points: newPoints });
        document.getElementById("points").textContent = newPoints;
        document.getElementById("claim-btn").style.display = "none";

        resetProgress(userRef);
    } else {
        console.log("المستخدم غير موجود في قاعدة البيانات.");
    }
}

// إعادة تعيين شريط التقدم وبدء التعدين من جديد
function resetProgress(userRef) {
    const progressBar = document.getElementById("mining-progress");
    const progressText = document.getElementById("progress-text");

    progressBar.style.width = "0%";
    progressText.textContent = "0 / 100";

    setTimeout(() => {
        startProgress(userRef);
    }, 2000);
}

// إخفاء شاشة التحميل بعد 2 ثانية وعرض المحتوى
window.addEventListener("load", function() {
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('main-content').classList.remove('hidden');
    }, 2000);
});
