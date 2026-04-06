window.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

    let balance = 100;

    // --- ФУНКЦИЯ ДОБАВЛЕНИЯ МОНЕТ ---
    window.addTicketsBatch = function() {
        balance += 10;
        document.getElementById('balance').innerText = balance;
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    };

    // --- ФУНКЦИЯ НАЖАТИЯ "ОТКРЫТЬ" (ЗАГЛУШКА) ---
    window.startSpin = function() {
        const messages = [
            "🏦 Хранилище закрыто! Листинг откроет замки.",
            "🚀 Ракета заправляется... Ожидай листинг!",
            "💎 Таможня задерживает призы до запуска токена.",
            "⏳ Время фармить! Открытие кейсов будет позже.",
            "🚧 Идут технические работы. Ожидай листинг!"
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        if (tg.showAlert) {
            tg.showAlert(randomMessage);
            if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('warning');
        } else {
            alert(randomMessage);
        }
    };

    // --- ОКНО СОДЕРЖИМОГО КЕЙСА (ИНФО) ---
    window.toggleInfo = function() {
        const modal = document.getElementById('info-modal');
        if (modal) {
            modal.style.display = (modal.style.display === "block") ? "none" : "block";
        }
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    };

    // --- ОКНО РЕФЕРАЛОВ ---
    window.toggleReferral = function() {
        const modal = document.getElementById('referral-modal');
        if (modal) {
            modal.style.display = (modal.style.display === "block") ? "none" : "block";
        }
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    };

    // --- КОПИРОВАНИЕ РЕФЕРАЛЬНОЙ ССЫЛКИ ---
    window.copyLink = function() {
        const userId = tg.initDataUnsafe?.user?.id || "000"; 
        // ЗАМЕНИ 'CaseTycoonBot' на реальный юзернейм твоего бота без @
        const botUsername = "CaseTycoonBot"; 
        const link = `https://t.me/${botUsername}?start=${userId}`;

        // Стандартный способ копирования для браузеров
        const tempInput = document.createElement("input");
        tempInput.value = link;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        if (tg.showAlert) {
            tg.showAlert("✅ Ссылка скопирована! Отправь её другу.");
        } else {
            alert("Ссылка скопирована!");
        }

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    };
});
