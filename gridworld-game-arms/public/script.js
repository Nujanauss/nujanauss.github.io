import { getUrlParameter, getScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const gridContainer = document.getElementById('grid-container'), movesText = document.getElementById('moves'), scoreText = document.getElementById('score');

    const vars = await loadGameSettings();
    const whenToGenerateRewards = vars.armsVisitedTillReward; //roomsVisitedTillReward
    const roomMap = {};
    const room2ArmMap = {};
    var rewards = Array.from({ length: vars.gridSize }, () => Array.from({ length: vars.gridSize }, () => 0)); // initialise

    let score = 0, previousScore = 0, currentPosition = { x: vars.initialPosX, y: vars.initialPosY }, currentRoomNo = 0, moves = vars.moves, previousPosition = currentPosition;
    setupGrid();
    var round = getRoundFromURL();

    movesText.innerHTML = 'Moves left: ' + vars.moves;
    const scoresSoFar = getScoresSoFar();
    let initialRewardPos = getUrlParameter('blob');
    const roomsVisited = getUrlParameter('grok') !== null ? decodeRooms(getUrlParameter('grok')) : new Set();
    var urlModified = false, generatedTrue = false;

    if (initialRewardPos !== '') {
      [,rewards] = generateRewards(vars, rewards, decodeCoordinates(initialRewardPos));
      generatedTrue = true;
    }

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
          return;
        }

        if (!urlModified && moves < 1) { //only modify URL once
          endTrialLogic(initialRewardPos, scoresSoFar);
          return;
        }

        currentPosition = gameLogic(event, key, currentPosition);
        if (previousPosition == currentPosition) {
          return;
        }

        moves--;
        if (!generatedTrue && getNoArmsVisited(roomsVisited) == whenToGenerateRewards) { // roomsVisited.size == whenToGenerateRewards
          [generatedTrue, rewards] = generateRewards(vars, rewards, currentPosition);
          if (generatedTrue) {
            initialRewardPos = encodeCoordinates(currentPosition.x, currentPosition.y);
          }
        }

        score = revealSquare(currentPosition, rewards);
        scoreText.innerHTML = 'Score: ' + score;
        movesText.innerHTML = 'Moves left: ' + moves;
        updateTextColor(scoreText,score,previousScore)

        previousScore = score;
        previousPosition = currentPosition;

        if (moves < 1) {
          document.getElementById("trialOver").style.visibility = "visible";
        }
    });
    
    async function loadGameSettings() {
      const response = await fetch('settings.json');
      const data = await response.json();
      return validateVars(data.vars);
    }

    function getRoundFromURL() {
      var round = new URLSearchParams(window.location.search).get('round');
      if (!round) {
        round = 1;
        const url = new URL(window.location.href);
        url.searchParams.set('rounds', vars.finalRound);
        url.searchParams.set('round', round);
        history.replaceState(null, '', url);
      }
      return round;
    }

    function gameLogic(event, key, currentPosition) {
      const newPosition = { ...currentPosition };

      var axis = key.includes('Up') || key.includes('Down') ? 'y' : 'x';
      var increment = key.includes('Up') || key.includes('Left') ? -1 : 1;

      //[axis, increment] = addStochasticity(axis, increment); // Introduce stochasticity

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
      let roomNo = 0;
      Array.from(newLocationClassList).forEach(className => {
        if (className.includes("roomNo")) {
            roomNo = className.split("-")[0].slice(-1);
            roomsVisited.add( className.split("-")[0]);
        }
      });
      return currentPosition;
    }

    function addStochasticity(axis, increment) {
      if (Math.random() > vars.actionStochasticity) {
        return [axis, increment];
      }
      var randomAxis = Math.random() < 0.5 ? 'y' : 'x';
      var randomIncrement = Math.random() < 0.5 ? -1 : 1;

      while (randomAxis === axis && randomIncrement === increment) {
          randomAxis = Math.random() < 0.5 ? 'y' : 'x';
          randomIncrement = Math.random() < 0.5 ? -1 : 1;
      }
      return [randomAxis, randomIncrement];
      
    }

    function revealSquare(position, rewards) {
      const index = convertXY2Square(position.x, position.y), square = gridContainer.children[index];
      square.classList.remove('grey');
      if (rewards[position.y][position.x] === 1) {
          square.classList.add('green');
          score += vars.greenSquareScore;
      } else if (rewards[position.y][position.x] === 2) {
          square.classList.add('gold');
          score += vars.purpleSquareScore;
      } else {
          square.classList.add('white');
          score--;
      }
      return score;
    }
    
    function generateRewards(vars, rewards, startAtPos) {
      const index = convertXY2Square(startAtPos.x, startAtPos.y);
      const newLocationClassList = gridContainer.children[index].classList;
      if (!newLocationClassList.contains('room') || newLocationClassList.contains('white')) {// don't turn white suddenly green
        return [false, rewards]
      }

      //green rewards
      const classListArray = Array.from(newLocationClassList);
      let roomNo = '';
      classListArray.forEach(className => {
          if (className.includes('roomNo')) {
            roomNo = className.split("-")[0];
          }
      });

      let squares = roomMap[roomNo];
      shuffleArray(squares);
      const selectedSquares = squares.slice(0, Math.min(squares.length, vars.maxNoGreenSquares));
      selectedSquares.forEach(sqr => {
        const squareId = sqr.id;
        const [, x, y] = squareId.split('-').map(Number);
        const idx = convertXY2Square(x, y);
        if (rewards[y][x] !== 1 && !gridContainer.children[idx].classList.contains('white')) {
            rewards[y][x] = 1;
        }
      });

      //purple rewards
      for (var i = 1; i < 13; i++) {
        if (roomsVisited.has(`roomNo${i}`) || getArmsVisited(roomsVisited).has(room2ArmMap[`roomNo${i}`])) {
          continue;
        }
        let purpleSquares = roomMap[`roomNo${i}`];
        const [, x, y] = purpleSquares[1].id.split('-').map(Number);
        rewards[y][x] = 2;
        break;
      }
      return [true, rewards];
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

      let roomNo = 5;
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
          // Neast-west
          if (x > mid - quat + 2 && x < mid + quat - 2 && y == mid - eigh - 2) {
            addSquare(x, y);
            continue;
          }
          // Seast-west
          if (x > mid - quat + 2 && x < mid + quat - 2 && y == vars.gridSize - mid + eigh + 2) {
            addSquare(x, y);
            continue;
          }
          // Enorth-south
          if (y > mid - quat + 2 && y < mid + quat - 2 && x == vars.gridSize - mid + eigh + 2) {
            addSquare(x, y);
            continue;
          }
          // Wnorth-south
          if (y > mid - quat + 2 && y < mid + quat - 2 && x == mid - eigh - 2) {
            addSquare(x, y);
            continue;
          }
          // Nentryway
          if ((x == mid - quat + 3 || x == mid + quat - 3) && y == mid - eigh - 3) {
            addSquare(x, y);
            createRoom(x - Math.floor(vars.roomSize / 2), y - 1, 1, -1, vars.roomSize, `roomNo${roomNo}`, 'armNorth');
            roomNo++;
            continue;
          }
          // Sentryway
          if ((x == mid - quat + 3 || x == mid + quat - 3) && y == vars.gridSize - mid + eigh + 3) {
            addSquare(x, y);
            createRoom(x - Math.floor(vars.roomSize / 2), y + 1, 1, 1, vars.roomSize, `roomNo${roomNo}`, 'armSouth');
            roomNo++;
            continue;
          }
          // Eentryway
          if ((y == mid - quat + 3 || y == mid + quat - 3) && x == vars.gridSize - mid + eigh + 3) {
            addSquare(x, y);
            createRoom(x + 1, y - Math.floor(vars.roomSize / 2), 1, 1, vars.roomSize, `roomNo${roomNo}`, 'armEast');
            roomNo++;
            continue;
          }
          // Wentryway
          if ((y == mid - quat + 3 || y == mid + quat - 3) && x == mid - eigh - 3) {
            addSquare(x, y);
            createRoom(x - 1, y - Math.floor(vars.roomSize / 2), -1, 1, vars.roomSize, `roomNo${roomNo}`, 'armWest');
            roomNo++;
            continue;
          }
        }
      }

      // north room
      createRoom(mid - Math.floor(vars.roomSize / 2), quat - 3, 1, -1, vars.roomSize, 'roomNo1', 'armNorth');

      // south room
      createRoom(mid - Math.floor(vars.roomSize / 2), vars.gridSize - quat + 3, 1, 1, vars.roomSize, 'roomNo2', 'armSouth');

      // east room
      createRoom(vars.gridSize - quat + 3, mid - Math.floor(vars.roomSize / 2), 1, 1, vars.roomSize, 'roomNo3', 'armEast');

      // west room
      createRoom(quat - 3, mid - Math.floor(vars.roomSize / 2), -1, 1, vars.roomSize, 'roomNo4', 'armWest');

      
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

    function createRoom(rx, ry, dirX, dirY, roomSize, roomName, armDirection) {
      for (let dy = 0; dy < vars.roomSize; dy++) {
        for (let dx = 0; dx < vars.roomSize; dx++) {
          let square = addSquare(rx + (dx * dirX), ry + (dy * dirY));
          square.classList.add('room', roomName + '-' + armDirection);
          addToRoomMap(roomName, square);
        }
      }
      addToArmMap(roomName, armDirection);
    }

    function addToRoomMap(roomName, square) {
      if (!roomMap[roomName]) {
          roomMap[roomName] = [];
      }
      roomMap[roomName].push(square);
    }

    function addToArmMap(roomName, armName) {
      if (!room2ArmMap[roomName]) {
          room2ArmMap[roomName] = [];
      }
      room2ArmMap[roomName].push(armName);
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

    function getArmsVisited(roomsVisited) {
      const armsVisited = new Set();
        roomsVisited.forEach(room => {
            if (room2ArmMap[room]) { // Check if the room has arms mapped to it
                room2ArmMap[room].forEach(arm => {
                    armsVisited.add(arm); // Add each arm to the set
                });
            }
        });
        return armsVisited;
    }

    function getNoArmsVisited(roomsVisited) {
        return getArmsVisited(roomsVisited).size;
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
    
    function encodeCoordinates(x, y) {
      return (x << 16) | y;
    }

    function decodeCoordinates(encoded) {
      let x = encoded >> 16;
      let y = encoded & 0xFFFF;
      return {x, y};
    }

    function encodeRooms(roomsVisited) {
      let encodedNumber = 0;
      for (let i = 1; i <= 12; i++) {
        const roomNumber = `roomNo${i}`;
        for (const item of roomsVisited) {
          if (item.startsWith(roomNumber)) {
              encodedNumber |= (1 << (i - 1));
              break;
          }
        }
      }
      return encodedNumber;
    }

    function decodeRooms (encoded) {
      const decodedRoomsVisited = new Set();
      for (let i = 1; i <= 12; i++) {
        if (encoded & (1 << (i - 1))) {
            decodedRoomsVisited.add(`roomNo${i}`);
        }
      }
      return decodedRoomsVisited;
    }

    function endTrialLogic(initialRewardPos, scoresSoFar) {
      scoresSoFar.push(score);
      if (round == vars.roundsTillComparison) {
        window.location.href = constructURLWithScores("standings.html", initialRewardPos, scoresSoFar);
      } else if (round > (vars.finalRound - 1)){
        window.location.href = constructURLWithScores("thanks.html", initialRewardPos, scoresSoFar);
      } else {
        window.location.href = constructURLWithScores("intermediary.html", initialRewardPos, scoresSoFar);
      }
      urlModified = true; 
      return;
    }

    function constructURLWithScores(htmlFile, initialRewardPos, scoresSoFar) {
      let url = htmlFile + '?blob=' + initialRewardPos + '&grok=' + encodeRooms(roomsVisited) + '&rounds=' + vars.finalRound + '&round=' + round;
      scoresSoFar.forEach((score, index) => {
          url += '&score' + (index + 1) + '=' + score;
      });
      return url;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function validateVars(variables) {
      validateVar(variables, 'gridSize', 30, 2, 200);
      validateVar(variables, 'moves', 70, 1);
      validateVar(variables, 'corridorWidth', 3, 1, variables.gridSize);
      validateVar(variables, 'roomFrequency', 5, 0, variables.gridSize);
      validateVar(variables, 'roomSize', 3, 1, variables.roomFrequency * 2);
      validateVar(variables, 'roomsVisitedTillReward', 2, 1, 12);
      validateVar(variables, 'initialPosX', 0, 0, variables.gridSize - 1);
      validateVar(variables, 'initialPosY', (variables.gridSize / 2), 0, variables.gridSize - 1);
      validateVar(variables, 'roundsTillComparison', 3, 1, variables.finalRound - 1);
      validateVar(variables, 'finalRound', 6, 1);
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