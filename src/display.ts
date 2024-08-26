import {
    duplicateBoard,
    generateSudoku,
    isSolved,
    solveBoard
} from "./solve.js";

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
            let cell: HTMLInputElement;
            if (board[row][col] === 0) {
                cell = document.createElement('input');
                // cell.type = '';
                cell.maxLength = 1;
                // cell.min = '1';
                // cell.max = '9';
            } else {
                cell = document.createElement('input');
                cell.value = board[row][col].toString();
                cell.disabled = true;
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

// TODO
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

// TODO
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