// Переносим инициализацию наружу для надежности
const SUPABASE_URL = 'https://lfuyzmlkdwjivaxxcir.supabase.co'; // Я исправил твой URL на правильный формат
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdXl6bWxka3dqaXd2YXh4Y2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjkyMzYsImV4cCI6MjA5MDIwNTIzNn0.1eR2hatEDe4vPYZc_wSNYtEha1dTmVtlT1onNYzvhDQ';
const ADSGRAM_BLOCK_ID = '28176';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    if (tg) { 
        tg.ready(); 
        tg.expand(); 
    }

    let balance = 0;

    // --- ЗАГРУЗКА ИГРОКА ---
    async function syncData() {
        const user = tg.initDataUnsafe?.user;
        if (!user) return;

        try {
            let { data: dbUser, error } = await supabaseClient
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

            if (dbUser) {
                balance = dbUser.balance;
                document.getElementById('balance').innerText = balance.toLocaleString();
            }
        } catch (e) {
            console.error("Ошибка синхронизации:", e);
        }
    }

    syncData();

    // --- РЕКЛАМА ---
    // Убираем обязательный event, чтобы работало при обычном вызове
    window.addTicketsBatch = function() {
        const user = tg.initDataUnsafe?.user;
        if (!user) {
            alert("Ошибка: Зайдите через Telegram");
            return;
        }

        // Пытаемся найти кнопку в DOM
        const btn = document.querySelector('.blue-btn');
        if (btn) btn.disabled = true;

        if (!window.Adsgram) {
            alert("Рекламный блок еще не загружен");
            if (btn) btn.disabled = false;
            return;
        }

        const AdController = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
        
        AdController.show().then(async () => {
            const { data } = await supabaseClient.rpc('claim_ad_reward', { user_id: user.id });
            if (data?.success) {
                await syncData();
                if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            }
            if (btn) btn.disabled = false;
        }).catch((err) => {
            console.error('Ошибка Adsgram:', err);
            if (btn) btn.disabled = false;
        });
    };

    // --- МОДАЛЬНЫЕ ОКНА ---
    window.toggleModal = function(id) {
        const m = document.getElementById(id);
        if (!m) return;
        const isOpen = m.style.display === "block";
        m.style.display = isOpen ? "none" : "block";
        
        if (!isOpen) {
            if (id === 'tasks-modal') renderTasks();
            if (id === 'leaderboard-modal') renderLeaderboard();
        }
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    };

    // Привязываем функции к глобальному окну
    window.toggleInfo = () => window.toggleModal('info-modal');
    window.toggleTasks = () => window.toggleModal('tasks-modal');
    window.toggleLeaderboard = () => window.toggleModal('leaderboard-modal');
    window.toggleReferral = () => window.toggleModal('referral-modal');

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

    async function renderLeaderboard() {
        const container = document.getElementById('leader-list');
        if (!container) return;
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
                <div style="font-weight:900;">${l.balance.toLocaleString()} 🪙</div>
            </div>
        `).join('');
    }

    window.copyLink = function() {
        const userId = tg.initDataUnsafe?.user?.id || '0';
        const link = `https://t.me/CaseTycoon_bot?start=${userId}`;
        const i = document.createElement("input");
        i.value = link; document.body.appendChild(i); i.select();
        document.execCommand("copy"); 
        document.body.removeChild(i);
        if (tg.showAlert) tg.showAlert("✅ Ссылка скопирована!");
    };

    document.addEventListener('contextmenu', e => e.target.tagName === 'IMG' && e.preventDefault());
});
