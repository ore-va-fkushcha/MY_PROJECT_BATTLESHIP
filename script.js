const playerBoard = document.getElementById('player-board');
const computerBoard = document.getElementById('computer-board');
const startGameButton = document.getElementById('start-game');

const BOARD_SIZE = 10;
let playerShips = [];
let computerShips = [];
let isGameStarted = false;


const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

// Создаем игровое поле
function createBoard(boardElement) {
   boardElement.innerHTML = '';
   for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
         const cell = document.createElement('div');
         cell.classList.add('cell');
         cell.dataset.x = x;
         cell.dataset.y = y;
         boardElement.appendChild(cell);
      }
   }
}


function placeShipsRandomly(boardArray) {
   for (let size of ships) {
      let placed = false;
      while (!placed) {
         const x = Math.floor(Math.random() * BOARD_SIZE);
         const y = Math.floor(Math.random() * BOARD_SIZE);
         const horizontal = Math.random() > 0.5;

         if (canPlaceShip(boardArray, x, y, size, horizontal)) {
            placeShip(boardArray, x, y, size, horizontal);
            placed = true;
         }
      }
   }
}


function canPlaceShip(boardArray, x, y, size, horizontal) {
   for (let i = 0; i < size; i++) {
      const nx = horizontal ? x + i : x;
      const ny = horizontal ? y : y + i;

      if (
         nx >= BOARD_SIZE || ny >= BOARD_SIZE ||
         boardArray[nx]?.[ny] || hasNeighbor(boardArray, nx, ny)
      ) {
         return false;
      }
   }
   return true;
}


function placeShip(boardArray, x, y, size, horizontal) {
   for (let i = 0; i < size; i++) {
      const nx = horizontal ? x + i : x;
      const ny = horizontal ? y : y + i;
      boardArray[nx][ny] = true;


      if (boardArray === playerShips) {
         const cell = playerBoard.querySelector(`[data-x="${nx}"][data-y="${ny}"]`);
         if (cell) cell.classList.add('ship');
      }
   }
}


function hasNeighbor(boardArray, x, y) {
   for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
         const nx = x + dx;
         const ny = y + dy;
         if (
            nx >= 0 && nx < BOARD_SIZE &&
            ny >= 0 && ny < BOARD_SIZE &&
            boardArray[nx]?.[ny]
         ) {
            return true;
         }
      }
   }
   return false;
}


startGameButton.addEventListener('click', () => {
   isGameStarted = true;


   playerShips = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));
   computerShips = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false));

   placeShipsRandomly(playerShips);
   placeShipsRandomly(computerShips);

   startGameButton.disabled = true;
   alert('Game started. You are first');
});


computerBoard.addEventListener('click', (e) => {
   if (!isGameStarted) return;

   const cell = e.target.closest('.cell');
   if (!cell || cell.classList.contains('hit') || cell.classList.contains('miss')) return;

   const x = parseInt(cell.dataset.x);
   const y = parseInt(cell.dataset.y);

   if (computerShips[x][y]) {
      cell.classList.add('hit');
      computerShips[x][y] = false;
      checkWinCondition();
   } else {
      cell.classList.add('miss');
      computerTurn();
   }
});


function computerTurn() {
   let x, y;
   do {
      x = Math.floor(Math.random() * BOARD_SIZE);
      y = Math.floor(Math.random() * BOARD_SIZE);
   } while (playerBoard.children[x * BOARD_SIZE + y].classList.contains('hit') || playerBoard.children[x * BOARD_SIZE + y].classList.contains('miss'));

   const cell = playerBoard.children[x * BOARD_SIZE + y];
   if (playerShips[x][y]) {
      cell.classList.add('hit');
      playerShips[x][y] = false;
      checkWinCondition();
   } else {
      cell.classList.add('miss');
   }
}


function checkWinCondition() {
   if (!computerShips.flat().includes(true)) {
      alert('You win!');
      isGameStarted = false;
   } else if (!playerShips.flat().includes(true)) {
      alert('You lost');
      isGameStarted = false;
   }
}


createBoard(playerBoard);
createBoard(computerBoard);
