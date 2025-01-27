// تأكد من تحميل مكتبة Telegram WebApp
window.Telegram.WebApp.ready();

// استخراج بيانات المستخدم
const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

if (tgUser) {
    console.log("User ID:", tgUser.id);  // رقم معرف المستخدم
    console.log("First Name:", tgUser.first_name);  // الاسم الأول
    console.log("Last Name:", tgUser.last_name || "غير متوفر");  // اسم العائلة
    console.log("Username:", tgUser.username || "غير متوفر");  // اسم المستخدم
    console.log("Language Code:", tgUser.language_code);  // لغة المستخدم

    // عرض البيانات على الصفحة
    document.getElementById("username").textContent = tgUser.first_name;
    document.getElementById("user_id").textContent = tgUser.id;
} else {
    console.log("تعذر الحصول على بيانات المستخدم من Telegram.");
}
