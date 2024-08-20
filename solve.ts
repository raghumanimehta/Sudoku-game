let boardEmpty: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let boardCompleteExceptOne: number[][] = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 0]
];


let exampleQuestionBoard: number[][] = [
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

let exampleQuestionBoardSolved: number[][] = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

// Returns true if the incomplete board exactly a single solution
function hasUnique(board: number[][]): boolean {
    if (isSolved(board)) return true;

    // returns the number of solutions
    function hasUniqueHelper(board: number[][]): number {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) { // Check if empty cell exists
                    let numberOfSolutions = 0;
                    for (let num = 1; num <= 9; num++) { // then fill
                        if (isValid(board, row, col, num)) { // ignore
                            board[row][col] = num;
                            if (isSolved(board)) { // returns true if board is solved
                                numberOfSolutions++;
                            } else {
                                numberOfSolutions += hasUniqueHelper(board);
                                board[row][col] = 0; // some cells are empty
                            }
                        }
                    }
                    return numberOfSolutions;
                }
            }
        }
        return -1;
    }

    return hasUniqueHelper(board) == 1;
}

// returns true if the board is already solved
function isSolved(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return false;   
            }
            if (!isValid(board, row, col, board[row][col])) {
                return false;
            }
        }
    }
    return true;
}

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

// Returns true if the num is allowed in the give row and col of given board
function isValid(board: number[][], row: number, col: number, num: number): boolean {
    return !inRow(board, row, col, num) && !inCol(board, row, col, num) && !inBox(board, row, col, num);
}

// Checks if a number is valid in a given row
function inRow(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num && (i !== col)) {
            return true;
        }
    }
    return false;
}

// Checks if a number is valid in a given column
function inCol(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num && (i !== row)) {
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
            if (board[i][j] === num && (row !== i) && (col !== j)) {
                return true;
            }
        }
    }
    return false;
}
