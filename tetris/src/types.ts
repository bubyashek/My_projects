export type Position = {
    x: number;
    y: number;
};

export type TetrominoShape = number[][];

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Tetromino {
    shape: TetrominoShape;
    type: TetrominoType;
}

