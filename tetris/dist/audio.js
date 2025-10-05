// Система управления звуками для игры Tetris
export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.backgroundMusic = null;
        this.isMuted = false;
        this.musicVolume = 0.3; // 30% громкость для музыки
        this.sfxVolume = 0.5; // 50% громкость для звуковых эффектов
        // Загружаем все звуковые эффекты
        this.loadSound('drop', 'assets/drop-sound.wav');
        this.loadSound('rowComplete', 'assets/row-complete.wav');
        this.loadSound('newLevel', 'assets/new-lever.wav');
        this.loadSound('gameOver', 'assets/game-over.wav');
        this.loadSound('gameStart', 'assets/game-start.wav');
        // Проверяем сохраненные настройки звука
        const savedMuteState = localStorage.getItem('tetris-muted');
        if (savedMuteState === 'true') {
            this.isMuted = true;
        }
        // Инициализируем фоновую музыку сразу
        this.initBackgroundMusic();
    }
    /**
     * Инициализация фоновой музыки при загрузке
     */
    initBackgroundMusic() {
        try {
            this.backgroundMusic = new Audio('assets/main-theme.mp3');
            this.backgroundMusic.volume = this.musicVolume;
            this.backgroundMusic.loop = true; // Зацикливание
            this.backgroundMusic.preload = 'auto';
        }
        catch (error) {
            console.warn('Ошибка инициализации фоновой музыки:', error);
        }
    }
    /**
     * Загрузка звукового файла
     */
    loadSound(name, path) {
        try {
            const audio = new Audio(path);
            audio.volume = this.sfxVolume;
            audio.preload = 'auto';
            this.sounds.set(name, audio);
        }
        catch (error) {
            console.warn(`Не удалось загрузить звук: ${path}`, error);
        }
    }
    /**
     * Воспроизведение звукового эффекта
     */
    playSound(soundName) {
        if (this.isMuted)
            return;
        const sound = this.sounds.get(soundName);
        if (sound) {
            // Клонируем звук для возможности одновременного воспроизведения
            const soundClone = sound.cloneNode(true);
            soundClone.volume = this.sfxVolume;
            soundClone.play().catch(error => {
                console.warn(`Ошибка воспроизведения звука ${soundName}:`, error);
            });
        }
    }
    /**
     * Запуск фоновой музыки с задержкой для совместимости с браузерами
     * Используем main-theme.mp3 для фоновой музыки
     */
    startBackgroundMusic(musicPath = 'assets/main-theme.mp3', delay = 1000) {
        // Если музыка уже создана, просто запускаем её
        if (this.backgroundMusic) {
            // Запускаем только если не выключена и не играет уже
            if (!this.isMuted && this.backgroundMusic.paused) {
                // Отложенный запуск для надежности
                setTimeout(() => {
                    if (this.backgroundMusic && !this.isMuted && this.backgroundMusic.paused) {
                        this.backgroundMusic.play().catch(error => {
                            console.warn('Не удалось запустить фоновую музыку:', error);
                        });
                    }
                }, delay);
            }
            return;
        }
        // Создаем новую музыку (обычно не нужно, так как создается в конструкторе)
        try {
            this.backgroundMusic = new Audio(musicPath);
            this.backgroundMusic.volume = this.musicVolume;
            this.backgroundMusic.loop = true;
            this.backgroundMusic.preload = 'auto';
            // Обработчик окончания для перезапуска
            this.backgroundMusic.addEventListener('ended', () => {
                if (this.backgroundMusic && !this.isMuted) {
                    this.backgroundMusic.currentTime = 0;
                    this.backgroundMusic.play().catch(error => {
                        console.warn('Ошибка перезапуска музыки:', error);
                    });
                }
            });
            // Отложенный запуск
            if (!this.isMuted) {
                setTimeout(() => {
                    if (this.backgroundMusic && !this.isMuted) {
                        this.backgroundMusic.play().catch(error => {
                            console.warn('Не удалось запустить фоновую музыку:', error);
                        });
                    }
                }, delay);
            }
        }
        catch (error) {
            console.warn('Ошибка создания фоновой музыки:', error);
        }
    }
    /**
     * Остановка фоновой музыки
     */
    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic = null;
        }
    }
    /**
     * Включение/выключение звука
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('tetris-muted', this.isMuted.toString());
        if (this.isMuted) {
            // Выключаем музыку
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
            }
        }
        else {
            // Включаем музыку
            if (this.backgroundMusic) {
                // Возобновляем существующую музыку
                this.backgroundMusic.play().catch(error => {
                    console.warn('Ошибка возобновления музыки:', error);
                });
            }
            else {
                // Запускаем новую музыку, если её не было
                this.startBackgroundMusic();
            }
        }
        return this.isMuted;
    }
    /**
     * Установка громкости звуковых эффектов (0.0 - 1.0)
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => {
            sound.volume = this.sfxVolume;
        });
    }
    /**
     * Установка громкости музыки (0.0 - 1.0)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }
    /**
     * Проверка, выключен ли звук
     */
    isSoundMuted() {
        return this.isMuted;
    }
    /**
     * Звук при падении блока
     */
    playDropSound() {
        this.playSound('drop');
    }
    /**
     * Звук при удалении линии
     */
    playRowCompleteSound() {
        this.playSound('rowComplete');
    }
    /**
     * Звук при переходе на новый уровень
     */
    playNewLevelSound() {
        this.playSound('newLevel');
    }
    /**
     * Звук при окончании игры
     */
    playGameOverSound() {
        this.playSound('gameOver');
    }
    /**
     * Звук при старте игры
     */
    playGameStartSound() {
        this.playSound('gameStart');
    }
    /**
     * Очистка ресурсов
     */
    dispose() {
        this.stopBackgroundMusic();
        this.sounds.clear();
    }
}
// Глобальный экземпляр аудио-менеджера
let audioManagerInstance = null;
/**
 * Получение глобального экземпляра аудио-менеджера
 */
export function getAudioManager() {
    if (!audioManagerInstance) {
        audioManagerInstance = new AudioManager();
    }
    return audioManagerInstance;
}
