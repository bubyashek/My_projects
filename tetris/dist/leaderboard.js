// Система лидербордов для игры Tetris
const LEADERBOARD_KEY = 'tetris.leaderboard';
const MAX_ENTRIES = 10;
export class Leaderboard {
    constructor() {
        this.entries = [];
        this.load();
    }
    // Загрузка лидерборда из localStorage
    load() {
        const data = localStorage.getItem(LEADERBOARD_KEY);
        if (data) {
            try {
                this.entries = JSON.parse(data);
            }
            catch (e) {
                console.error('Ошибка загрузки лидерборда:', e);
                this.entries = [];
            }
        }
    }
    // Сохранение лидерборда в localStorage
    save() {
        try {
            localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(this.entries));
            console.log('Лидерборд сохранен:', this.entries);
        }
        catch (e) {
            console.error('Ошибка сохранения лидерборда:', e);
        }
    }
    // Добавление нового результата
    addEntry(name, score, level) {
        // Проверяем, есть ли уже лучший результат этого игрока
        const existingBest = this.getPlayerBest(name);
        if (existingBest && existingBest.score >= score) {
            console.log(`Результат ${name}: ${score} очков - не побит личный рекорд (${existingBest.score})`);
            return false; // Не добавляем, так как результат хуже
        }
        // Удаляем все старые записи этого игрока
        this.entries = this.entries.filter(e => e.name !== name);
        // Создаем новую запись
        const entry = {
            name,
            score,
            level,
            date: new Date().toLocaleDateString('ru-RU')
        };
        this.entries.push(entry);
        // Сортировка по убыванию счета
        this.entries.sort((a, b) => b.score - a.score);
        // Оставляем только топ-N записей
        const wasInTop = this.entries.indexOf(entry) < MAX_ENTRIES;
        this.entries = this.entries.slice(0, MAX_ENTRIES);
        this.save();
        if (existingBest) {
            console.log(`Результат ${name}: ${score} очков - новый личный рекорд! (было: ${existingBest.score})${wasInTop ? ' - попал в топ!' : ''}`);
        }
        else {
            console.log(`Результат ${name}: ${score} очков - первая игра!${wasInTop ? ' - попал в топ!' : ''}`);
        }
        return wasInTop;
    }
    // Получение всех записей
    getEntries() {
        return [...this.entries];
    }
    // Получение топ-N записей
    getTopEntries(limit = MAX_ENTRIES) {
        return this.entries.slice(0, limit);
    }
    // Проверка, попал ли счет в топ
    isTopScore(score) {
        if (this.entries.length < MAX_ENTRIES) {
            return true;
        }
        return score > this.entries[MAX_ENTRIES - 1].score;
    }
    // Получение позиции в рейтинге
    getPosition(score) {
        for (let i = 0; i < this.entries.length; i++) {
            if (score >= this.entries[i].score) {
                return i + 1;
            }
        }
        return this.entries.length + 1;
    }
    // Очистка лидерборда (для отладки)
    clear() {
        this.entries = [];
        this.save();
        console.log('Лидерборд очищен');
    }
    // Получение лучшего результата игрока
    getPlayerBest(name) {
        const playerEntries = this.entries.filter(e => e.name === name);
        if (playerEntries.length === 0) {
            return null;
        }
        return playerEntries[0]; // Уже отсортированы по убыванию
    }
}
// Отображение лидерборда в HTML
export function renderLeaderboard(leaderboard, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Контейнер ${containerId} не найден`);
        return;
    }
    const entries = leaderboard.getTopEntries();
    if (entries.length === 0) {
        container.innerHTML = '<p class="no-entries">Пока нет результатов.<br>Сыграйте первым!</p>';
        return;
    }
    let html = '<div class="leaderboard-list">';
    entries.forEach((entry, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const positionClass = index < 3 ? `position-${index + 1}` : '';
        html += `
            <div class="leaderboard-entry ${positionClass}">
                <span class="position">${medal || (index + 1)}</span>
                <span class="player-name">${escapeHtml(entry.name)}</span>
                <span class="player-stats">
                    <span class="score">${entry.score}</span>
                    <span class="level">ур. ${entry.level}</span>
                </span>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}
// Экранирование HTML для безопасности
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
