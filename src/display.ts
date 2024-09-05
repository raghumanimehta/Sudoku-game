import {
    duplicateBoard,
    generateSudoku,
    getBoardWithZeros,
    isSolved,
    solveBoard
} from "./solve.js";

// Class that interacts with the selected cell
class SelectedCell {
    private currentCell: HTMLDivElement | null = null;
    private isNoteMode: boolean = false;
    
    SelectedCell() {
        this.resetIsSelected();
    }

    setCell(newCell: HTMLDivElement) {
        this.resetIsSelected();
        this.currentCell = newCell;
        this.currentCell.dataset.isSelected = '1'
        // Set row-col highlighting
        for (let row = 0; row < 9; row++) {
            const cell = document.getElementById(`cell-${row}-${newCell.dataset.column}`);
            if (cell === null) return;
            cell.dataset.isHighlighted = '1';
        }
        for (let col = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${newCell.dataset.row}-${col}`);
            if (cell === null) return;
            cell.dataset.isHighlighted = '1';
        }
    }

    toggleNoteMode() {
        this.isNoteMode = !this.isNoteMode;
        if (this.currentCell) {
            this.currentCell.classList.toggle('note-mode', this.isNoteMode);
        }
    }

    setValue(value: string) {
        if (this.currentCell === null) return;
        if (this.isNoteMode) {
            this.setNoteValue(value);
        } else {
            this.currentCell.innerHTML = value;
            this.currentCell.dataset.notes = '000000000';
            this.currentCell.classList.remove('note-mode');
        }
    }

    setNoteValue(value: string) {
        if (this.currentCell === null) return;
        const notes = this.currentCell.dataset.notes || '000000000';
        const index = parseInt(value) - 1;
        if (isNaN(index) || index < 0 || index > 8) return;
        
        const newNotes = notes.split('');
        newNotes[index] = newNotes[index] === '0' ? '1' : '0'; // Review later  
        this.currentCell.dataset.notes = newNotes.join('');
    }


    private resetIsSelected() {
        const cells = document.querySelectorAll('div.cell');
        cells.forEach(cell => {
            (cell as HTMLDivElement).dataset.isSelected = '0';
            (cell as HTMLDivElement).dataset.isHighlighted = '0';
        });
    }
}

let initialBoard: number[][]; // The initial board state
let difficulty: number;
let selectedCell: SelectedCell;

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
                    cell.addEventListener('click',()=>{
                        selectedCell.setCell(cell);
                    })
                } else {
                    cell = document.createElement('div');
                    cell.innerHTML = board[row][col].toString();
                    cell.dataset.disabled = '1';
                }
                cell.dataset.column = col.toString();
                cell.dataset.row = row.toString();
                cell.dataset.notes = '000000000';
                cell.className = 'cell';
                cell.id = `cell-${row}-${col}`;
                boxElement.appendChild(cell);
            }
        }

        container.appendChild(boxElement);
    }

    selectedCell = new SelectedCell();
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
                selectedCell.setValue(numberButtons[i].textContent || '');
            }
        });
    }
}

// add event listener the delete button
function setDeleteButton() {
    const deleteButton = document.querySelector('#delete');
    deleteButton?.addEventListener('click', function() {
        selectedCell.setValue('');
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
            alert('The puzzle is already solved!');
        } else {
            const tempBoard = duplicateBoard(getCurrentBoardState());
            const isSolvable = solveBoard(tempBoard);
            if (isSolvable) {
                displayBoard(tempBoard);
            } else {
                // the user is prompted to overwrite the current progress
                const isConfirmed = confirm('Do you want to overwrite your current progress and get the solution?');
                if (isConfirmed) {
                    const tempBoard = duplicateBoard(initialBoard);
                    solveBoard(tempBoard);
                    displayBoard(tempBoard);
                } 
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
        selectedCell.toggleNoteMode();
    });
}


