let progress = localStorage.getItem("progress") ? parseInt(localStorage.getItem("progress")) : 0;
const progressBar = document.getElementById("mining-progress");
const progressText = document.getElementById("progress-text");
const claimBtn = document.getElementById("claim-btn");

function updateProgress() {
    if (progress < 100) {
        progress += 20; // زيادة التقدم
        localStorage.setItem("progress", progress); // حفظ التقدم
        progressBar.style.width = progress + "%"; // تحديث عرض شريط التقدم
        progressText.innerText = `${progress / 20} / 5`; // تحديث النص داخل شريط التقدم
    }

    if (progress === 100) {
        claimBtn.style.display = "block"; // إظهار زر CLAIM
    }
}

function claimReward() {
    alert("🎉 تم استلام المكافأة!");

    // إعادة تعيين التقدم
    progress = 0;
    localStorage.setItem("progress", progress);
    progressBar.style.width = "0%";
    progressText.innerText = "0 / 5";
    claimBtn.style.display = "none";
}

setInterval(updateProgress, 2000); // تحديث التقدم بشكل دوري
