window.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    if (tg) { tg.ready(); tg.expand(); }

    let balance = 100;

    // --- ДОБАВЛЕНИЕ МОНЕТ ---
    window.addTicketsBatch = function() {
        balance += 10;
        document.getElementById('balance').innerText = balance;
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    };

    // --- ОТКРЫТЬ (ВОЗВРАЩЕНО 5 ФРАЗ) ---
    window.startSpin = function() {
        const messages = [
            "🏦 Хранилище закрыто! Листинг откроет замки.",
            "🚀 Ракета заправляется... Ожидай листинг!",
            "💎 Таможня задерживает призы до запуска токена.",
            "⏳ Время фармить! Открытие кейсов будет позже.",
            "🚧 Идут технические работы. Ожидай листинг!"
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        if (tg.showAlert) tg.showAlert(msg); else alert(msg);
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('warning');
    };

    // --- УПРАВЛЕНИЕ ОКНАМИ ---
    function toggleModal(id) {
        const m = document.getElementById(id);
        const isOpen = m.style.display === "block";
        m.style.display = isOpen ? "none" : "block";
        if (!isOpen) {
            if (id === 'tasks-modal') renderTasks();
            if (id === 'leaderboard-modal') renderLeaderboard();
        }
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    }

    window.toggleInfo = () => toggleModal('info-modal');
    window.toggleReferral = () => toggleModal('referral-modal');
    window.toggleTasks = () => toggleModal('tasks-modal');
    window.toggleLeaderboard = () => toggleModal('leaderboard-modal');

    // --- КВЕСТЫ (МОНЕТЫ ВЫРОВНЕНЫ) ---
    function renderTasks() {
        const container = document.getElementById('task-list');
        const tasks = [
            { n: "Подписка на ТГ канал", r: 500 },
            { n: "Пригласить 1 друга", r: 300 },
            { n: "Пригласить 5 друзей", r: 1000 },
            { n: "Пригласить 10 друзей", r: 2000 },
            { n: "В игре 3 дня подряд", r: 100 },
            { n: "В игре 7 дней подряд", r: 500 },
            { n: "В игре 14 дней подряд", r: 2500 },
            { n: "Посмотреть 10 реклам", r: 100 },
            { n: "Посмотреть 50 реклам", r: 500 },
            { n: "Посмотреть 100 реклам", r: 1000 }
        ];

        container.innerHTML = tasks.map(t => `
            <div class="loot-item">
                <div style="flex:1">
                    <p style="font-weight:900; font-size:14px;">${t.n}</p>
                    <p class="gold-text" style="font-size:14px;">+${t.r} <img src="coin.png" class="list-coin"></p>
                </div>
                <button class="action-btn blue-btn" style="width:80px; height:30px; font-size:10px" onclick="alert('Проверка...')">ВЫПОЛНИТЬ</button>
            </div>
        `).join('');
    }

    // --- ЛИДЕРБОРД (МОНЕТЫ ВЫРОВНЕНЫ) ---
    function renderLeaderboard() {
        const container = document.getElementById('leader-list');
        const tops = [
            {u: "RichPlayer", b: 250000},
            {u: "CryptoBoss", b: 180000},
            {u: "LuckyOne", b: 150000},
            {u: "Mogul_99", b: 90000},
            {u: "User_123", b: 85000}
        ];

        let html = tops.map((l, i) => `
            <div class="loot-item">
                <div class="rank-num ${i < 3 ? 'top-' + (i+1) : ''}">${i < 3 ? ['🥇','🥈','🥉'][i] : i+1}</div>
                <div style="flex:1; font-weight:700; font-size:14px;">${l.u}</div>
                <div style="font-weight:900; font-size:14px;">${l.b.toLocaleString()} <img src="coin.png" class="list-coin"></div>
            </div>
        `).join('');
        
        html += `<p style="text-align:center; color:#444; font-size:10px; margin-top:10px;">... и еще 995 игроков ...</p>`;
        container.innerHTML = html;

        const myPlace = 12450; 
        let displayRank = myPlace > 1000 ? "1k+" : myPlace;
        document.getElementById('my-rank').innerText = displayRank;
    }

    // --- КОПИРОВАНИЕ ССЫЛКИ ---
    window.copyLink = function() {
        const link = `https://t.me/CaseTycoon_bot?start=${tg.initDataUnsafe?.user?.id || '0'}`;
        const i = document.createElement("input");
        i.value = link; document.body.appendChild(i); i.select();
        document.execCommand("copy"); document.body.removeChild(i);
        if (tg.showAlert) tg.showAlert("✅ Ссылка скопирована!");
    };
    // --- ЗАЩИТА ОТ КОПИРОВАНИЯ И ЗАЖАТИЯ КАРТИНОК (Android Fix) ---
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault(); // Запрещает контекстное меню
        e.stopPropagation();
        return false;
    }
}, false);

// Запрещаем перетаскивание картинок (чтобы ссылку нельзя было "вытянуть")
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
}, false);
    
});
