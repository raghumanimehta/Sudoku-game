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


// Returns a random integer between min and max
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


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


function hasACopy(i: number, j: number, array: number[][]): boolean {
    // let curr: number = 0;
    // let searchElem: number[] = [i,j];
    for (let elem of array) {
        if ((elem[0] === i) && (elem[1] === j)) {
            return true;
        }
        // curr++
    }
    return false 
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

/*enerate a sudoku puzzle for a given difficulty level. 
  0: Easy
  1: Medium
  2: Hard
  3: Very Hard
  4: Evil
  Default to Medium if the number apart from [0, 4] is passed
*/
function generateSudoku(diff: number) {
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

// Example usage
let newBoard: number[][] = getCompletelyFilledBoard();
console.log(newBoard);
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

function duplicateBoard(board: number[][]): number[][] {
    let newBoard: number[][] = [];
    for (let row = 0; row < 9; row++) {
        newBoard[row] = [];
        for (let col = 0; col < 9; col++) {
            newBoard[row][col] = board[row][col];
        }
    }
    return newBoard;
}

////////////////////////// DISPLAYING THE PAGE //////////////////////////


let solvedBoard: number[][]; // The solved board
let lastFocusedInput: HTMLInputElement | null = null; // The last focused input
let currentBoard: number[][]; // The current board

document.addEventListener('DOMContentLoaded', function() {
    const difficulty = parseInt(localStorage.getItem('dif') || '0');
    displayDifficulty(difficulty);
    displayBoardInDefaultMode(difficulty);
    setNumberButtons();
    attachFocusListeners();
    disableKeyboardInputs();
    setDeleteButton();
    setCheckButton();
    setSolveButton();
});

// Display the board in the default mode
function displayBoardInDefaultMode(difficulty: number) {
    let board: number[][] = generateSudoku(difficulty);
    currentBoard = board;
    solvedBoard = duplicateBoard(board);
    solveBoard(solvedBoard);
   
    const container = document.getElementById('container');
    if (container) {
        container.innerHTML = '';
    }
    
    for (let row: number = 0; row < 9; row++) {
        for (let col: number = 0; col < 9; col++) {
            let cell: HTMLElement;
            if (board[row][col] === 0) {
                cell = document.createElement('input');
                (cell as HTMLInputElement).type = 'number';
                (cell as HTMLInputElement).maxLength = 1;
                (cell as HTMLInputElement).min = '1';
                (cell as HTMLInputElement).max = '9';
            } else {
                cell = document.createElement('div');
                cell.innerText = board[row][col].toString();
            }
            cell.className = 'cell';
            cell.id = `cell-${row}-${col}`;
            if (container) {
                container.appendChild(cell);
            }
        }
    }
}

// Displays the difficulty level
function displayDifficulty(difficulty: number) {
    const difficultyElement = document.getElementById('difficulty');
    if (difficultyElement) {
        switch (difficulty) {
            case 0:
                difficultyElement.innerText = 'Difficulty: Easy';
                break;
            case 1:
                difficultyElement.innerText = 'Difficulty: Medium';
                break;
            case 2:
                difficultyElement.innerText = 'Difficulty: Hard';
                break;
            case 3:
                difficultyElement.innerText = 'Difficulty: Very Hard';
                break;
            case 4:
                difficultyElement.innerText = 'Difficulty: Evil';
                break;
            default:
                difficultyElement.innerText = 'Difficulty: Medium';
        }
    }
}

// Add event listeners to number buttons 
function setNumberButtons(): void {
    const numberButtons = document.getElementsByClassName('numberButtons');
    
    for (let i = 0; i < numberButtons.length; i++) {
        numberButtons[i].addEventListener('click', function() {
            if (lastFocusedInput) {
                lastFocusedInput.value = numberButtons[i].textContent || '';
            }
        });
    }
}

// Attach focus listeners to all inputs to track the last focused one
function attachFocusListeners() {
    const inputs = document.querySelectorAll('input.cell');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            lastFocusedInput = input as HTMLInputElement;
        });
    });
}

// Get the selected cell
function getSelectedCell(): HTMLElement | null {
    return lastFocusedInput;
}

// Disable keyboard inputs for all keys except up and down arrows
function disableKeyboardInputs() {
    document.addEventListener('keydown', function(event) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            event.preventDefault();
        }
    });
    document.addEventListener('keypress', function(event) {
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            event.preventDefault();
        }
    });
}

// add event listener the delete button
function setDeleteButton() {
    const deleteButton = document.getElementById('delete');
    deleteButton?.addEventListener('click', function() {
        const cell = getSelectedCell();
        if (cell) {
            (cell as HTMLInputElement).value = '';
        }
    });
}

// add event listener to the check button. It checks if the puzzle is solved or not.
function setCheckButton() {
    const checkButton = document.getElementById('checkButton');
    checkButton?.addEventListener('click', function() {
        if (isSolved(currentBoard)) {
            alert('Congratulations! You have solved the puzzle!');
        } else {
            alert('The puzzle is either not solved yet or you have submitted a wrong solution!');
        }
    });
}

function setSolveButton() {
    const solveButton = document.getElementById('solveButton');
    solveButton?.addEventListener('click', function() {
        if (isSolved(currentBoard)) {
            alert('The puzzle is already solved!');
        } else {
            displayBoard(solvedBoard);
        }
    });
}

function displayBoard(board: number[][]) {
    for (let row: number = 0; row < 9; row++) {
        for (let col: number = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (cell) {
                (cell as HTMLDivElement).innerText = board[row][col].toString();
            }
        }
    }
}