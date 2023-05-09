/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let moves = []; // Array to store the moves

function makeBoard() {
    for (let i = 0; i < HEIGHT; i++) {
    // create a new row
    let row = [];
    for (let j = 0; j < WIDTH; j++) {
    // initialize each cell to null
    row.push(null);
    }
    // add the row to the board array
    board.push(row);
    }
}
  
function makeHtmlBoard() {
    const htmlBoard = document.querySelector('#board');
    // creates top row to click for dropping pieces
    let topRow = document.createElement('tr');
    //creates new top row element
    topRow.setAttribute('id', 'column-top');
    //set id attribute 'column-top'
    topRow.addEventListener('click', handleClick);
    //adds event listener, calls 'handleClick()' function when clicked
  
    // create cells for the top row
    for (let x = 0; x < WIDTH; x++) {
      let headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      topRow.append(headCell);
    }
    // add the top row to the HTML board
    htmlBoard.append(topRow);

     // create cells for the game board
  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    // add the row to the HTML board
    htmlBoard.append(row);
  }
}

function findSpotForCol(x) {
    for (let y = HEIGHT - 1; y >= 0; y--) {
    //iterates through rows of board starting from bottom row(HEIGHT -1) going upwards to the top row (y=0)
      if (board[y][x] === null) {
        return y;
    //checks if cell at current row is empty
      }
    }
    return null;
    //if no empty cells found in specified column, returns null
  }
  
  function placeInTable(y, x) {
    let piece = document.createElement('div');
    //creates new div element, assigns it to 'piece'
    piece.classList.add('piece');
    //adds 'piece' class to piece element, used for css styling
    piece.classList.add(`p${currPlayer}`);
    // add the piece to the HTML board
    let cell = document.getElementById(`${y}-${x}`);
    //selects table cell  with id in format "y-x", assigns it to 'cell'
    cell.append(piece);
    //appends piece element to cell element, adds game piece to HTML board at specified row and column
  }

function endGame(msg) {
    alert(msg);
  }
  
  function handleClick(evt) {
    // get x from ID of clicked cell, + operator converts string to num, (string "3" to number 3)
    let x = +evt.target.id;
  
    // Check if the clicked element is NaN, occuring if not a cell in the top row
    if (isNaN(x)) {
      return;
    }
  
    // get the lowest empty cell in the clicked column, row index stored in y
    let y = findSpotForCol(x);
    if (y === null) {
      // column is full
      return;
    }
  
    // update the board array and the HTML board
    board[y][x] = currPlayer;
    placeInTable(y, x);
  
    // After placing the piece, store the move
    moves.push({ x, y, player: currPlayer });
  
    // check for win
    if (checkForWin()) {
      return endGame(`Player ${currPlayer} wins!`);
    }
  
    // check for tie
    if (board.every(row => row.every(cell => cell !== null))) {
      return endGame('Tie!');
    }
  
    // switch players
    currPlayer = currPlayer === 1 ? 2 : 1;
  }

function checkForWin() {
  function _win(cells) {
// _win defined as helper function
   return cells.every(
//every method tests whether all elements in arr return a boolean value
      ([y, x]) =>
//takes arr element x & y coordinates of cell, tests whether following conditions are true
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
//the cell at [y][x] in the board arr has the same value as currPlayer
    );
  }
  for (let y = 0; y < HEIGHT; y++) {
 // Loop through every cell on the board to check for potential winning sequences
    for (let x = 0; x < WIDTH; x++) {
 // Create arrays representing four cells in each possible direction
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
 //horizontal line of four cellsm, starting from the current cell [y, x] and extending three cells to the right.
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
 // vertical line of four cells, starting from the current cell [y, x] and extending three cells downward
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
 //diagonal line of four cells, starting from the current cell [y, x] extending three cells diagonally downward to right
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
 // diagonal line of four cells, starting from the current cell [y, x] extending three cells diagonally downward to left

 // If any of these four cells are occupied by the current player and all four cells match the player's color, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

//adds event listener to 'undoBtn' element, triggered when clicked, undoes last move
document.getElementById('undoBtn').addEventListener('click', () => {
    if (moves.length === 0) return;
//checks for stored moves in array, if empty return immediately

    let lastMove = moves.pop();
    // removes last move from moves array, store in lastMove variable
    let { x, y } = lastMove;
    //extracts x and y properties, (columns & rows)
  
    let cell = document.getElementById(`${y}-${x}`);
    //selects HTML cell element corresponding to x & y coordinates of last move
    cell.removeChild(cell.lastChild);
    //removes last child element of cell (piece placed in last move) from HTML board
    board[y][x] = null;
    //sets corresponding position in board array to null
  
    currPlayer = currPlayer === 1 ? 2 : 1;
    //switch current player back to previous
  });
  
  //add event listener to resetBtn, triggered when clicked, clears board
  document.getElementById('resetBtn').addEventListener('click', () => {
    moves = [];
    // clears moves array
    currPlayer = 1;
    // resets curr player to 1
    makeBoard();
    //calls makeBoard() function, resetting board array
   
    //iterates through each row od board
    for (let y = 0; y < HEIGHT; y++) {
    //nested loop, iterates through each cell in row
      for (let x = 0; x < WIDTH; x++) {

        let cell = document.getElementById(`${y}-${x}`);
        //selects HTML cell element corresponding to x and y coordinates
        while (cell.firstChild) {
        //continues while the cell has at least one child element (game piece)
          cell.removeChild(cell.firstChild);
        //removes first child element of the cell from HTML board
        }
      }
    }
  });
