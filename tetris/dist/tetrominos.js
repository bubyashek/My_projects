// Определение всех типов тетрамино
// Примечание: поле color больше не используется - цвета берутся из theme.css
export const TETROMINOS = {
    I: {
        shape: [
            [1, 1, 1, 1]
        ],
        color: '', // Не используется
        type: 'I'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: '', // Не используется
        type: 'O'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: '', // Не используется
        type: 'T'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: '', // Не используется
        type: 'S'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: '', // Не используется
        type: 'Z'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        color: '', // Не используется
        type: 'J'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        color: '', // Не используется
        type: 'L'
    }
};
export function getRandomTetromino() {
    const types = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return Object.assign({}, TETROMINOS[randomType]);
}
export function rotateTetromino(shape) {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = [];
    for (let i = 0; i < cols; i++) {
        rotated[i] = [];
        for (let j = 0; j < rows; j++) {
            rotated[i][j] = shape[rows - 1 - j][i];
        }
    }
    return rotated;
}
