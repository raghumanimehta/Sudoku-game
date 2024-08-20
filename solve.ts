// Board is a 2D list of integers
// let board1: number[][] = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0]
// ];

let board: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 1, 2],
    [0, 0, 0, 0, 0, 0, 0, 3, 4],
    [0, 0, 0, 0, 0, 0, 0, 5, 6],
    [0, 0, 0, 0, 0, 0, 0, 7, 8],
    [0, 0, 0, 0, 0, 0, 0, 9, 1],
    [0, 0, 0, 0, 0, 0, 0, 2, 3],
    [0, 0, 0, 0, 0, 0, 0, 4, 5],
    [0, 0, 0, 0, 0, 0, 0, 6, 7],
    [0, 0, 0, 0, 0, 0, 0, 8, 9]
];

// Solves the board recursively using backtracking
function solveBoard(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveBoard(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// function isUnique(board: number[][], count: number): boolean {
//     // let count = 0;
//     for (let row = 0; row < 9; row++) {
//         for (let col = 0; col < 9; col++) {
//             if (board[row][col] === 0) {
//                 for (let num = 1; num <= 9; num++) {
//                     if (isValid(board, row, col, num)) {
//                         board[row][col] = num;
//                         count++;
//                         if (isUnique(board, count)) {
//                             return true;
//                         }
//                         board[row][col] = 0;
//                     }
//                 }
//                 return false;
//             }
//         }
//     }
//     return true;
// }

function isValid(board: number[][], row: number, col: number, num: number): boolean {
    return !inRow(board, row, num) && !inCol(board, col, num) && !inBox(board, row, col, num);
}

// Checks if a number is valid in a given row
function inRow(board: number[][], row: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) {
            return true;
        }
    }
    return false;
}

// Checks if a number is valid in a given column
function inCol(board: number[][], col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) {
            return true;
        }
    }
    return false;
}

// Checks if a number is valid in a given box
function inBox(board: number[][], row: number, col: number, num: number): boolean {
    let start_row = Math.floor(row / 3) * 3;
    let start_col = Math.floor(col / 3) * 3;
    for (let i = start_row; i < start_row + 3; i++) {
        for (let j = start_col; j < start_col + 3; j++) {
            if (board[i][j] === num) {
                return true;
            }
        }
    }
    return false;
}
solveBoard(board);
console.log(board2);
