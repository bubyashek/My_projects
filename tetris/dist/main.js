import { TetrisGame } from './game.js';
import { renderLeaderboard } from './leaderboard.js';
import { getAudioManager } from './audio.js';
// Проверка, что пользователь ввел имя
const username = localStorage.getItem('tetris.username');
if (!username) {
    window.location.href = 'index.html';
}
// Отображение имени пользователя
const playerNameElement = document.getElementById('playerName');
if (playerNameElement && username) {
    playerNameElement.textContent = username;
}
// Инициализация игры
const game = new TetrisGame('gameCanvas', 'nextCanvas');
// Функция обновления отображения лидерборда
function updateLeaderboardDisplay() {
    renderLeaderboard(game.getLeaderboard(), 'leaderboardContainer');
}
// Делаем функцию доступной глобально для вызова из game.ts
window.updateLeaderboardDisplay = updateLeaderboardDisplay;
// Начальное отображение лидерборда
updateLeaderboardDisplay();
// Запуск игры
game.start();
// Обработка клавиатуры - простая и надежная
document.addEventListener('keydown', (event) => {
    const key = event.key;
    // Предотвращаем прокрутку страницы для игровых клавиш
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown' || key === ' ') {
        event.preventDefault();
        event.stopPropagation();
    }
    // Простая обработка - каждая клавиша отдельно
    if (key === 'ArrowLeft') {
        game.moveLeft();
    }
    else if (key === 'ArrowRight') {
        game.moveRight();
    }
    else if (key === 'ArrowDown') {
        game.moveDown();
    }
    else if (key === 'ArrowUp') {
        game.rotate();
    }
    else if (key === ' ') {
        game.hardDrop();
    }
    else if (key === 'p' || key === 'P' || key === 'Escape') {
        game.togglePause();
    }
}, { passive: false });
// Кнопка паузы
const pauseBtn = document.getElementById('pauseBtn');
if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
        game.togglePause();
    });
}
// Кнопка возврата на страницу входа
const backBtn = document.getElementById('backBtn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}
// Кнопка рестарта
const restartBtn = document.getElementById('restartBtn');
if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        const gameOverDiv = document.getElementById('gameOver');
        if (gameOverDiv) {
            gameOverDiv.classList.add('hidden');
        }
        game.start();
    });
}
// Кнопка звука
const soundBtn = document.getElementById('soundBtn');
const audioManager = getAudioManager();
if (soundBtn) {
    // Установка начального состояния кнопки
    soundBtn.textContent = audioManager.isSoundMuted() ? '🔇' : '🔊';
    soundBtn.addEventListener('click', () => {
        const isMuted = audioManager.toggleMute();
        soundBtn.textContent = isMuted ? '🔇' : '🔊';
        soundBtn.title = isMuted ? 'Включить звук' : 'Выключить звук';
    });
}
