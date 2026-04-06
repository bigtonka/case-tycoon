const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем на весь экран

let balance = 100;

// Список предметов
const items = [
    { name: 'iPhone 17 PM', img: 'iphone17promax.png', rarity: 'mythic' },
    { name: 'MacBook Pro', img: 'macbook.png', rarity: 'mythic' },
    { name: 'iPhone 17', img: 'iphone17.png', rarity: 'rare' },
    { name: 'iPad Pro', img: 'ipad.png', rarity: 'rare' },
    { name: 'Apple Watch', img: 'applew.png', rarity: 'rare' },
    { name: 'USDT Crypto', img: 'usdt.png', rarity: 'special' },
    { name: 'TG Prem (1y)', img: 'tgprem.png', rarity: 'special' },
    { name: 'TG Stars (5k)', img: 'tgstars.png', rarity: 'special' },
    { name: 'Cash Pack', img: 'coin.png', rarity: 'common' }
];

// Функция фарма монет
function addTicketsBatch() {
    balance += 10;
    document.getElementById('balance').innerText = balance;
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Функция нажатия на "Открыть" (Заблокирована до листинга)
function startSpin() {
    const messages = [
        "🏦 Хранилище закрыто! Листинг откроет замки. Копи коины!",
        "🚀 Ракета заправляется... Кейсы станут доступны сразу после листинга!",
        "💎 Слишком много золота! Таможня задерживает поставку до запуска токена.",
        "⏳ Терпение, Тайкун! Сейчас время фармить, время открывать придет позже.",
        "🚧 Идут технические работы по погрузке призов. Ожидай листинг!"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(randomMessage);
        if (window.Telegram.WebApp.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
        }
    } else {
        alert(randomMessage);
    }
}

// Информация о дропе
function toggleInfo() {
    const modal = document.getElementById('info-modal');
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}
