// Система управления звуками для игры Tetris

export class AudioManager {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private backgroundMusic: HTMLAudioElement | null = null;
    private isMuted: boolean = false;
    private musicVolume: number = 0.3; // 30% громкость для музыки
    private sfxVolume: number = 0.5;   // 50% громкость для звуковых эффектов

    constructor() {
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
    private initBackgroundMusic(): void {
        try {
            this.backgroundMusic = new Audio('assets/main-theme.mp3');
            this.backgroundMusic.volume = this.musicVolume;
            this.backgroundMusic.loop = true; // Зацикливание
            this.backgroundMusic.preload = 'auto';

        } catch (error) {
            console.warn('Ошибка инициализации фоновой музыки:', error);
        }
    }

    /**
     * Загрузка звукового файла
     */
    private loadSound(name: string, path: string): void {
        try {
            const audio = new Audio(path);
            audio.volume = this.sfxVolume;
            audio.preload = 'auto';
            this.sounds.set(name, audio);
        } catch (error) {
            console.warn(`Не удалось загрузить звук: ${path}`, error);
        }
    }

    /**
     * Воспроизведение звукового эффекта
     */
    public playSound(soundName: string): void {
        if (this.isMuted) return;

        const sound = this.sounds.get(soundName);
        if (sound) {
            // Клонируем звук для возможности одновременного воспроизведения
            const soundClone = sound.cloneNode(true) as HTMLAudioElement;
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
    public startBackgroundMusic(musicPath: string = 'assets/main-theme.mp3', delay: number = 1000): void {
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
        } catch (error) {
            console.warn('Ошибка создания фоновой музыки:', error);
        }
    }

    /**
     * Остановка фоновой музыки
     */
    public stopBackgroundMusic(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic = null;
        }
    }

    /**
     * Включение/выключение звука
     */
    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        localStorage.setItem('tetris-muted', this.isMuted.toString());

        if (this.isMuted) {
            // Выключаем музыку
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
            }
        } else {
            // Включаем музыку
            if (this.backgroundMusic) {
                // Возобновляем существующую музыку
                this.backgroundMusic.play().catch(error => {
                    console.warn('Ошибка возобновления музыки:', error);
                });
            } else {
                // Запускаем новую музыку, если её не было
                this.startBackgroundMusic();
            }
        }

        return this.isMuted;
    }

    /**
     * Установка громкости звуковых эффектов (0.0 - 1.0)
     */
    public setSfxVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.sounds.forEach(sound => {
            sound.volume = this.sfxVolume;
        });
    }

    /**
     * Установка громкости музыки (0.0 - 1.0)
     */
    public setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }

    /**
     * Проверка, выключен ли звук
     */
    public isSoundMuted(): boolean {
        return this.isMuted;
    }

    /**
     * Звук при падении блока
     */
    public playDropSound(): void {
        this.playSound('drop');
    }

    /**
     * Звук при удалении линии
     */
    public playRowCompleteSound(): void {
        this.playSound('rowComplete');
    }

    /**
     * Звук при переходе на новый уровень
     */
    public playNewLevelSound(): void {
        this.playSound('newLevel');
    }

    /**
     * Звук при окончании игры
     */
    public playGameOverSound(): void {
        this.playSound('gameOver');
    }

    /**
     * Звук при старте игры
     */
    public playGameStartSound(): void {
        this.playSound('gameStart');
    }

    /**
     * Очистка ресурсов
     */
    public dispose(): void {
        this.stopBackgroundMusic();
        this.sounds.clear();
    }
}

// Глобальный экземпляр аудио-менеджера
let audioManagerInstance: AudioManager | null = null;

/**
 * Получение глобального экземпляра аудио-менеджера
 */
export function getAudioManager(): AudioManager {
    if (!audioManagerInstance) {
        audioManagerInstance = new AudioManager();
    }
    return audioManagerInstance;
}

