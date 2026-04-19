window.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    if (tg) { tg.ready(); tg.expand(); }

    // --- НАСТРОЙКИ (ВСТАВЬ СВОИ ДАННЫЕ) ---
    const SUPABASE_URL = 'sb_publishable_eUpDdeZPzc4zJpx37ALgxg_zNnb9O_r';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdXl6bWxka3dqaXd2YXh4Y2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjkyMzYsImV4cCI6MjA5MDIwNTIzNn0.1eR2hatEDe4vPYZc_wSNYtEha1dTmVtlT1onNYzvhDQ';
    const ADSGRAM_BLOCK_ID = '28176'; // Тот самый ID

    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    let balance = 0;

    // --- ЗАГРУЗКА ИГРОКА ---
    async function syncData() {
        const user = tg.initDataUnsafe?.user;
        if (!user) return;

        let { data: dbUser } = await supabaseClient
            .from('users')
            .select('*')
            .eq('tg_id', user.id)
            .single();

        if (!dbUser) {
            const inviterId = tg.initDataUnsafe.start_param ? parseInt(tg.initDataUnsafe.start_param) : null;
            const { data: newUser } = await supabaseClient
                .from('users')
                .insert([{ 
                    tg_id: user.id, 
                    username: user.username || 'Игрок', 
                    balance: 100,
                    inviter_id: inviterId 
                }])
                .select().single();
            dbUser = newUser;
        }

        balance = dbUser.balance;
        document.getElementById('balance').innerText = balance.toLocaleString();
    }

    syncData();

    // --- РЕКЛАМА (ГЛАВНАЯ ФУНКЦИЯ) ---
    window.addTicketsBatch = function(event) {
        const user = tg.initDataUnsafe?.user;
        if (!user) return;

        const btn = event.currentTarget;
        btn.disabled = true; // Блокируем кнопку, чтобы не жали сто раз

        // Вызов Adsgram
        const AdController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
        
        AdController.show().then(async () => {
            // Если досмотрел — вызываем твою функцию в базе
            const { data } = await supabaseClient.rpc('claim_ad_reward', { user_id: user.id });
            
            if (data?.success) {
                await syncData(); // Обновляем баланс на экране
                if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            }
            btn.disabled = false;
        }).catch((err) => {
            console.error('Реклама не досмотрена или ошибка:', err);
            btn.disabled = false;
        });
    };

    // --- ФУНКЦИИ ОКРЫТИЯ (ТВОИ ФРАЗЫ) ---
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
    };

    // --- МОДАЛЬНЫЕ ОКНА ---
    function toggleModal(id) {
        const m = document.getElementById(id);
        if (!m) return;
        const isOpen = m.style.display === "block";
        m.style.display = isOpen ? "none" : "block";
        
        if (!isOpen) {
            if (id === 'tasks-modal') renderTasks();
            if (id === 'leaderboard-modal') renderLeaderboard();
        }
    }

    window.toggleInfo = () => toggleModal('info-modal');
    window.toggleReferral = () => toggleModal('referral-modal');
    window.toggleTasks = () => toggleModal('tasks-modal');
    window.toggleLeaderboard = () => toggleModal('leaderboard-modal');

    // --- ЛИДЕРБОРД (РЕАЛЬНЫЙ) ---
    async function renderLeaderboard() {
        const container = document.getElementById('leader-list');
        container.innerHTML = "Загрузка...";

        const { data: tops } = await supabaseClient
            .from('users')
            .select('username, balance')
            .order('balance', { ascending: false })
            .limit(10);

        if (!tops) return;

        container.innerHTML = tops.map((l, i) => `
            <div class="loot-item">
                <div class="rank-num ${i < 3 ? 'top-' + (i+1) : ''}">${i < 3 ? ['🥇','🥈','🥉'][i] : i+1}</div>
                <div style="flex:1; font-weight:700;">${l.username}</div>
                <div style="font-weight:900;">${l.balance} 🪙</div>
            </div>
        `).join('');
    }

    // --- РЕФЕРАЛКА ---
    window.copyLink = function() {
        const userId = tg.initDataUnsafe?.user?.id || '0';
        const link = `https://t.me/CaseTycoon_bot?start=${userId}`;
        const i = document.createElement("input");
        i.value = link; document.body.appendChild(i); i.select();
        document.execCommand("copy"); document.body.removeChild(i);
        tg.showAlert("✅ Ссылка скопирована!");
    };

    // --- ЗАЩИТА ---
    document.addEventListener('contextmenu', e => e.target.tagName === 'IMG' && e.preventDefault());
});
