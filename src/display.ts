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

    isNoteModeActivated(): boolean {
        if (this.currentCell == null) return false;
        return this.currentCell.classList.contains('note-mode');
    }

    setValue(value: string):void {
        if (this.currentCell === null) return;
        if (this.isNoteModeActivated()) {
            this.setNoteValue(value);
        } else {
            this.currentCell.innerHTML = value;
        }
    }

    setNoteValue(value: string):void {
        if (this.currentCell === null) return;
        if (this.currentCell.dataset[`note-${value}`] === '0') {
            this.currentCell.dataset[`note-${value}`] = '1';
        } else {
            this.currentCell.dataset[`note-${value}`] = '0';
        }
    }


    private resetIsSelected() {
        const cells = document.querySelectorAll('div.cell');
        cells.forEach(cell => {
            (cell as HTMLDivElement).dataset.isSelected = '0';
            (cell as HTMLDivElement).dataset.isHighlighted = '0';
        });
    }
}

class RadioButton {
    private easyButton: HTMLInputElement;
    private mediumButton: HTMLInputElement;
    private hardButton: HTMLInputElement;
    private veryHardButton: HTMLInputElement;
    private evilButton: HTMLInputElement;
    public selectedButton: HTMLInputElement;


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

    changeDifficulty(difficulty: number): void {
        let previousDif = parseInt(localStorage.getItem('dif') || '0');
        if (difficulty === previousDif && confirm('Do you want to start a new game with the same difficulty?')) {
            initializeBoard();
            return
        }
        if (!confirm('Do you want to change the difficulty?')) {
            return;
        }
        let previousButton: HTMLInputElement = this.getButtonForDifficulty(previousDif);
        previousButton.checked = false;
        // previousButton.dataset.selected = '0';
        this.setAllToZero();
        let newButton: HTMLInputElement = this.getButtonForDifficulty(difficulty);
        newButton.checked = true;
        newButton.dataset.selected = '1';
        this.selectedButton = newButton;
        localStorage.setItem('dif', difficulty.toString());
        initializeBoard();
        
    }

    setAllToZero(): void {
        this.easyButton.dataset.selected = '0';
        this.mediumButton.dataset.selected = '0';
        this.hardButton.dataset.selected = '0';
        this.veryHardButton.dataset.selected = '0';
        this.evilButton.dataset.selected = '0';
    }

   

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

let initialBoard: number[][]; // The initial board state
// let difficulty: number;
let selectedCell: SelectedCell;
let chosenDifficulty: RadioButton;

document.addEventListener('DOMContentLoaded', function() {
    // difficulty = parseInt(localStorage.getItem('dif') || '0');
    chosenDifficulty = new RadioButton(parseInt(localStorage.getItem('dif') || '0'));
    // displayDifficulty();
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
    let board: number[][] = generateSudoku(Number.parseInt(localStorage.getItem('dif') || '0'));
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
                    for (let i = 1; i <= 9; i++) {
                        cell.dataset[`note-${i}`] = '0';
                    }
                } else { // fixed values
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

// // Displays the difficulty level
// function displayDifficulty() {
//     const difficultyElement = document.getElementById('difficulty');
//     if (difficultyElement) {
//         switch (difficulty) {
//             case 0:
//                 difficultyElement.innerText = 'Difficulty: Easy';
//                 break;
//             case 1:
//                 difficultyElement.innerText = 'Difficulty: Medium';
//                 break;
//             case 2:
//                 difficultyElement.innerText = 'Difficulty: Hard';
//                 break;
//             case 3:
//                 difficultyElement.innerText = 'Difficulty: Very Hard';
//                 break;
//             case 4:
//                 difficultyElement.innerText = 'Difficulty: Evil';
//                 break;
//             default:
//                 difficultyElement.innerText = 'Difficulty: Medium';
//         }
//     }
// }

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
        const isConfirmed:boolean = confirm('Do you want to clear your work?');
        if (!isConfirmed) return;
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
        const isConfirmed:boolean = confirm('Do you want to see the solution?');
        if (!isConfirmed) return;
        if (isSolved(getCurrentBoardState())) {
            alert('The puzzle is already solved!');
        } else {
            const tempBoard = duplicateBoard(getCurrentBoardState());
            const isSolvable = solveBoard(tempBoard);
            if (isSolvable) {
                displayBoard(tempBoard);
            } else {
                // the user is prompted to overwrite the current progress
                const isConfirmed = confirm('your progress will be lost, do you want to continue?');
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
                (cell as HTMLDivElement).innerHTML = value;
                cell.classList.remove('note-mode');
                for (let i = 1; i <= 9; i++) {
                    cell.dataset[`note-${i}`] = '0';
                }
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


