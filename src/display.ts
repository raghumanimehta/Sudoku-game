import {
    duplicateBoard,
    generateSudoku,
    getBoardWithZeros,
    isSolved,
    solveBoard
} from "./solve.js";

let selectedCell: HTMLDivElement | null = null; // The last focused input
let initialBoard: number[][]; // The initial board state
let difficulty: number;

document.addEventListener('DOMContentLoaded', function() {
    difficulty = parseInt(localStorage.getItem('dif') || '0');
    displayDifficulty();
    initializeBoard();
    
    setClearButton();
    setSolveButton();
    setCheckButton();
    setTogleNoteModeButton();

    setNumberButtons();
    setDeleteButton();
});

// Display the board in the default mode
function initializeBoard() {
    let board: number[][] = generateSudoku(difficulty);
    initialBoard = board;
    
    const container = document.getElementById('container');
    if (container) {
        container.innerHTML = '';
    }
    
    for (let row: number = 0; row < 9; row++) {
        for (let col: number = 0; col < 9; col++) {
            let cell: HTMLDivElement;
            if (board[row][col] === 0) {
                cell = document.createElement('div');
                cell.dataset.disabled = '0';
                cell.dataset.isSelected = '0';
                cell.addEventListener('click',()=>{
                    resetIsSelected()
                    cell.dataset.isSelected = '1';
                    selectedCell = cell;
                })
            } else {
                cell = document.createElement('div');
                cell.innerHTML = board[row][col].toString();
                cell.dataset.disabled = '1';
            }
            cell.className = 'cell';
            cell.id = `cell-${row}-${col}`;
            if (container) {
                container.appendChild(cell);
            }
        }
    }
}

// Resets the is selected data attribtue for all cells
function resetIsSelected() {
    const cells = document.querySelectorAll('div.cell');

    cells.forEach(cell => {
        (cell as HTMLDivElement).dataset.isSelected = '0';
    });
}

// Displays the difficulty level
function displayDifficulty() {
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
            if (selectedCell) {
                selectedCell.innerHTML = numberButtons[i].textContent || '';
            }
        });
    }
}

// add event listener the delete button
function setDeleteButton() {
    const deleteButton = document.querySelector('#delete');
    deleteButton?.addEventListener('click', function() {
        if (selectedCell) {
            selectedCell.innerHTML = '';
            selectedCell = null;
            resetIsSelected();
        }
    });
}

// checks if the puzzle is solved or not on click
function setCheckButton() {
    const checkButton = document.getElementById('checkButton');
    checkButton?.addEventListener('click', function() {
        if (isSolved(getCurrentBoardState())) {
            alert('Congratulations! You have solved the puzzle!');
        } else {
            alert('The puzzle is either not solved yet or you have submitted a wrong solution!');
        }
    });
}

// updates the board to original state
function setClearButton() {
    const checkButton = document.getElementById('clearButton');
    checkButton?.addEventListener('click', function() {
        displayBoard(initialBoard);
    });
}

function getCurrentBoardState(): number[][] {
    const cells = document.querySelectorAll('div.cell');
    const out = getBoardWithZeros();

    for (let row = 0; row < out.length; row++) {
        for (let col = 0; col < out[row].length; col++) {
            const cell = cells[row*9+col];
            let cellValue = parseInt(cell.innerHTML);
            if (Number.isNaN(cellValue)) {
                out[row][col] = 0;
            } else {
                out[row][col] = cellValue;
            }
        }
    }
    console.log(out);
    return out;
}

// solves the board on click
function setSolveButton() {
    const solveButton = document.getElementById('solveButton');
    solveButton?.addEventListener('click', function() {
        if (isSolved(getCurrentBoardState())) {
            alert('The puzzle is solved!');
        } else {
            const tempBoard = duplicateBoard(getCurrentBoardState());
            const isSolvable = solveBoard(tempBoard);
            if (isSolvable) {
                displayBoard(tempBoard);
            } else {
                // This error should never occur if generating 
                //    and solving algorithm are correctly implemented
                alert('This puzzle is not solvable :(, (UNEXPECTED ERROR)');
            }
        }
    });
}

// Overwrites the HTMLDom board with given board
function displayBoard(board: number[][]) {
    for (let row: number = 0; row < 9; row++) {
        for (let col: number = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (cell) {
                let value = '';
                if (board[row][col] != 0) {
                    value = board[row][col].toString();
                }
                (cell as HTMLDivElement).innerText = value;
            }
        }
    }
}

// toggles the note mode for sudoku on click
function setTogleNoteModeButton() {
    const toggleNoteButton = document.getElementById('noteButton');
    toggleNoteButton?.addEventListener('click', function() {
        alert("Function not implemented.");
    });
}
