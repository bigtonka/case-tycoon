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

    // --- ОТКРЫТЬ (ЗАГЛУШКА) ---
    window.startSpin = function() {
        const msg = "🏦 Хранилище закрыто! Листинг откроет замки.";
        if (tg.showAlert) tg.showAlert(msg); else alert(msg);
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('warning');
    };

    // --- УПРАВЛЕНИЕ МОДАЛКАМИ ---
    function toggleModal(id) {
        const m = document.getElementById(id);
        const isVisible = m.style.display === "block";
        m.style.display = isVisible ? "none" : "block";
        if (!isVisible) {
            if (id === 'tasks-modal') renderTasks();
            if (id === 'leaderboard-modal') renderLeaderboard();
        }
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    }

    window.toggleInfo = () => toggleModal('info-modal');
    window.toggleReferral = () => toggleModal('referral-modal');
    window.toggleTasks = () => toggleModal('tasks-modal');
    window.toggleLeaderboard = () => toggleModal('leaderboard-modal');

    // --- РЕНДЕР КВЕСТОВ ---
    function renderTasks() {
        const container = document.getElementById('task-list');
        const tasks = [
            { n: "Подписка на ТГ канал", r: 500 },
            { n: "Пригласить 1 друга", r: 300 },
            { n: "Пригласить 5 друзей", r: 1000 },
            { n: "Пригласить 10 друзей", r: 2000 },
            { n: "Зайти в игру 3 дня подряд", r: 100 },
            { n: "Зайти в игру 7 дней подряд", r: 500 },
            { n: "Зайти в игру 14 дней подряд", r: 2500 },
            { n: "Посмотреть 10 реклам", r: 100 },
            { n: "Посмотреть 50 реклам", r: 500 },
            { n: "Посмотреть 100 реклам", r: 1000 }
        ];

        container.innerHTML = tasks.map(t => `
            <div class="loot-item">
                <div style="flex:1">
                    <p style="font-weight:900; font-size:14px;">${t.n}</p>
                    <p class="gold-text" style="font-size:12px;">+${t.r} <img src="coin.png" style="width:10px"></p>
                </div>
                <button class="action-btn blue-btn" style="width:80px; height:30px; font-size:10px" onclick="alert('Проверка...')">ВЫПОЛНИТЬ</button>
            </div>
        `).join('');
    }

    // --- РЕНДЕР ЛИДЕРБОРДА ---
    function renderLeaderboard() {
        const container = document.getElementById('leader-list');
        const leaders = [
            { name: "CryptoKing", score: 154000 },
            { name: "Tycoon_X", score: 121000 },
            { name: "RichBoi", score: 98000 },
            { name: "LuckyMan", score: 85000 },
            { name: "Player777", score: 72000 }
        ];

        let html = leaders.map((l, i) => `
            <div class="loot-item">
                <div class="rank-num ${i < 3 ? 'top-' + (i+1) : ''}">${i < 3 ? ['🥇','🥈','🥉'][i] : i+1}</div>
                <div style="flex:1; font-weight:700;">${l.name}</div>
                <div style="font-weight:900;">${l.score.toLocaleString()} <img src="coin.png" style="width:12px"></div>
            </div>
        `).join('');
        
        html += `<p style="text-align:center; color:#444; font-size:10px; margin-top:10px;">... и еще 995 игроков ...</p>`;
        container.innerHTML = html;

        // Расчет твоего места (фейк для примера)
        const myRank = 12450;
        document.getElementById('my-rank').innerText = myRank > 1000 ? "1k+" : myRank;
    }

    // --- КОПИРОВАНИЕ ССЫЛКИ ---
    window.copyLink = function() {
        const link = `https://t.me/CaseTycoon_bot?start=${tg.initDataUnsafe?.user?.id || '0'}`;
        const temp = document.createElement("input");
        temp.value = link; document.body.appendChild(temp); temp.select();
        document.execCommand("copy"); document.body.removeChild(temp);
        if (tg.showAlert) tg.showAlert("✅ Ссылка скопирована!");
    };
});
