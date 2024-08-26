// ===== HELPERS ===== 

// Returns a random integer between min and max
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* gets difficulty of the game
0: Easy
  1: Medium
  2: Hard
  3: Very Hard
  4: Evil
    Default to Medium if the number apart from [0, 4] is passed
*/
function getDifficulty(diff: number): number {
    let cellsToRemove: number;
    switch (diff) {
        case 0:
            cellsToRemove = 81 - getRandomInt(36, 49);
            break;
        case 1:
            cellsToRemove = 81 - getRandomInt(32, 35);
            break;
        case 2:
            cellsToRemove = 81 - getRandomInt(28, 31);
            break;
        case 3:
            cellsToRemove = 81 - getRandomInt(24, 27);
            break;
        case 4: 
            cellsToRemove = 81 - 17;
            break;
        default: 
            cellsToRemove = 81 - getRandomInt(32, 35);
    }
    return cellsToRemove;
}

// Returns true if element=[i,j] is present in the array
function hasACopy(i: number, j: number, array: number[][]): boolean {
    for (let elem of array) {
        if ((elem[0] === i) && (elem[1] === j)) {
            return true;
        }
    }
    return false 
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

// filter the array of numbers if the number is either in the row, column or box
function filterArray(board: number[][], array: number[], row: number, col: number): number[] {
    array = array.filter((elem) => {
        if (inRow(board, row, col, elem) || inCol(board, row, col, elem) || inBox(board, row, col, elem)) {
            return false;
        }
        return true;
    });
    return array;
}

// Returns a 9x9 board with all zeros
function getBoardWithZeros(): number[][] {
    let board: number[][] = []; 
    for (let row = 0; row < 9; row++) {
        board[row] = [];
        for (let col = 0; col < 9; col++) {
            board[row][col] = 0;
        }
    }
    return board;
}

// make a deep copy of the array
function deepCopy<T>(array: T): T {
    return JSON.parse(JSON.stringify(array));
}

export function duplicateBoard(board: number[][]): number[][] {
    let newBoard: number[][] = [];
    for (let row = 0; row < 9; row++) {
        newBoard[row] = [];
        for (let col = 0; col < 9; col++) {
            newBoard[row][col] = board[row][col];
        }
    }
    return newBoard;
}

// ===== SOVLE ===== 

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
export function isSolved(board: number[][]): boolean {
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



/*enerate a sudoku puzzle for a given difficulty level. 
  0: Easy
  1: Medium
  2: Hard
  3: Very Hard
  4: Evil
  Default to Medium if the number apart from [0, 4] is passed
*/
export function generateSudoku(diff: number) {
    let board = getCompletelyFilledBoard();
    let cellsToRemove: number = getDifficulty(diff);
    console.log(cellsToRemove);
    let visited: number[][] = [];
    for (let count = 0; count < cellsToRemove; count++) {
        let i = -1;
        let j = -1;
        while (true) {
            i = getRandomInt(0,8);
            j = getRandomInt(0,8);
            if (hasACopy(i, j, visited)) {
                continue;
            } else {
                break;
            }
        }
        let tempBoard = deepCopy(board);
        let temp = tempBoard[i][j];
        tempBoard[i][j] = 0;
        visited.push([i, j]);
        if (hasUnique(tempBoard)) {
            board[i][j] = 0;
        }
    }
    return board;
}

// Solves the board recursively using backtracking
export function solveBoard(board: number[][]): boolean {
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

// Returns a filled valid board with random numbers
function getCompletelyFilledBoard(): number[][] {
    let board: number[][] = getBoardWithZeros();

    function makeBoard(board: number[][]): boolean {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    let arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    arr = filterArray(board, arr, row, col);
                    while (arr.length > 0) {
                        let randomIndex: number = getRandomInt(0, arr.length - 1);
                        board[row][col] = arr[randomIndex];
                        let copyBoard: number[][] = deepCopy(board);
                        if (solveBoard(copyBoard)) {
                            if (makeBoard(board)) {
                                return true;
                            }
                        }
                        board[row][col] = 0;
                        arr.splice(randomIndex, 1); 
                    }
                    return false; 
                }
            }
        }
        return true;
    }

    makeBoard(board);
    return board;
}