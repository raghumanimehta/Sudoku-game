import {
    duplicateBoard,
    generateSudoku,
    getBoardWithZeros,
    isSolved,
    solveBoard
} from "./solve.js";

// Class that manages interactions with the selected cell in the Sudoku grid
class SelectedCell {
    private currentCell: HTMLDivElement | null = null;
    
    // Constructor to reset the selected state of all cells
    SelectedCell() {
        this.resetIsSelected();
    }

    /**
     * Sets a new cell as the currently selected cell.
     * @param {HTMLDivElement} newCell - The cell to be set as selected.
     */
    setCell(newCell: HTMLDivElement) {
        this.resetIsSelected();
        this.currentCell = newCell;
        this.currentCell.dataset.isSelected = '1';
        
        // Highlight the row and column of the selected cell
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

    /**
     * Toggles the note mode on the selected cell, allowing multiple notes to be added.
     */
    toggleNoteMode(): void {
        if (this.currentCell == null) return;
        if (this.isNoteModeActivated()) {
            this.currentCell.classList.remove('note-mode');
            this.currentCell.innerHTML = '';
        } else {
            this.currentCell.classList.add('note-mode');
            for (let i = 1; i < 10; i++) {
                const subNote = document.createElement('div');
                subNote.classList.add(`sub-note`);
                subNote.innerHTML = `${i}`;
                this.currentCell.appendChild(subNote);
            }
        }
    }

    /**
     * Checks if the note mode is activated on the selected cell.
     * @returns {boolean} - True if note mode is activated, otherwise false.
     */
    isNoteModeActivated(): boolean {
        if (this.currentCell == null) return false;
        return this.currentCell.classList.contains('note-mode');
    }

    /**
     * Sets a value in the selected cell. Handles both normal and note mode.
     * @param {string} value - The value to set in the cell.
     */
    setValue(value: string): void {
        if (this.currentCell === null) return;
        if (this.isNoteModeActivated()) {
            this.setNoteValue(value);
        } else {
            this.currentCell.innerHTML = value;
        }
    }

    /**
     * Sets a note value in the selected cell.
     * @param {string} value - The note value to toggle in the cell.
     */
    setNoteValue(value: string): void {
        if (this.currentCell === null) return;
        if (this.currentCell.dataset[`note-${value}`] === '0') {
            this.currentCell.dataset[`note-${value}`] = '1';
        } else {
            this.currentCell.dataset[`note-${value}`] = '0';
        }
    }

    /**
     * Resets the selected and highlighted state of all cells.
     */
    private resetIsSelected() {
        const cells = document.querySelectorAll('div.cell');
        cells.forEach(cell => {
            (cell as HTMLDivElement).dataset.isSelected = '0';
            (cell as HTMLDivElement).dataset.isHighlighted = '0';
        });
    }
}

// Class to handle difficulty selection via radio buttons
class RadioButton {
    private easyButton: HTMLInputElement;
    private mediumButton: HTMLInputElement;
    private hardButton: HTMLInputElement;
    private veryHardButton: HTMLInputElement;
    private evilButton: HTMLInputElement;
    public selectedButton: HTMLInputElement;

    /**
     * Constructor to initialize radio buttons and set the default difficulty.
     * @param {number} currentlySelected - The currently selected difficulty level.
     */
    constructor(currentlySelected: number) {
        this.easyButton = document.getElementById('easy-button') as HTMLInputElement;
        this.mediumButton = document.getElementById('medium-button') as HTMLInputElement;
        this.hardButton = document.getElementById('hard-button') as HTMLInputElement;
        this.veryHardButton = document.getElementById('very-hard-button') as HTMLInputElement;
        this.evilButton = document.getElementById('evil-button') as HTMLInputElement;
        this.selectedButton = this.getButtonForDifficulty(currentlySelected);
        this.addEvenetListeners();
        this.selectedButton.checked = true;
        this.selectedButton.dataset.selected = '1';
    }

    /**
     * Returns the radio button element based on difficulty level.
     * @param {number} difficulty - The difficulty level.
     * @returns {HTMLInputElement} - The radio button corresponding to the difficulty.
     */
    getButtonForDifficulty(difficulty: number): HTMLInputElement {
        switch (difficulty) {
            case 0:
                return this.easyButton;
            case 1:
                return this.mediumButton;
            case 2:
                return this.hardButton;
            case 3:
                return this.veryHardButton;
            case 4:
                return this.evilButton;
            default:
                return this.mediumButton;
        }
    }

    /**
     * Changes the difficulty level and updates the Sudoku board.
     * @param {number} difficulty - The new difficulty level.
     */
    changeDifficulty(difficulty: number): void {
        let previousDif = parseInt(localStorage.getItem('dif') || '0');
        if (difficulty === previousDif && confirm('Do you want to start a new game with the same difficulty?')) {
            localStorage.setItem('dif', difficulty.toString());
            initializeBoard();
            return;
        }
        if (!confirm('Do you want to change the difficulty?')) {
            return;
        }
        let previousButton: HTMLInputElement = this.getButtonForDifficulty(previousDif);
        previousButton.checked = false;
        this.setAllToZero();
        let newButton: HTMLInputElement = this.getButtonForDifficulty(difficulty);
        newButton.checked = true;
        newButton.dataset.selected = '1';
        this.selectedButton = newButton;
        localStorage.setItem('dif', difficulty.toString());
        initializeBoard();
    }

    /**
     * Resets the selected state of all difficulty radio buttons.
     */
    setAllToZero(): void {
        this.easyButton.dataset.selected = '0';
        this.mediumButton.dataset.selected = '0';
        this.hardButton.dataset.selected = '0';
        this.veryHardButton.dataset.selected = '0';
        this.evilButton.dataset.selected = '0';
    }

    /**
     * Adds event listeners to the radio buttons for difficulty changes.
     */
    addEvenetListeners(): void {
        this.easyButton.addEventListener('click', () => {
            this.changeDifficulty(0);
        });
        this.mediumButton.addEventListener('click', () => {
            this.changeDifficulty(1);
        });
        this.hardButton.addEventListener('click', () => {
            this.changeDifficulty(2);
        });
        this.veryHardButton.addEventListener('click', () => {
            this.changeDifficulty(3);
        });
        this.evilButton.addEventListener('click', () => {
            this.changeDifficulty(4);
        });
    }
}

// Initial board state
let initialBoard: number[][];
let selectedCell: SelectedCell;
let chosenDifficulty: RadioButton;

document.addEventListener('DOMContentLoaded', function() {
    chosenDifficulty = new RadioButton(parseInt(localStorage.getItem('dif') || '0'));
    initializeBoard();
    setClearButton();
    setSolveButton();
    setCheckButton();
    setTogleNoteModeButton();
    setNumberButtons();
    setDeleteButton();
});

/**
 * Initializes and displays the Sudoku board based on the selected difficulty.
 */
function initializeBoard() {
    let board: number[][] = generateSudoku(parseInt(localStorage.getItem('dif') || '0'));
    initialBoard = board;
    const container = document.querySelector('#container');
    if (!container) return;

    container.innerHTML = '';
    for (let box = 0; box < 9; box++) {
        const startRow = (box - box % 3);
        const startCol = (box % 3) * 3;

        let boxElement = document.createElement('span');
        boxElement.classList.add('box');

        for (let row = startRow; row < startRow + 3; row++) {
            for (let col = startCol; col < startCol + 3; col++) {
                let cell: HTMLDivElement;
                if (board[row][col] === 0) {
                    cell = document.createElement('div');
                    cell.dataset.disabled = '0';
                    cell.addEventListener('click', () => {
                        selectedCell.setCell(cell);
                    });
                    for (let i = 1; i <= 9; i++) {
                        cell.dataset[`note-${i}`] = '0';
                    }
                } else {
                    cell = document.createElement('div');
                    cell.innerHTML = board[row][col].toString();
                    cell.dataset.disabled = '1';
                }
                cell.dataset.column = col.toString();
                cell.dataset.row = row.toString();
                cell.className = 'cell';
                cell.id = `cell-${row}-${col}`;
                boxElement.appendChild(cell);
            }
        }

        container.appendChild(boxElement);
    }

    selectedCell = new SelectedCell();
}

/**
 * Adds event listeners to number buttons for cell value input.
 */
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

/**
 * Adds an event listener to the delete button to clear the selected cell's value.
 */
function setDeleteButton() {
    const deleteButton = document.querySelector('#delete');
    deleteButton?.addEventListener('click', function() {
        selectedCell.setValue('');
    });
}

/**
 * Adds an event listener to check if the Sudoku puzzle is solved.
 */
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

/**
 * Adds an event listener to the clear button to reset the board to its initial state.
 */
function setClearButton() {
    const clearButton = document.getElementById('clearButton');
    clearButton?.addEventListener('click', function() {
        const isConfirmed: boolean = confirm('Do you want to clear your work?');
        if (!isConfirmed) return;
        displayBoard(initialBoard);
    });
}

/**
 * Retrieves the current state of the board by reading the DOM.
 * @returns {number[][]} - The current state of the board as a 2D array.
 */
function getCurrentBoardState(): number[][] {
    const cells = document.querySelectorAll('div.cell');
    const out = getBoardWithZeros();

    let currentCellIndex = 0;
    for (let box = 0; box < 9; box++) {
        const startRow = (box - box % 3);
        const startCol = (box % 3) * 3;

        for (let row = startRow; row < startRow + 3; row++) {
            for (let col = startCol; col < startCol + 3; col++) {
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

/**
 * Adds an event listener to the solve button to solve the puzzle or display the solution.
 */
function setSolveButton() {
    const solveButton = document.getElementById('solveButton');
    solveButton?.addEventListener('click', function() {
        const isConfirmed: boolean = confirm('Do you want to see the solution?');
        if (!isConfirmed) return;
        if (isSolved(getCurrentBoardState())) {
            alert('The puzzle is already solved!');
        } else {
            const tempBoard = duplicateBoard(getCurrentBoardState());
            const isSolvable = solveBoard(tempBoard);
            if (isSolvable) {
                displayBoard(tempBoard);
            } else {
                const isConfirmed = confirm('Your progress will be lost, do you want to continue?');
                if (isConfirmed) {
                    const tempBoard = duplicateBoard(initialBoard);
                    solveBoard(tempBoard);
                    displayBoard(tempBoard);
                } 
            }
        }
    });
}

/**
 * Displays the Sudoku board in the DOM, updating it with the given board state.
 * @param {number[][]} board - The board state to display.
 */
function displayBoard(board: number[][]) {
    for (let row: number = 0; row < 9; row++) {
        for (let col: number = 0; col < 9; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (cell) {
                let value = '';
                if (board[row][col] != 0) {
                    value = board[row][col].toString();
                }
                (cell as HTMLDivElement).innerHTML = value;
                cell.classList.remove('note-mode');
                for (let i = 1; i <= 9; i++) {
                    cell.dataset[`note-${i}`] = '0';
                }
            }
        }
    }
}

/**
 * Adds an event listener to toggle note mode for the selected cell.
 */
function setTogleNoteModeButton() {
    const toggleNoteButton = document.getElementById('noteButton');
    toggleNoteButton?.addEventListener('click', function() {
        selectedCell.toggleNoteMode();
    });
}

