import { getRandomTetromino, rotateTetromino } from './tetrominos.js';
import { GAME_CONFIG } from './config.js';
import { Leaderboard } from './leaderboard.js';
import { getAudioManager } from './audio.js';
export class TetrisGame {
    // Получение цветов из CSS переменных
    getCanvasBackground() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--bg-canvas').trim() || 'white';
    }
    getGridColor() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--grid-color').trim() || '#f0f0f0';
    }
    getBlockHighlight() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--block-highlight').trim() || 'rgba(255, 255, 255, 0.3)';
    }
    /**
     * Получение цвета тетромино из CSS переменных
     */
    getTetrominoColor(type) {
        const cssVarMap = {
            'I': '--tetromino-i',
            'O': '--tetromino-o',
            'T': '--tetromino-t',
            'S': '--tetromino-s',
            'Z': '--tetromino-z',
            'J': '--tetromino-j',
            'L': '--tetromino-l'
        };
        const cssVar = cssVarMap[type];
        if (cssVar) {
            const color = getComputedStyle(document.documentElement)
                .getPropertyValue(cssVar).trim();
            return color || 'white';
        }
        return 'white';
    }
    constructor(canvasId, nextCanvasId) {
        this.audioManager = getAudioManager();
        this.ROWS = GAME_CONFIG.ROWS;
        this.COLS = GAME_CONFIG.COLS;
        this.BLOCK_SIZE = GAME_CONFIG.BLOCK_SIZE;
        this.currentPiece = null;
        this.currentPosition = { x: 0, y: 0 };
        this.nextPiece = null;
        this.score = 0;
        this.level = GAME_CONFIG.INITIAL_LEVEL;
        this.linesCleared = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.gameInterval = null;
        this.dropSpeed = GAME_CONFIG.INITIAL_DROP_SPEED;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById(nextCanvasId);
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.board = this.createEmptyBoard();
        this.leaderboard = new Leaderboard();
    }
    createEmptyBoard() {
        return Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
    }
    start() {
        this.board = this.createEmptyBoard();
        this.score = 0;
        this.level = GAME_CONFIG.INITIAL_LEVEL;
        this.linesCleared = 0;
        this.gameOver = false;
        // Игра начинается на ПАУЗЕ - ждём первого взаимодействия
        this.isPaused = true;
        this.dropSpeed = GAME_CONFIG.INITIAL_DROP_SPEED;
        this.nextPiece = getRandomTetromino();
        this.spawnNewPiece();
        this.updateUI();
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        this.gameInterval = window.setInterval(() => {
            if (!this.isPaused && !this.gameOver) {
                this.moveDown();
            }
        }, this.dropSpeed);
        this.render();
        this.drawNextPiece();
        // Показываем сообщение о паузе
        this.showPauseMessage();
    }
    showPauseMessage() {
        const ctx = this.ctx;
        ctx.save();
        // Полупрозрачный фон
        const overlayColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--overlay-dark').trim() || 'rgba(0, 0, 0, 0.7)';
        ctx.fillStyle = overlayColor;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Текст
        const textColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--text-pause').trim() || '#FFF8E7';
        ctx.fillStyle = textColor;
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        ctx.fillText('ПАУЗА', centerX, centerY - 30);
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText('Нажмите любую', centerX, centerY + 10);
        ctx.fillText('клавишу управления', centerX, centerY + 35);
        ctx.fillText('для игры', centerX, centerY + 60);
        ctx.restore();
    }
    togglePause() {
        if (this.gameOver)
            return;
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            // Снимаем с паузы - запускаем музыку
            this.audioManager.playGameStartSound();
            this.audioManager.startBackgroundMusic();
            this.render();
        }
        else {
            // Ставим на паузу - показываем сообщение
            this.render();
            this.showPauseMessage();
        }
    }
    spawnNewPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = getRandomTetromino();
        this.currentPosition = {
            x: Math.floor(this.COLS / 2) - Math.floor(this.currentPiece.shape[0].length / 2),
            y: 0
        };
        if (!this.isValidMove(this.currentPosition, this.currentPiece.shape)) {
            this.endGame();
        }
        this.drawNextPiece();
    }
    isValidMove(position, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = position.x + col;
                    const newY = position.y + row;
                    if (newX < 0 || newX >= this.COLS || newY >= this.ROWS) {
                        return false;
                    }
                    if (newY >= 0 && this.board[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    moveLeft() {
        // Если игра на паузе, снимаем паузу при нажатии
        if (this.isPaused) {
            this.togglePause();
            return;
        }
        // Защита от вызова в неподходящий момент
        if (this.gameOver || !this.currentPiece) {
            return;
        }
        const newPosition = { x: this.currentPosition.x - 1, y: this.currentPosition.y };
        if (this.isValidMove(newPosition, this.currentPiece.shape)) {
            this.currentPosition = newPosition;
            this.render();
        }
    }
    moveRight() {
        // Если игра на паузе, снимаем паузу при нажатии
        if (this.isPaused) {
            this.togglePause();
            return;
        }
        // Защита от вызова в неподходящий момент
        if (this.gameOver || !this.currentPiece) {
            return;
        }
        const newPosition = { x: this.currentPosition.x + 1, y: this.currentPosition.y };
        if (this.isValidMove(newPosition, this.currentPiece.shape)) {
            this.currentPosition = newPosition;
            this.render();
        }
    }
    moveDown() {
        // Если игра на паузе, снимаем паузу при нажатии
        if (this.isPaused) {
            this.togglePause();
            return false;
        }
        // Защита от вызова в неподходящий момент
        if (this.gameOver || !this.currentPiece) {
            return false;
        }
        const newPosition = { x: this.currentPosition.x, y: this.currentPosition.y + 1 };
        if (this.isValidMove(newPosition, this.currentPiece.shape)) {
            this.currentPosition = newPosition;
            this.render();
            return true;
        }
        else {
            this.lockPiece();
            return false;
        }
    }
    hardDrop() {
        // Если игра на паузе, снимаем паузу при нажатии
        if (this.isPaused) {
            this.togglePause();
            return;
        }
        if (this.gameOver || !this.currentPiece)
            return;
        while (this.moveDown()) {
            // Продолжаем двигать вниз пока можем
        }
    }
    rotate() {
        // Если игра на паузе, снимаем паузу при нажатии
        if (this.isPaused) {
            this.togglePause();
            return;
        }
        if (this.gameOver || !this.currentPiece)
            return;
        const rotatedShape = rotateTetromino(this.currentPiece.shape);
        // Пробуем повернуть на текущей позиции
        if (this.isValidMove(this.currentPosition, rotatedShape)) {
            this.currentPiece.shape = rotatedShape;
            this.render();
            return;
        }
        // Пробуем сдвинуть влево
        const leftPos = { x: this.currentPosition.x - 1, y: this.currentPosition.y };
        if (this.isValidMove(leftPos, rotatedShape)) {
            this.currentPosition = leftPos;
            this.currentPiece.shape = rotatedShape;
            this.render();
            return;
        }
        // Пробуем сдвинуть вправо
        const rightPos = { x: this.currentPosition.x + 1, y: this.currentPosition.y };
        if (this.isValidMove(rightPos, rotatedShape)) {
            this.currentPosition = rightPos;
            this.currentPiece.shape = rotatedShape;
            this.render();
            return;
        }
    }
    lockPiece() {
        if (!this.currentPiece)
            return;
        // Звук падения блока
        this.audioManager.playDropSound();
        const color = this.getTetrominoColor(this.currentPiece.type);
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const boardY = this.currentPosition.y + row;
                    const boardX = this.currentPosition.x + col;
                    if (boardY >= 0 && boardY < this.ROWS && boardX >= 0 && boardX < this.COLS) {
                        this.board[boardY][boardX] = color;
                    }
                }
            }
        }
        const linesBeforeClear = this.linesCleared;
        this.clearLines();
        // Даже если линии не были убраны, обновляем UI
        if (this.linesCleared === linesBeforeClear) {
            this.updateUI();
        }
        this.spawnNewPiece();
        this.render();
    }
    clearLines() {
        let linesCleared = 0;
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== null)) {
                this.board.splice(row, 1);
                this.board.unshift(Array(this.COLS).fill(null));
                linesCleared++;
                row++; // Проверяем эту же строку снова
            }
        }
        if (linesCleared > 0) {
            // Звук удаления линии
            this.audioManager.playRowCompleteSound();
            this.linesCleared += linesCleared;
            // Начисление очков
            const points = [
                0,
                GAME_CONFIG.POINTS.ONE_LINE,
                GAME_CONFIG.POINTS.TWO_LINES,
                GAME_CONFIG.POINTS.THREE_LINES,
                GAME_CONFIG.POINTS.FOUR_LINES
            ];
            const earnedPoints = points[linesCleared] * this.level;
            this.score += earnedPoints;
            console.log(`Убрано линий: ${linesCleared}, заработано очков: ${earnedPoints}, текущий счет: ${this.score}`);
            // Увеличение уровня каждые N линий
            const newLevel = Math.floor(this.linesCleared / GAME_CONFIG.LINES_PER_LEVEL) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.updateSpeed();
                // Звук нового уровня
                this.audioManager.playNewLevelSound();
                console.log(`Новый уровень: ${this.level}`);
            }
            this.updateUI();
        }
    }
    updateSpeed() {
        this.dropSpeed = Math.max(GAME_CONFIG.MIN_DROP_SPEED, GAME_CONFIG.INITIAL_DROP_SPEED - (this.level - 1) * GAME_CONFIG.SPEED_DECREASE_PER_LEVEL);
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = window.setInterval(() => {
                if (!this.isPaused && !this.gameOver) {
                    this.moveDown();
                }
            }, this.dropSpeed);
        }
    }
    render() {
        // Очистка canvas
        this.ctx.fillStyle = this.getCanvasBackground();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Рисуем сетку
        this.drawGrid();
        // Рисуем зафиксированные блоки
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                if (this.board[row][col]) {
                    this.drawBlock(col, row, this.board[row][col]);
                }
            }
        }
        // Рисуем текущую фигуру
        if (this.currentPiece) {
            const color = this.getTetrominoColor(this.currentPiece.type);
            for (let row = 0; row < this.currentPiece.shape.length; row++) {
                for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                    if (this.currentPiece.shape[row][col]) {
                        this.drawBlock(this.currentPosition.x + col, this.currentPosition.y + row, color);
                    }
                }
            }
        }
    }
    drawGrid() {
        this.ctx.strokeStyle = this.getGridColor();
        this.ctx.lineWidth = 1;
        for (let row = 0; row <= this.ROWS; row++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, row * this.BLOCK_SIZE);
            this.ctx.lineTo(this.COLS * this.BLOCK_SIZE, row * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
        for (let col = 0; col <= this.COLS; col++) {
            this.ctx.beginPath();
            this.ctx.moveTo(col * this.BLOCK_SIZE, 0);
            this.ctx.lineTo(col * this.BLOCK_SIZE, this.ROWS * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
    }
    drawBlock(x, y, color) {
        const outlineColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--block-outline').trim() || 'black';
        // Черная обводка
        this.ctx.fillStyle = outlineColor;
        this.ctx.fillRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
        // Цветная заливка (внутри обводки)
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.BLOCK_SIZE + 2, y * this.BLOCK_SIZE + 2, this.BLOCK_SIZE - 4, this.BLOCK_SIZE - 4);
        // Добавляем 3D эффект (блик)
        this.ctx.fillStyle = this.getBlockHighlight();
        this.ctx.fillRect(x * this.BLOCK_SIZE + 3, y * this.BLOCK_SIZE + 3, this.BLOCK_SIZE - 6, 3);
    }
    drawNextPiece() {
        this.nextCtx.fillStyle = this.getCanvasBackground();
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        if (this.nextPiece) {
            const color = this.getTetrominoColor(this.nextPiece.type);
            const blockSize = GAME_CONFIG.NEXT_BLOCK_SIZE;
            const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
            const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
            for (let row = 0; row < this.nextPiece.shape.length; row++) {
                for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                    if (this.nextPiece.shape[row][col]) {
                        const x = offsetX + col * blockSize;
                        const y = offsetY + row * blockSize;
                        const outlineColor = getComputedStyle(document.documentElement)
                            .getPropertyValue('--block-outline').trim() || 'black';
                        // Черная обводка
                        this.nextCtx.fillStyle = outlineColor;
                        this.nextCtx.fillRect(x, y, blockSize, blockSize);
                        // Цветная заливка из CSS переменных
                        this.nextCtx.fillStyle = color;
                        this.nextCtx.fillRect(x + 2, y + 2, blockSize - 4, blockSize - 4);
                        // Блик
                        this.nextCtx.fillStyle = this.getBlockHighlight();
                        this.nextCtx.fillRect(x + 3, y + 3, blockSize - 6, 3);
                    }
                }
            }
        }
    }
    updateUI() {
        const levelElement = document.getElementById('level');
        const scoreElement = document.getElementById('score');
        if (levelElement) {
            levelElement.textContent = this.level.toString();
        }
        if (scoreElement) {
            scoreElement.textContent = this.score.toString();
        }
        console.log(`UI обновлен: уровень ${this.level}, счет ${this.score}`);
    }
    endGame() {
        this.gameOver = true;
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        // Останавливаем музыку и играем звук окончания игры
        this.audioManager.stopBackgroundMusic();
        this.audioManager.playGameOverSound();
        // Сохранение результата в лидерборд
        const username = localStorage.getItem('tetris.username') || 'Аноним';
        const isTopScore = this.leaderboard.addEntry(username, this.score, this.level);
        const gameOverDiv = document.getElementById('gameOver');
        const finalScoreSpan = document.getElementById('finalScore');
        const leaderboardMessage = document.getElementById('leaderboardMessage');
        if (gameOverDiv)
            gameOverDiv.classList.remove('hidden');
        if (finalScoreSpan)
            finalScoreSpan.textContent = this.score.toString();
        // Показываем сообщение, если попал в топ
        if (leaderboardMessage) {
            if (isTopScore) {
                const position = this.leaderboard.getPosition(this.score);
                leaderboardMessage.textContent = `🎉 Вы попали в топ-${position}!`;
                leaderboardMessage.style.display = 'block';
            }
            else {
                leaderboardMessage.style.display = 'none';
            }
        }
        // Обновляем отображение лидерборда
        if (window.updateLeaderboardDisplay) {
            window.updateLeaderboardDisplay();
        }
    }
    getScore() {
        return this.score;
    }
    getLevel() {
        return this.level;
    }
    getLeaderboard() {
        return this.leaderboard;
    }
}
