import { getUrlParameter, getScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const gridContainer = document.getElementById('grid-container'), scoreText = document.getElementById('score');

    const blueScore = 5;
    const whenToGenerateRewards = JSON.parse(sessionStorage.getItem('roomsVisitedTillReward'));
    const roomMap = {};
    const gridSize = JSON.parse(sessionStorage.getItem('gridSize'));
    const roomSize = JSON.parse(sessionStorage.getItem('roomSize'));
    const initialPos = { x: JSON.parse(sessionStorage.getItem('initialPosX')), y: JSON.parse(sessionStorage.getItem('initialPosY')) };
    var rewards = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0)); // initialise

    let score = 0, previousScore = 0, squaresVisited = 0, noSquares = 0, currentPosition = initialPos, previousPosition = currentPosition;
    setupGrid();

    [,rewards] = generateRewards(rewards);

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
          return;
        }

        console.log(squaresVisited)
        if (squaresVisited == noSquares - 1) {
          window.location.href = 'cancel.html';
          return;
        }
        if (score > 40) { //only modify URL once
          return;
        }

        currentPosition = gameLogic(event, key, currentPosition);
        if (previousPosition == currentPosition) {
          return;
        }

        score = revealSquare(currentPosition, rewards);
        scoreText.innerHTML = 'Score: ' + score;
        updateTextColor(scoreText,score,previousScore)

        previousScore = score;
        previousPosition = currentPosition;

        if (score > 40) {
          document.getElementById("trainingOver").innerHTML = "Perfect! You scored more than 40. Click Next to continue.";
          document.getElementById("trainingOverBut").style.visibility = "visible";
          document.getElementById('trainingOverBut').addEventListener('click', function() {
            window.location.href = 'prebegin1.html' + '?s' + '=' + score;
          });
        }
    });

    function gameLogic(event, key, currentPosition) {
      const newPosition = { ...currentPosition };

      var axis = key.includes('Up') || key.includes('Down') ? 'y' : 'x';
      var increment = key.includes('Up') || key.includes('Left') ? -1 : 1;

      if (axis === 'x') {
        newPosition.x += increment
      } else {
        newPosition.y += increment;
      }

      const newIdx = convertXY2Square(newPosition.x, newPosition.y);
      if (gridContainer.children[newIdx] == undefined || gridContainer.children[newIdx].classList.contains('hidden')) {
        return currentPosition;
      }

      const currentIdx = convertXY2Square(currentPosition.x, currentPosition.y);
      gridContainer.children[currentIdx].classList.remove('current');
      
      currentPosition = newPosition;
      const newLocationClassList = gridContainer.children[newIdx].classList;
      newLocationClassList.add('current');
      return currentPosition;
    }
    
    function generateRewards(rewards) {
      let availableForGreenSqrs = Object.values(roomMap).flat();
      shuffleArray(availableForGreenSqrs);
      const selectedSquares = availableForGreenSqrs.slice(0, availableForGreenSqrs.length * 0.7);
      selectedSquares.forEach(sqr => {
        const squareId = sqr.id;
        const [, x, y] = squareId.split('-').map(Number);
        const idx = convertXY2Square(x, y);
        if (rewards[y][x] !== 3 && !gridContainer.children[idx].classList.contains('white')) {
            rewards[y][x] = 3;
        }
      });
      return [true, rewards];
    }

    function revealSquare(position, rewards) {
      const index = convertXY2Square(position.x, position.y), square = gridContainer.children[index];
      square.classList.remove('grey');
      if (rewards[position.y][position.x] === 0) {
        if (!square.classList.contains('white')) {
          square.classList.add('white');
          squaresVisited++;
        }
        score--;
        return score;
      }
      const pseudoElement = document.createElement('div');
      square.appendChild(pseudoElement);
      square.classList.add('bluish');
      pseudoElement.classList.add('blue');
      square.classList.add('white');
      score += blueScore;
      rewards[position.y][position.x] = 0;
      squaresVisited++;
      return score;
    }

    function updateTextColor(scoreText,score,previousScore) {
      const originalColor = 'black';
      var newColor = 'black';
      var timeout = 300;
      if ((score - previousScore) == blueScore) {
        newColor = '#1F449C';
        timeout = 500;
      }
      scoreText.style.color = newColor;
      setTimeout(() => { 
          scoreText.style.color = originalColor;
      }, timeout);
    }

    function setupGrid() {
      const minDimension = Math.min(window.innerWidth, window.innerHeight - 20), squareSize = minDimension / gridSize;
      gridContainer.innerHTML = '';
      gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${squareSize}px)`;
      gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 0px)`;

      createGridSquares(squareSize);

      const mid = Math.floor(gridSize / 2);
      const quat = Math.floor(mid / 2);
      const eigh = Math.floor(quat / 2);
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          // north
          if (x == mid && y < mid && y > quat - 3) {
            addSquare(x, y);
            continue;
          }
          // south
          if (x == mid && y >= mid && y < gridSize - quat + 3) {
            addSquare(x, y);
            continue;
          }
          // east
          if (y == mid && x >= mid && x < gridSize - quat + 3) {
            addSquare(x, y);
            continue;
          }
          // west
          if (y == mid && x < mid && x > quat - 3) {
            addSquare(x, y);
            continue;
          }
        }
      }

      // north room
      rewards = createRoom(mid - Math.floor(roomSize / 2), quat - 3, 1, -1, roomSize, 'roomNo1', 'armNorth', rewards);

      // south room
      rewards = createRoom(mid - Math.floor(roomSize / 2), gridSize - quat + 3, 1, 1, roomSize, 'roomNo2', 'armSouth', rewards);

      // east room
      rewards = createRoom(gridSize - quat + 3, mid - Math.floor(roomSize / 2), 1, 1, roomSize, 'roomNo3', 'armEast', rewards);

      // west room
      rewards = createRoom(quat - 3, mid - Math.floor(roomSize / 2), -1, 1, roomSize, 'roomNo4', 'armWest', rewards);

      const rowHeights = getRowHeights(gridContainer, squareSize, gridSize);
      gridContainer.style.gridTemplateRows = rowHeights.join(' ');
      var initialSquare = convertXY2Square(initialPos.x, initialPos.y);
      gridContainer.children[initialSquare].classList.remove('grey');
      gridContainer.children[initialSquare].classList.add('white');
      gridContainer.children[initialSquare].classList.add('current');
    }

    function createGridSquares(squareSize) {
      for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
              const square = createSquare(x, y, squareSize);
              gridContainer.appendChild(square);
          }
      }
    }

    function createSquare(x, y, squareSize) {
      const square = document.createElement('div');
      square.id = `square-${x}-${y}`;
      square.classList.add('square', 'hidden');
      square.style.width = square.style.height = squareSize + 'px';
      square.style.borderRadius = '5px';
      return square;
    }

    function createRoom(rx, ry, dirX, dirY, roomSize, roomName, armDirection, rewards) {
      const newRewards = { ...rewards };
      for (let dy = 0; dy < roomSize; dy++) {
        for (let dx = 0; dx < roomSize; dx++) {
          let x = rx + (dx * dirX);
          let y = ry + (dy * dirY);
          let square = addSquare(x, y);
          square.classList.add('room', roomName + '-' + armDirection);
          addToRoomMap(roomName, square);
        }
      }
      return newRewards;
    }

    function addToRoomMap(roomName, square) {
      if (!roomMap[roomName]) {
          roomMap[roomName] = [];
      }
      roomMap[roomName].push(square);
    }

    function setInitialSquare() {
      const initialSquare = convertXY2Square(initialPos.x, initialPos.y);
      const initialSquareElement = gridContainer.children[initialSquare];
      initialSquareElement.classList.remove('grey');
      initialSquareElement.classList.add('white', 'current');
    }

    function addSquare(x, y) {
      const squareId = `square-${x}-${y}`;
      const square = document.getElementById(squareId);
      if (square) {
        square.classList.remove('hidden');
        square.classList.add('grey');
        noSquares++;
        return square;
      }
    }

    function getRowHeights(gridContainer, squareSize, gridSize) {
      const squares = Array.from(gridContainer.children);
      const rowHeights = [];
      let currentRowHeight = '0px';

      squares.forEach((square, index) => {
          // If the square is in the first column or a new row has started
          if (index % gridSize === 0 || index === 0) {
              // If this isn't the first row, push the height of the previous row to the rowHeights array
              if (index !== 0) {
                  rowHeights.push(currentRowHeight);
              }
              currentRowHeight = '0px';
          }
          if (square.classList.contains('grey')) {
              currentRowHeight = `${squareSize}px`;
          }
          // If we've reached the end of the squares, push the height of the last row
          if (index === squares.length - 1) {
              rowHeights.push(currentRowHeight);
          }
      });
      return rowHeights;
    }

    function convertXY2Square(x, y) {
      return gridSize * y + x;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }
});