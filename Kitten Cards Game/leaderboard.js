class Leaderboard {
    constructor() {
        this.entries = [];
        this.key = 'kitten.leaderboard';
        this.maxEntries = 10;
        this.load();
    }

    load() {
        const data = localStorage.getItem(this.key);
        if (data) {
            try { 
                this.entries = JSON.parse(data);
                // Миграция старых записей: score -> time, добавляем kittens если нет
                this.entries = this.entries.map(e => ({
                    name: e.name || "Игрок",
                    time: e.time !== undefined ? e.time : (e.score || 0),
                    kittens: e.kittens || 0,
                    date: e.date || new Date().toLocaleDateString("ru-RU")
                }));
                this.save(); // сохраняем мигрированные данные
            }
            catch(e){ this.entries = []; }
        }
    }

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.entries));
    }

    addEntry(name, time, kittens) {
        if (!name) return; // защита от undefined
        kittens = kittens || 0;
        const existing = this.entries.find(e => e.name === name);
        // Сравниваем: больше котиков = лучше, при равенстве — меньше время = лучше
        if (existing) {
            if (existing.kittens > kittens) return; // старый результат лучше по котикам
            if (existing.kittens === kittens && existing.time <= time) return; // равные котики, но старое время лучше
        }
        this.entries = this.entries.filter(e => e.name !== name);
        this.entries.push({ name, time, kittens, date: new Date().toLocaleDateString("ru-RU") });
        // Сортировка: сначала по котикам (больше = лучше), потом по времени (меньше = лучше)
        this.entries.sort((a, b) => {
            if (b.kittens !== a.kittens) return b.kittens - a.kittens; // больше котиков = выше
            return a.time - b.time; // меньше время = выше
        });
        this.entries = this.entries.slice(0, this.maxEntries);
        this.save();
    }

    getTopEntries() {
        return this.entries;
    }
}

function renderLeaderboard(lb, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const entries = lb.getTopEntries();
    if (entries.length === 0) {
        container.innerHTML = "<p>Нет результатов</p>";
        return;
    }

    let html = "<div class='leaderboard-list'>";
    entries.forEach((e, i) => {
        const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":"";
        const kittens = e.kittens || 0;
        const time = e.time !== undefined ? e.time : e.score; // совместимость со старыми записями
        html += `<div>${medal || (i+1)}. ${e.name} — ${kittens} 🐱, ${time} сек.</div>`;
    });
    html += "</div>";
    container.innerHTML = html;
}
