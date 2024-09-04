# Sudoku-game
Sudoku generator and solver 

## Generation logic
1) `STEP A`Fill a board with random numbers (1-9) while checking for validity

1) `STEP B`
    1) Pick two random numbers `i`, `j` in the range[1,9]
    1) mark this cell as empty (0), check for its uniqueness and generate a valid Sudoku.


### STEP A:
1) start with empty board filled with 0's
1) Do the following for all cells in order
    1) make an array with range[1,9]
    1) remove all numbers that:
        1) are present in its row
        1) are present in its column
        1) are present in its box
    1) the remaining array is `arr`
    1) randomly pick a number from `arr` for the cell

### STEP B:
1) `STEP 1` make an empty array `visited`
1) `STEP 2` Remove a random cell `C` that is not in `visited`
1) `STEP 3` Check if unique solution exists
1) `STEP 4`
    - if unique exists:
        - if target number of cells achieved, go to `STEP 5` after removing cell `C`
        - Remove the cell `C` and loop back to `STEP 2`
    - else, go back to `STEP 2` and keep track of cell `C` in array `visited` without removing cell


## Dificulty params
should have exactly
1) Easy: 42 [36-49]
1) Medium: 34 [32-35]
1) Hard: 30 [28-31]
1) Very Hard: 26 [24-27]
1) `test and keep if possible !!!` Evil: 17


# Development guide
```sh
npx tsc -w
```

