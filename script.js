// تأكد من تحميل Telegram WebApp
window.Telegram.WebApp.ready();

// استخراج بيانات المستخدم
const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

if (tgUser) {
    console.log("User ID:", tgUser.id);
    console.log("First Name:", tgUser.first_name);
    console.log("Username:", tgUser.username || "غير متوفر");

    // عرض البيانات في الصفحة
    document.getElementById("username").textContent = tgUser.first_name;
    document.getElementById("user_id").textContent = tgUser.id;
} else {
    console.log("تعذر الحصول على بيانات المستخدم من Telegram.");
}
