# 🏗️ Архитектура проекта Tetris

## Принципы дизайна

### ✅ Single Source of Truth (Единый источник правды)

**Цвета**: Все цвета определяются **только** в `theme.css` как CSS переменные. JavaScript читает их через `getComputedStyle()`.

```
theme.css (определяет)
    ↓
    CSS переменные (--bg-canvas, --border-primary, etc.)
    ↓
game.ts (читает через getComputedStyle)
```

**Почему это важно:**
- ❌ **До**: Цвета были в двух местах (CSS + JS config)
- ✅ **Сейчас**: Один источник правды → проще менять тему
- 🎯 Изменение в `theme.css` → автоматически применяется везде

### 📦 Модульная структура

```
src/
├── types.ts          # TypeScript интерфейсы
├── config.ts         # Игровые константы (размеры, очки, скорость)
├── tetrominos.ts     # Фигуры и цвета тетрамино
├── leaderboard.ts    # Логика лидерборда
├── game.ts           # Основная игровая логика
└── main.ts           # Точка входа, инициализация
```

## Потоки данных

### 🎨 Поток цветов

```
1. Определение в theme.css:
   :root {
       --bg-canvas: #ffffff;
   }

2. Применение в styles.css:
   #gameCanvas {
       background: var(--bg-canvas);
   }

3. Чтение в game.ts:
   getCanvasBackground(): string {
       return getComputedStyle(document.documentElement)
           .getPropertyValue('--bg-canvas').trim();
   }

4. Использование:
   this.ctx.fillStyle = this.getCanvasBackground();
```

### 🎮 Игровой цикл

```
main.ts
  ↓
TetrisGame.constructor()
  ↓
start() → startGameLoop()
  ↓
setInterval() каждые N мс
  ↓
moveDown()
  ↓
render() → drawGrid() + drawBlock()
  ↓
Canvas API рисует на экране
```

### 🏆 Поток лидерборда

```
Game Over
  ↓
TetrisGame.handleGameOver()
  ↓
leaderboard.addEntry(name, score, level)
  ↓
Проверка личного рекорда
  ↓
localStorage.setItem('tetris-leaderboard', JSON)
  ↓
window.updateLeaderboardDisplay()
  ↓
renderLeaderboard() обновляет DOM
```

## Ключевые классы

### `TetrisGame` (game.ts)

**Ответственность**: Основная игровая логика

**Ключевые методы:**
- `start()` - запускает игру
- `moveDown()`, `moveLeft()`, `moveRight()` - движение
- `rotate()` - поворот фигуры
- `isValidMove()` - проверка коллизий
- `lockPiece()` - фиксация фигуры
- `clearLines()` - удаление заполненных линий
- `render()` - отрисовка игрового поля

**Источники данных:**
- `GAME_CONFIG` - константы игры
- CSS переменные - цвета (через `getComputedStyle`)
- `TETROMINOS` - определения фигур

### `Leaderboard` (leaderboard.ts)

**Ответственность**: Управление таблицей рекордов

**Ключевые методы:**
- `addEntry()` - добавить результат (только если личный рекорд)
- `getEntries()` - получить топ-10
- `getPlayerBest()` - лучший результат игрока
- `load()` / `save()` - работа с localStorage

**Логика умного сохранения:**
```typescript
if (existingBest && existingBest.score >= score) {
    return false; // Не сохраняем худший результат
}
```

## Конфигурация vs Тема

### `config.ts` - Игровая механика
- ✅ Размеры поля (ROWS, COLS, BLOCK_SIZE)
- ✅ Скорость игры (INITIAL_DROP_SPEED, MIN_DROP_SPEED)
- ✅ Очки за линии (POINTS)
- ✅ Прогрессия уровней (LINES_PER_LEVEL)

### `theme.css` - Визуальное оформление
- ✅ Все цвета (фоны, границы, текст)
- ✅ Тени и прозрачности
- ✅ Цвета тетрамино (дублируются в `tetrominos.ts`)

### `tetrominos.ts` - Определения фигур
- ✅ Формы тетрамино (массивы 0 и 1)
- ✅ Цвета тетрамино (синхронизированы с `theme.css`)

## Паттерны проектирования

### 1. **Module Pattern** (ES6 модули)
Каждый файл экспортирует конкретную функциональность:
```typescript
export class TetrisGame { ... }
export const GAME_CONFIG = { ... }
```

### 2. **Single Responsibility Principle**
- `game.ts` - только игровая логика
- `leaderboard.ts` - только управление рекордами
- `tetrominos.ts` - только определения фигур

### 3. **Dependency Injection**
```typescript
constructor(canvasId: string, nextCanvasId: string, username: string) {
    this.canvas = document.getElementById(canvasId);
    // ...
}
```

### 4. **CSS Variables + JS Integration**
Использование `getComputedStyle()` для чтения CSS переменных:
```typescript
private getCanvasBackground(): string {
    return getComputedStyle(document.documentElement)
        .getPropertyValue('--bg-canvas').trim() || '#ffffff';
}
```

## Управление состоянием

### Локальное состояние (в TetrisGame)
- `board` - игровое поле (2D массив)
- `currentPiece` - текущая падающая фигура
- `nextPiece` - следующая фигура
- `score`, `level`, `linesCleared` - игровой прогресс
- `gameOver`, `isPaused` - флаги состояния

### Глобальное состояние (localStorage)
- `tetris-username` - имя игрока
- `tetris-leaderboard` - топ-10 рекордов (JSON)

## Производительность

### Оптимизации
1. **Кэширование DOM элементов** в constructor
2. **requestAnimationFrame не используется** - используем `setInterval` для предсказуемой скорости
3. **Минимальные перерисовки** - только при изменении состояния
4. **Lazy Loading** - CSS переменные читаются только при рендере

### Потенциальные улучшения
- [ ] Использовать `requestAnimationFrame` для плавности
- [ ] Кэшировать значения CSS переменных
- [ ] Использовать Web Workers для сложных расчетов
- [ ] Добавить виртуализацию для длинного лидерборда

## Тестирование

### Что можно тестировать
- ✅ `isValidMove()` - проверка коллизий
- ✅ `clearLines()` - подсчет очков
- ✅ `rotateTetromino()` - поворот фигур
- ✅ `leaderboard.addEntry()` - логика личных рекордов

### Пример теста (псевдокод)
```typescript
test('should not add score worse than personal best', () => {
    leaderboard.addEntry('Player1', 1000, 5);
    const result = leaderboard.addEntry('Player1', 500, 3);
    expect(result).toBe(false);
    expect(leaderboard.getPlayerBest('Player1').score).toBe(1000);
});
```

## Расширяемость

### Как добавить новую тему
1. Измените переменные в `theme.css`
2. ✅ Готово! JavaScript автоматически подхватит новые цвета

### Как добавить новую фигуру
1. Добавьте тип в `types.ts`
2. Определите форму и цвет в `tetrominos.ts`
3. Добавьте CSS переменную в `theme.css` (опционально)

### Как изменить игровую механику
1. Обновите константы в `config.ts`
2. Обновите логику в `game.ts` (если нужно)
3. ✅ Тема остается независимой

## Зависимости

### Runtime
- Нет внешних зависимостей! 🎉
- Только нативные Web APIs:
  - Canvas API (рисование)
  - localStorage API (сохранение)
  - DOM API (взаимодействие)

### Development
- TypeScript (^5.2.2) - компиляция
- Node.js + npm - управление пакетами
- Python 3 (http.server) - локальный сервер

## Диаграмма зависимостей

```
theme.css (CSS переменные)
    ↓
styles.css (использует переменные)
    ↓
HTML (подключает стили)
    ↓
main.ts (точка входа)
    ↓
game.ts (использует все)
    ├── types.ts
    ├── config.ts (только механика!)
    ├── tetrominos.ts
    └── leaderboard.ts

getComputedStyle() - мост между CSS и JS
```

---

**Дата последнего обновления**: 5 октября 2025  
**Версия**: 1.8

