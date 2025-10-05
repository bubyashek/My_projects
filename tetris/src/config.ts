// Конфигурация игры Tetris

export const GAME_CONFIG = {
    // Размеры игрового поля
    ROWS: 21,  // Увеличено с 20 до 21 (чтобы помещалась нижняя строка)
    COLS: 10,
    BLOCK_SIZE: 35,  // Увеличен размер блока
    
    // Начальные значения
    INITIAL_LEVEL: 1,
    INITIAL_DROP_SPEED: 700, // миллисекунды
    
    // Прогрессия сложности
    LINES_PER_LEVEL: 10,
    SPEED_DECREASE_PER_LEVEL: 50, // миллисекунды
    MIN_DROP_SPEED: 100, // минимальная скорость падения
    
    // Очки за линии
    POINTS: {
        ONE_LINE: 100,
        TWO_LINES: 300,
        THREE_LINES: 500,
        FOUR_LINES: 800
    } as const,
    
    // Размеры canvas для превью следующей фигуры
    NEXT_CANVAS_WIDTH: 120,
    NEXT_CANVAS_HEIGHT: 120,
    NEXT_BLOCK_SIZE: 25
} as const;

