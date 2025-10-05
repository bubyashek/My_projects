import { Tetromino, TetrominoType } from './types.js';

// Определение всех типов тетрамино
// Примечание: поле color больше не используется - цвета берутся из theme.css
export const TETROMINOS: Record<TetrominoType, Tetromino> = {
    I: {
        shape: [
            [1, 1, 1, 1]
        ],
        type: 'I'
    },
    O: {
        shape: [
            [1, 1],
            [1, 1]
        ],
        type: 'O'
    },
    T: {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        type: 'T'
    },
    S: {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        type: 'S'
    },
    Z: {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        type: 'Z'
    },
    J: {
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        type: 'J'
    },
    L: {
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        type: 'L'
    }
};

export function getRandomTetromino(): Tetromino {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return { ...TETROMINOS[randomType] };
}

export function rotateTetromino(shape: number[][]): number[][] {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated: number[][] = [];
    
    for (let i = 0; i < cols; i++) {
        rotated[i] = [];
        for (let j = 0; j < rows; j++) {
            rotated[i][j] = shape[rows - 1 - j][i];
        }
    }
    
    return rotated;
}

