let balance = 100;

// Предметы, которые видит игрок в рулетке
const items = [
    { name: 'iPhone 15 Pro', img: 'iphone.png', rarity: 'mythic' },
    { name: 'Dyson Airwrap', img: 'dyson.png', rarity: 'mythic' },
    { name: 'Apple Watch 9', img: 'apple-watch.png', rarity: 'rare' },
    { name: '100 🎫', img: 'ticket-gold.png', rarity: 'common' },
    { name: '50 🎫', img: 'ticket-gold.png', rarity: 'common' }
];

function addTicket() {
    balance += 1;
    document.getElementById('balance').innerText = balance;
}

function startSpin() {
    const zone = document.getElementById('display-zone');
    zone.innerHTML = `
        <div class="roulette-wrapper">
            <div class="roulette-line" id="line"></div>
        </div>
    `;
    
    const line = document.getElementById('line');
    let tapeContent = "";
    
    // Создаем длинную ленту из 80 предметов
    for(let i=0; i<80; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        // Если это билет и нет картинки, ставим смайлик
        const imgTag = item.img.includes('.png') ? `<img src="${item.img}">` : `<div style="font-size:40px">🎫</div>`;
        tapeContent += `<div class="item-card ${item.rarity}">${imgTag}</div>`;
    }
    line.innerHTML = tapeContent;

    // Запускаем прокрутку
    setTimeout(() => {
        line.style.left = "-7500px"; // Длина прокрутки
    }, 50);

    // Конец анимации через 5 секунд
    setTimeout(() => {
        alert("Почти! Выпало: 50 Билетов 🎫");
        location.reload(); // Сброс к кейсу
    }, 5500);
}

function toggleInfo() {
    const modal = document.getElementById('info-modal');
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}
