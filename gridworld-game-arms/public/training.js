import { getUrlParameter, getScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const gridContainer = document.getElementById('grid-container'), scoreText = document.getElementById('score');

    const vars = await loadGameSettings();
    const whenToGenerateRewards = vars.roomsVisitedTillReward;
    const roomMap = {};
    var rewards = Array.from({ length: vars.gridSize }, () => Array.from({ length: vars.gridSize }, () => 0)); // initialise

    let score = 0, previousScore = 0, currentPosition = { x: vars.initialPosX, y: vars.initialPosY }, previousPosition = currentPosition;
    setupGrid();

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
          return;
        }

        if (score > 50) { //only modify URL once
          window.location.href = 'prebegin1.html' + '?s' + '=' + score + '&r=' + vars.finalRound + '&c=' + vars.roundsTillComparison;
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

        if (score > 50) {
          document.getElementById("trainingOver").innerHTML = "Perfect! You scored more than 50. Press any button to continue.";
        }
    });
    
    async function loadGameSettings() {
      const response = await fetch('settings.json');
      const data = await response.json();
      return validateVars(data.vars);
    }

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
      if (gridContainer.children[newIdx].classList.contains('hidden')) {
        return currentPosition;
      }

      const currentIdx = convertXY2Square(currentPosition.x, currentPosition.y);
      gridContainer.children[currentIdx].classList.remove('current');
      
      currentPosition = newPosition;
      const newLocationClassList = gridContainer.children[newIdx].classList;
      newLocationClassList.add('current');
      return currentPosition;
    }

    function revealSquare(position, rewards) {
      const index = convertXY2Square(position.x, position.y), square = gridContainer.children[index];
      square.classList.remove('grey');
      if (rewards[position.y][position.x] === 1) {
          square.classList.add('blue');
          score += 5;
      } else {
          square.classList.add('white');
          score--;
      }
      return score;
    }

    function updateTextColor(scoreText,score,previousScore) {
      const originalColor = 'black';
      var newColor = 'black';
      var timeout = 300;
      if ((score - previousScore) == vars.greenSquareScore) {
        newColor = '#228833';
        timeout = 500;
      } else if ((score - previousScore) == vars.purpleSquareScore) {
        newColor = '#AA3377';
        timeout = 500;
      } else if (score < previousScore) {
        newColor = '#BBBBBB' //red:#F05039
      }
      scoreText.style.color = newColor;
      setTimeout(() => { 
          scoreText.style.color = originalColor;
      }, timeout);
    }

    function setupGrid() {
      const minDimension = Math.min(window.innerWidth, window.innerHeight + 20), squareSize = minDimension / vars.gridSize;
      gridContainer.innerHTML = '';
      gridContainer.style.gridTemplateColumns = `repeat(${vars.gridSize}, ${squareSize}px)`;
      gridContainer.style.gridTemplateRows = `repeat(${vars.gridSize}, 0px)`;

      createGridSquares(squareSize);

      const mid = Math.floor(vars.gridSize / 2);
      const quat = Math.floor(mid / 2);
      const eigh = Math.floor(quat / 2);
      for (let y = 0; y < vars.gridSize; y++) {
        for (let x = 0; x < vars.gridSize; x++) {
          // north
          if (x == mid && y < mid && y > quat - 3) {
            addSquare(x, y);
            continue;
          }
          // south
          if (x == mid && y >= mid && y < vars.gridSize - quat + 3) {
            addSquare(x, y);
            continue;
          }
          // east
          if (y == mid && x >= mid && x < vars.gridSize - quat + 3) {
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
      rewards = createRoom(mid - Math.floor(vars.roomSize / 2), quat - 3, 1, -1, vars.roomSize, 'roomNo1', 'armNorth', rewards);

      // south room
      rewards = createRoom(mid - Math.floor(vars.roomSize / 2), vars.gridSize - quat + 3, 1, 1, vars.roomSize, 'roomNo2', 'armSouth', rewards);

      // east room
      rewards = createRoom(vars.gridSize - quat + 3, mid - Math.floor(vars.roomSize / 2), 1, 1, vars.roomSize, 'roomNo3', 'armEast', rewards);

      // west room
      rewards = createRoom(quat - 3, mid - Math.floor(vars.roomSize / 2), -1, 1, vars.roomSize, 'roomNo4', 'armWest', rewards);

      const rowHeights = getRowHeights(gridContainer, squareSize, vars.gridSize);
      gridContainer.style.gridTemplateRows = rowHeights.join(' ');
      var initialSquare = convertXY2Square(vars.initialPosX, vars.initialPosY);
      gridContainer.children[initialSquare].classList.remove('grey');
      gridContainer.children[initialSquare].classList.add('white');
      gridContainer.children[initialSquare].classList.add('current');
    }

    function createGridSquares(squareSize) {
      for (let y = 0; y < vars.gridSize; y++) {
          for (let x = 0; x < vars.gridSize; x++) {
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
      for (let dy = 0; dy < vars.roomSize; dy++) {
        for (let dx = 0; dx < vars.roomSize; dx++) {
          let x = rx + (dx * dirX);
          let y = ry + (dy * dirY);
          let square = addSquare(x, y);
          square.classList.add('room', roomName + '-' + armDirection);
          addToRoomMap(roomName, square);
          newRewards[y][x] = 1;
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
      const initialSquare = convertXY2Square(vars.initialPosX, vars.initialPosY);
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
      return vars.gridSize * y + x;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function validateVars(variables) {
      validateVar(variables, 'gridSize', 30, 2, 200);
      validateVar(variables, 'corridorWidth', 3, 1, variables.gridSize);
      validateVar(variables, 'roomFrequency', 5, 0, variables.gridSize);
      validateVar(variables, 'roomSize', 3, 1, variables.roomFrequency * 2);
      validateVar(variables, 'roomsVisitedTillReward', 2, 1, 12);
      validateVar(variables, 'initialPosX', 0, 0, variables.gridSize - 1);
      validateVar(variables, 'initialPosY', (variables.gridSize / 2), 0, variables.gridSize - 1);
      validateVar(variables, 'actionStochasticity', 0, 0, 1);
      validateVar(variables, 'greenSquareScore', 10, 1);
      validateVar(variables, 'purpleSquareScore', 1000, variables.greenSquareScore);
      validateVar(variables, 'maxNoGreenSquares', 2, 0);
      validateVar(variables, 'greenSquarePosRange', 2, 0, variables.gridSize - 1);
      validateVar(variables, 'purpleSquarePosRange', 2, 0, variables.gridSize - 1);
      return variables;
    }

    function validateVar(variables, varName, defaultValue, minValue, maxValue) {
      maxValue = maxValue !== undefined ? maxValue : Infinity;

      if (variables[varName] === undefined || variables[varName] < minValue || variables[varName] > maxValue) {
          console.error(`Invalid ${varName}! Setting to default: ${defaultValue}`);
          variables[varName] = defaultValue;
      }
    }
});