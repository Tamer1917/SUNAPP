let progress = localStorage.getItem("progress") ? parseInt(localStorage.getItem("progress")) : 0;
const progressBar = document.getElementById("mining-progress");
const progressText = document.getElementById("progress-text");
const claimBtn = document.getElementById("claim-btn");

function updateProgress() {
    if (progress < 100) {
        progress += 20; // زيادة التقدم
        progressBar.style.width = progress + "%"; // تحديث عرض شريط التقدم
        progressText.innerText = `${progress / 20} / 5`; // تحديث النص داخل شريط التقدم

        // حفظ التقدم في localStorage
        localStorage.setItem("progress", progress);

        // إذا وصل التقدم إلى 100%
        if (progress === 100) {
            claimBtn.style.display = "block"; // إظهار زر CLAIM
        }
    }
}

// هذه الدالة تقوم بتحديث التقدم كل 2 ثانية
setInterval(updateProgress, 2000);

// دالة للمطالبة بالمكافأة
function claimReward() {
    alert("🎉 تم استلام المكافأة!");

    // إعادة تعيين التقدم
    progress = 0;
    progressBar.style.width = "0%"; // إعادة تعيين عرض شريط التقدم
    progressText.innerText = "0 / 5"; // تحديث النص إلى "0 / 5"
    claimBtn.style.display = "none"; // إخفاء زر CLAIM

    // حفظ التقدم الجديد (0) في localStorage
    localStorage.setItem("progress", progress);
}

// إخفاء شاشة التحميل بعد 2 ثانية وعرض المحتوى
setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('main-content').classList.remove('hidden');
}, 2000);
