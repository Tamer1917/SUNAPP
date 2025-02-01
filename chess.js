// تأكد من تضمين SDK الخاص بـ Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const db = getDatabase(app);

// جلب بيانات المستخدم من Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();  // لتوسيع الواجهة

const userId = tg.initDataUnsafe?.user?.id;
const userName = tg.initDataUnsafe?.user?.username || "لا يوجد اسم مستخدم";

// جلب النقاط من Firebase
async function fetchUserData() {
    if (!userId) {
        document.getElementById("user-info").innerText = "لم يتم العثور على بيانات المستخدم!";
        return;
    }

    const userRef = ref(db, `users/${userId}`);  // مسار المستخدم في Firebase
    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            document.getElementById("user-info").innerHTML = `
                <strong>👤 اسم المستخدم:</strong> @${userName} <br>
                <strong>⭐ نقاطك:</strong> ${userData.points || 0}
            `;
        } else {
            document.getElementById("user-info").innerText = "⚠️ المستخدم غير مسجل!";
        }
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        document.getElementById("user-info").innerText = "حدث خطأ أثناء جلب البيانات!";
    }
}

// تشغيل الدالة عند تحميل الصفحة
fetchUserData();
