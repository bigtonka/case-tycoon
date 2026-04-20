const SUPABASE_URL = 'https://lfuyzmlkdwjivaxxcir.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdXl6bWxka3dqaXd2YXh4Y2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjkyMzYsImV4cCI6MjA5MDIwNTIzNn0.1eR2hatEDe4vPYZc_wSNYtEha1dTmVtlT1onNYzvhDQ';
const ADSGRAM_BLOCK_ID = '28176';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const tg = window.Telegram.WebApp; // Важно: вынесли сюда!

window.addEventListener('DOMContentLoaded', () => {
    if (tg) { tg.ready(); tg.expand(); }
    let balance = 0;

    async function syncData() {
        const user = tg.initDataUnsafe?.user;
        if (!user) return;
        try {
            let { data: dbUser } = await supabaseClient.from('users').select('*').eq('tg_id', user.id).single();
            if (!dbUser) {
                const inviterId = tg.initDataUnsafe.start_param ? parseInt(tg.initDataUnsafe.start_param) : null;
                const { data: newUser } = await supabaseClient.from('users').insert([{ 
                    tg_id: user.id, username: user.username || 'Игрок', balance: 100, inviter_id: inviterId 
                }]).select().single();
                dbUser = newUser;
            }
            if (dbUser) {
                balance = dbUser.balance;
                const balanceEl = document.getElementById('balance');
                if (balanceEl) balanceEl.innerText = balance.toLocaleString();
            }
        } catch (e) { console.error("Sync error:", e); }
    }
    syncData();

    window.renderTasks = async function() {
        const container = document.getElementById('task-list');
        if (!container) return;
        container.innerHTML = "Загрузка...";
        const user = tg.initDataUnsafe?.user;
        try {
            const { data: allTasks } = await supabaseClient.from('tasks').select('*').order('id', { ascending: true });
            const { data: doneTasks } = await supabaseClient.from('user_tasks').select('task_key').eq('user_tg_id', user.id);
            const doneKeys = doneTasks ? doneTasks.map(t => t.task_key) : [];

            if (!allTasks) return;

            container.innerHTML = allTasks.map(t => {
                const isDone = doneKeys.includes(t.key);
                let finalLink = t.link;
                if (t.key.includes('invite')) {
                    finalLink = `https://t.me/share/url?url=https://t.me/CaseTycoon_bot?start=${user.id}&text=Заходи в игру!`;
                }
                return `
                    <div class="loot-item" style="opacity: ${isDone ? '0.6' : '1'}">
                        <div style="flex:1">
                            <div>${t.title}</div>
                            <div style="color:#ffd700; font-weight:bold">+${t.reward} 🪙</div>
                        </div>
                        <button class="action-btn" onclick="${isDone ? '' : `window.doTask('${t.key}', '${finalLink}')`}" ${isDone ? 'disabled' : ''}>
                            ${isDone ? 'ГОТОВО' : 'ВЫПОЛНИТЬ'}
                        </button>
                    </div>`;
            }).join('');
        } catch (e) { console.error(e); }
    };

    window.doTask = async function(key, link) {
        if (link && link !== '#') tg.openTelegramLink(link);
        tg.showAlert("Проверка... Подождите 5 секунд");
        setTimeout(async () => {
            const { data } = await supabaseClient.rpc('claim_task_reward', { u_id: tg.initDataUnsafe.user.id, t_key: key });
            if (data?.success) {
                await syncData(); window.renderTasks();
                if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
                tg.showAlert(`✅ Начислено ${data.reward} 🪙`);
            } else {
                tg.showAlert(data?.message || "Условие не выполнено");
            }
        }, 5000);
    };

    window.startSpin = function() {
        // Длинная приятная вибрация (двойная)
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        tg.showAlert("🏦 Хранилище закрыто до листинга!");
    };

    window.toggleModal = function(id) {
        const m = document.getElementById(id);
        if (!m) return;
        m.style.display = m.style.display === "block" ? "none" : "block";
        if (m.style.display === "block" && id === 'tasks-modal') window.renderTasks();
    };
    
    // Функции-заглушки для твоих кнопок
    window.toggleTasks = () => window.toggleModal('tasks-modal');
    window.toggleReferral = () => window.toggleModal('referral-modal');
    window.toggleLeaderboard = () => window.toggleModal('leaderboard-modal');
    window.toggleInfo = () => window.toggleModal('info-modal');
});
