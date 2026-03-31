let balance = 100;
let xp = 0;

const balanceEl = document.getElementById('balance');
const openBtn = document.getElementById('open-btn');
const adsBtn = document.getElementById('ads-btn');
const caseImg = document.getElementById('main-case');


openBtn.addEventListener('click', () => {
    if (balance >= 50) {
        balance -= 50;
        updateUI();
        
        // Эффект "встряски" при открытии
        caseImg.style.animation = 'shake 0.5s';
        setTimeout(() => caseImg.style.animation = 'float 3s ease-in-out infinite', 500);

        // Логика шансов (90% - мусор, 10% - окуп)
        let rand = Math.random() * 100;
        if (rand < 90) {
            alert("Выпало: 10 🥉 (Повезет в следующий раз!)");
            balance += 10;
        } else {
            alert("🔥 ДЖЕКПОТ: 250 🥉!");
            balance += 250;
        }
        updateUI();
    } else {
        alert("Недостаточно тикетов! Посмотри рекламу.");
    }
});


adsBtn.addEventListener('click', () => {
    adsBtn.innerText = "СМОТРИМ...";
    adsBtn.disabled = true;
    
    setTimeout(() => {
        balance += 10;
        updateUI();
        adsBtn.innerText = "▶ ПОЛУЧИТЬ +10 🎫";
        adsBtn.disabled = false;
        alert("Начислено 10 🥉 за просмотр!");
    }, 2000); // 2 секунды "рекламы"
});

function updateUI() {
    balanceEl.innerText = balance;
}