// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачивает приложение на весь экран

// Начальный баланс
let balance = 100;

// ПОЛНЫЙ СПИСОК ПРЕДМЕТОВ (в правильном порядке редкости)
const items = [
    { name: 'iPhone 17 PM', img: 'iphone17promax.png', rarity: 'mythic' },
    { name: 'MacBook Pro', img: 'macbook.png', rarity: 'mythic' },
    { name: 'iPhone 17', img: 'iphone17.png', rarity: 'rare' },
    { name: 'iPad Pro', img: 'ipad.png', rarity: 'rare' },
    { name: 'Apple Watch', img: 'applew.png', rarity: 'rare' },
    { name: 'TG Prem (1y)', img: 'tgprem.png', rarity: 'special' },
    { name: 'TG Stars (5k)', img: 'tgstars.png', rarity: 'special' },
    { name: 'USDT Crypt', img: 'usdt.png', rarity: 'special' },
    { name: 'Cash Pack', img: 'dollar.png', rarity: 'common' }
];

// Функция добавления валюты (имитация просмотра рекламы)
function addTicketsBatch() {
    balance += 10;
    updateBalanceDisplay();
    // Легкая вибрация при клике
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Обновление цифр на экране
function updateBalanceDisplay() {
    document.getElementById('balance').innerText = balance;
}

// ГЛАВНАЯ ФУНКЦИЯ: ЗАПУСК РУЛЕТКИ
function startSpin() {
    // Проверка: хватает ли 100$ на открытие
    if (balance < 100) {
        tg.showAlert("Недостаточно средств! Нужно 100 $");
        return;
    }

    // Списываем ставку
    balance -= 100;
    updateBalanceDisplay();

    // Подготовка зоны рулетки
    const zone = document.getElementById('display-zone');
    zone.innerHTML = `
        <div class="roulette-wrapper">
            <div class="roulette-line" id="line"></div>
        </div>
    `;
    
    const line = document.getElementById('line');
    let tapeContent = "";
    
    // Генерируем длинную ленту (80 предметов для долгой прокрутки)
    for(let i = 0; i < 80; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        tapeContent += `
            <div class="item-card ${item.rarity}">
                <img src="${item.img}" onerror="this.src='dollar.png'">
                <p>${item.name}</p>
            </div>`;
    }
    line.innerHTML = tapeContent;

    // Запускаем анимацию (сдвиг влево на 7500 пикселей)
    setTimeout(() => {
        line.style.left = "-7500px"; 
    }, 50);

    // Обработка результата через 5.5 секунд (когда анимация кончится)
    setTimeout(() => {
        // Рандомный выигрыш валюты (от 50 до 70)
        const winAmount = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
        
        // Вибрация при выигрыше
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
        }

        // Показываем уведомление
        tg.showAlert(`Почти! Выпал предмет: Набор Валюты \n\nЗачислено на баланс: ${winAmount} $`);
        
        // Начисляем выигрыш и обновляем экран
        balance += winAmount;
        updateBalanceDisplay();
        
        // Возвращаем изображение кейса на место
        zone.innerHTML = '<img src="casetycoon.png" class="main-case-img" id="case-img" alt="Case">';
    }, 5500);
}

// Открытие/Закрытие модального окна "i"
function toggleInfo() {
    const modal = document.getElementById('info-modal');
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    }
}

// Закрытие модалки при клике вне её области
window.onclick = function(event) {
    const modal = document.getElementById('info-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
