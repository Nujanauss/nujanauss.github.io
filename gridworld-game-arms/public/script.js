import { getUrlParameter, getScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const gridContainer = document.getElementById('grid-container'), movesText = document.getElementById('moves'), scoreText = document.getElementById('score');
    const gridSize = getFromStor('gridSize');
    const roomSize = getFromStor('roomSize');
    const initialPos = { x: getFromStor('initialPosX'), y: getFromStor('initialPosY') };
    const whenToGenerateRewards = getFromStor('armsVisitedTillReward');
    const roomMap = {};
    const room2ArmMap = {};
    const arm2RoomMap = {};
    var rewards = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => 0)); // initialise
    var moves = getFromStor('moves');

    let score = 0, previousScore = 0, currentPosition = initialPos, currentRoomNo = 0, previousPosition = currentPosition;
    setupGrid();
    var round = getRoundFromURL();

    movesText.innerHTML = 'Moves left: ' + moves;
    const scoresSoFar = getScoresSoFar();
    const roomsVisited = getFromStor('roomsVisited') !== null ? getFromStor('roomsVisited') : [];

    var generatedTrue = false;

    let initialRewardPos = getFromStor('initialRewardPos');
    if (initialRewardPos !== null) {
      [,rewards] = generateGreenRewards(rewards, initialRewardPos);
      generatedTrue = true;
    }

    if (parseFloat(round) > getFromStor('roundsTillComparison')) {
      if (sessionStorage.getItem('purpleRoom') === null) {
        setPurpleRoom(roomsVisited);
      }
      rewards = generatePurpleRewards(rewards, sessionStorage.getItem('purpleRoom'));
    }

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
          return;
        }

        if (moves < 1) {  
          return;
        }

        currentPosition = gameLogic(event, key, currentPosition);
        if (previousPosition == currentPosition) {
          return;
        }

        moves--;
        if (!generatedTrue && roomsVisited.length !== 0 && getNoArmsVisited(roomsVisited) == whenToGenerateRewards) {
          [generatedTrue, rewards] = generateGreenRewards(rewards, currentPosition);
          if (generatedTrue) {
            sessionStorage.setItem('initialRewardPos', JSON.stringify({ x: currentPosition.x, y: currentPosition.y }));
          }
        }

        score = revealSquare(currentPosition, rewards);
        scoreText.innerHTML = 'Score: ' + score;
        movesText.innerHTML = 'Moves left: ' + moves;
        updateTextColor(scoreText,score,previousScore)

        previousScore = score;
        previousPosition = currentPosition;

        if (moves < 1) {
          endTrialLogic(scoresSoFar);
          return;
        }
    });

    function getRoundFromURL() {
      var round = new URLSearchParams(window.location.search).get('round');
      if (!round) {
        round = 1;
        const url = new URL(window.location.href);
        url.searchParams.set('round', round);
        history.replaceState(null, '', url);
      }
      return round;
    }

    function endTrialLogic(scoresSoFar) {
      document.getElementById("trialOver").style.visibility = "visible";
      document.getElementById("trialOverBut").style.visibility = "visible";
      scoresSoFar.push(score);
      if (round == getFromStor('roundsTillComparison')) {
        document.getElementById('trialOverBut').addEventListener('click', function() {
          window.location.href = constructURLWithScores("standings.html", scoresSoFar);
        });
      } else if (round > (getFromStor('finalRound') - 1)){
        document.getElementById('trialOverBut').addEventListener('click', function() {
          window.location.href = constructURLWithScores("thanks.html", scoresSoFar);
        });
      } else {
        document.getElementById('trialOverBut').addEventListener('click', function() {
          window.location.href = constructURLWithScores("intermediary.html", scoresSoFar);
        });
      }
      return;
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
      if (gridContainer.children[newIdx] == undefined || gridContainer.children[newIdx].classList.contains('hidden')) {
        return currentPosition;
      }

      const currentIdx = convertXY2Square(currentPosition.x, currentPosition.y);
      gridContainer.children[currentIdx].classList.remove('current');
      
      currentPosition = newPosition;
      const newLocationClassList = gridContainer.children[newIdx].classList;
      newLocationClassList.add('current');
      Array.from(newLocationClassList).forEach(className => {
        if (className.includes("roomNo") && !roomsVisited.includes(className.split("-")[0])) {
            roomsVisited.push(className.split("-")[0]);
            sessionStorage.setItem('roomsVisited', JSON.stringify(Array.from(roomsVisited)));
        }
      });
      return currentPosition;
    }

    function revealSquare(position, rewards) {
      const index = convertXY2Square(position.x, position.y), square = gridContainer.children[index];
      square.classList.remove('grey');
      if (rewards[position.y][position.x] === 0) {
        square.classList.add('white');
        score--;
        return score;
      }
      const pseudoElement = document.createElement('div');
      square.appendChild(pseudoElement);
      if (rewards[position.y][position.x] === 1) {
        pseudoElement.classList.add('green');
        square.classList.add('greenish');
        score += getFromStor('greenSquareScore');
      } else if (rewards[position.y][position.x] === 2) {
        pseudoElement.classList.add('gold');
        square.classList.add('goldish');
        score += getFromStor('purpleSquareScore');
      }
      rewards[position.y][position.x] = 0;
      return score;
    }

    function generateGreenRewards(rewards, startAtPos) {
      const greenPosIdx = convertXY2Square(startAtPos.x, startAtPos.y);
      const greenPosClassList = gridContainer.children[greenPosIdx].classList;
      if (!greenPosClassList.contains('room') || greenPosClassList.contains('white')) {// don't turn white suddenly green
        return [false, rewards]
      }
      const classListArray = Array.from(greenPosClassList);
      let roomNo = '';
      classListArray.forEach(className => {
          if (className.includes('roomNo')) {
            roomNo = className.split("-")[0];
          }
      });

      let arm = room2ArmMap[roomNo];
      let rooms = arm2RoomMap[arm];
      let availableForGreenSqrs = [];
      rooms.forEach(room => {
        availableForGreenSqrs = availableForGreenSqrs.concat(roomMap[room]);
      });
      shuffleArray(availableForGreenSqrs);
      const selectedSquares = availableForGreenSqrs.slice(0, Math.min(availableForGreenSqrs.length, getFromStor('maxNoGreenSquares')));
      selectedSquares.forEach(sqr => {
        const squareId = sqr.id;
        const [, x, y] = squareId.split('-').map(Number);
        const idx = convertXY2Square(x, y);
        if (rewards[y][x] !== 1 && !gridContainer.children[idx].classList.contains('white')) {
            rewards[y][x] = 1;
        }
      });
      return [true, rewards];
    }

    function setPurpleRoom(roomsVisited) {
      let availablePurpleRooms = [];
      for (var i = 1; i < 13; i++) {
        if (roomsVisited.includes(`roomNo${i}`) || getArmsVisited(roomsVisited).has(room2ArmMap[`roomNo${i}`][0])) {
          continue;
        }
       availablePurpleRooms = availablePurpleRooms.concat(`roomNo${i}`);
      }
      shuffleArray(availablePurpleRooms);
      sessionStorage.setItem('purpleRoom', availablePurpleRooms[0]);
    }

    function generatePurpleRewards(rewards, purpleRoom) {
      let availablePurpleSquares = roomMap[purpleRoom];
      shuffleArray(availablePurpleSquares);
      const selectedPurpleSquares = availablePurpleSquares.slice(0, Math.min(availablePurpleSquares.length, getFromStor('maxNoPurpleSquares')));
      selectedPurpleSquares.forEach(sqr => {
        const squareId = sqr.id;
        const [, x, y] = squareId.split('-').map(Number);
        const idx = convertXY2Square(x, y);
        if (rewards[y][x] !== 2 && !gridContainer.children[idx].classList.contains('white')) {
            rewards[y][x] = 2;
        }
      });
      return rewards;
    }

    function updateTextColor(scoreText, score, previousScore) {
      const originalColor = 'black';
      var newColor = 'black';
      var timeout = 300;
      if ((score - previousScore) == getFromStor('greenSquareScore')) {
        newColor = '#228833';
        timeout = 500;
      } else if ((score - previousScore) == getFromStor('purpleSquareScore')) {
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
      const minDimension = Math.min(window.innerWidth, window.innerHeight - 20), squareSize = minDimension / gridSize;
      gridContainer.innerHTML = '';
      gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${squareSize}px)`;
      gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 0px)`;

      createGridSquares(squareSize);

      let roomNo = 5;
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
          // Neast-west
          if (x > mid - quat + 2 && x < mid + quat - 2 && y == mid - eigh - 2) {
            addSquare(x, y);
            continue;
          }
          // Seast-west
          if (x > mid - quat + 2 && x < mid + quat - 2 && y == gridSize - mid + eigh + 2) {
            addSquare(x, y);
            continue;
          }
          // Enorth-south
          if (y > mid - quat + 2 && y < mid + quat - 2 && x == gridSize - mid + eigh + 2) {
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
            createRoom(x - Math.floor(roomSize / 2), y - 1, 1, -1, roomSize, `roomNo${roomNo}`, 'armNorth');
            roomNo++;
            continue;
          }
          // Sentryway
          if ((x == mid - quat + 3 || x == mid + quat - 3) && y == gridSize - mid + eigh + 3) {
            addSquare(x, y);
            createRoom(x - Math.floor(roomSize / 2), y + 1, 1, 1, roomSize, `roomNo${roomNo}`, 'armSouth');
            roomNo++;
            continue;
          }
          // Eentryway
          if ((y == mid - quat + 3 || y == mid + quat - 3) && x == gridSize - mid + eigh + 3) {
            addSquare(x, y);
            createRoom(x + 1, y - Math.floor(roomSize / 2), 1, 1, roomSize, `roomNo${roomNo}`, 'armEast');
            roomNo++;
            continue;
          }
          // Wentryway
          if ((y == mid - quat + 3 || y == mid + quat - 3) && x == mid - eigh - 3) {
            addSquare(x, y);
            createRoom(x - 1, y - Math.floor(roomSize / 2), -1, 1, roomSize, `roomNo${roomNo}`, 'armWest');
            roomNo++;
            continue;
          }
        }
      }

      // north room
      createRoom(mid - Math.floor(roomSize / 2), quat - 3, 1, -1, roomSize, 'roomNo1', 'armNorth');

      // south room
      createRoom(mid - Math.floor(roomSize / 2), gridSize - quat + 3, 1, 1, roomSize, 'roomNo2', 'armSouth');

      // east room
      createRoom(gridSize - quat + 3, mid - Math.floor(roomSize / 2), 1, 1, roomSize, 'roomNo3', 'armEast');

      // west room
      createRoom(quat - 3, mid - Math.floor(roomSize / 2), -1, 1, roomSize, 'roomNo4', 'armWest');

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

    function createRoom(rx, ry, dirX, dirY, roomSize, roomName, armDirection) {
      for (let dy = 0; dy < roomSize; dy++) {
        for (let dx = 0; dx < roomSize; dx++) {
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
      if (!arm2RoomMap[armName]) {
        arm2RoomMap[armName] = [];
      }
      arm2RoomMap[armName].push(roomName);
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
        return square;
      }
    }

    function getArmsVisited(roomsVisited) {
      const armsVisited = new Set();
      roomsVisited.forEach(room => {
        armsVisited.add(room2ArmMap[room][0])
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
      return gridSize * y + x;
    }

    function constructURLWithScores(htmlFile, scoresSoFar) {
      let url = htmlFile + '?usr=lumi7el&cmr=n3ssiori&round=' + round;
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

    function getFromStor(varr) {
      return JSON.parse(sessionStorage.getItem(varr));
    }
});