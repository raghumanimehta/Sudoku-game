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
    
    const container = document.querySelector('#container');
    if (!container) {
        return;
    }
    
    for (let box = 0; box < 9; box++) {
        const startRow = (box - box%3);
        const startCol = (box%3)*3;
        
        let boxElement = document.createElement('span');
        boxElement.classList.add('box');

        for (let row = startRow; row < startRow+3; row++) {
            for (let col = startCol; col < startCol+3; col++) {
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
                boxElement.appendChild(cell);
            }
        }

        container.appendChild(boxElement);
    }
}

// Resets the 'data-is-selected' data attribtue for all cells
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

// Returns the current board state by reading the Dom
function getCurrentBoardState(): number[][] {
    const cells = document.querySelectorAll('div.cell');
    const out = getBoardWithZeros();

    let currentCellIndex = 0;
    for (let box = 0; box < 9; box++) {
        const startRow = (box - box%3);
        const startCol = (box%3)*3;

        for (let row = startRow; row < startRow+3; row++) {
            for (let col = startCol; col < startCol+3; col++) {
                const cell = cells[currentCellIndex];
                let cellValue = parseInt(cell.innerHTML);
                if (Number.isNaN(cellValue)) {
                    out[row][col] = 0;
                } else {
                    out[row][col] = cellValue;
                }
                currentCellIndex++;
            }
        }
    }
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
                // TODO: Decide if the user edits are overwritten?
                alert('This puzzle is not solvable :(, (TODO)');
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
