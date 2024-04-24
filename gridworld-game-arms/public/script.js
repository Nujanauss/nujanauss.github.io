import { getUrlParameter, getScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const gridContainer = document.getElementById('grid-container'), movesText = document.getElementById('moves'), scoreText = document.getElementById('score');

    const vars = await loadGameSettings();
    const whenToGenerateRewards = vars.moves - Math.floor(Math.random() * (vars.maxStepsUntilReward - vars.minStepsUntilReward)) - vars.minStepsUntilReward;
    const roomMap = {};
    var rewards = Array.from({ length: vars.gridSize }, () => Array.from({ length: vars.gridSize }, () => 0)); // initialise

    let score = 0, previousScore = 0, currentPosition = { x: vars.initialPosX, y: vars.initialPosY }, moves = vars.moves, previousPosition = currentPosition;
    setupGrid();

    movesText.innerHTML = 'Moves left: ' + vars.moves;
    var round = getRoundFromURL();
    const scoresSoFar = getScoresSoFar();
    let initialRewardPos = getUrlParameter('blob');

    let visitedArms = [];
    let visitedRooms = [];

    var urlModified = false, generatedTrue = false;
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
        if (round == 1 && !generatedTrue && moves < whenToGenerateRewards - 1) {
          [generatedTrue, rewards] = generateRewards(vars, rewards, currentPosition);
          if (generatedTrue) {
            initialRewardPos = encodeCoordinates(currentPosition.x, currentPosition.y);
          }
        } else if (round > 1 && !generatedTrue ) {
          [generatedTrue, rewards] = generateRewards(vars, rewards, decodeCoordinates(initialRewardPos));
        }
        score = revealSquare(currentPosition,rewards);
        scoreText.innerHTML = 'Score: ' + score;
        movesText.innerHTML = 'Moves left: ' + moves;
        updateTextColor(scoreText,score,previousScore)

        previousScore = score;
        previousPosition = currentPosition;
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
      // Introduce stochasticity
      [axis, increment] = addStochasticity(axis, increment);
      if (axis === 'x') {
        newPosition.x += increment
      } else {
        newPosition.y += increment;
      }
      const oldIdx = convertXY2Square(currentPosition.x, currentPosition.y);
      const newIdx = convertXY2Square(newPosition.x, newPosition.y);
      if (newPosition.y < 0 || newPosition.y > vars.gridSize - 1 || newPosition.x < 0 || newPosition.x > vars.gridSize - 1) { // check within grid boundaries
        return currentPosition;
      }
      if (gridContainer.children[newIdx].classList.contains('hidden')) {
        return currentPosition;
      }
      gridContainer.children[oldIdx].classList.remove('current');
      currentPosition = newPosition;
      const newLocationClassList = gridContainer.children[newIdx].classList;
      newLocationClassList.add('current');
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

    function revealSquare(position,rewards) {
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
            roomNo = className;
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
      rewards[10][18] = 2;
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
      
      let rowHeights = new Array(vars.gridSize).fill(0); // we start with rows having 0 height, and change the ones we need to

      for (let y = 0; y < vars.gridSize; y++) {
          for (let x = 0; x < vars.gridSize; x++) {
              const square = document.createElement('div');
              square.id = `square-${x}-${y}`; 
              square.classList.add('square', 'hidden');
              square.style.width = square.style.height = squareSize + 'px';
              square.style.borderRadius = 5 + 'px';
              gridContainer.appendChild(square);
          }
      }

      let roomNo = 5;
      const mid = Math.floor(vars.gridSize / 2);
      const quat = Math.floor(mid / 2);
      const eigh = Math.floor(quat / 2);
      for (let y = 0; y < vars.gridSize; y++) {
        for (let x = 0; x < vars.gridSize; x++) {
          // north
          if (x == mid && y < mid && y > quat - 3) {
            addSquare(x, y);
            rowHeights[y] = 1;
            continue;
          }
          // south
          if (x == mid && y >= mid && y < vars.gridSize - quat + 3) {
            addSquare(x, y);
            rowHeights[y] = 1;
            continue;
          }
          // east
          if (y == mid && x >= mid && x < vars.gridSize - quat + 3) {
            addSquare(x, y);
            rowHeights[y] = 1;
            continue;
          }
          // west
          if (y == mid && x < mid && x > quat - 3) {
            addSquare(x, y);
            rowHeights[y] = 1;
            continue;
          }
          // Neast-west
          if (x > mid - quat + 2 && x < mid + quat - 2 && y == mid - eigh - 2) {
            addSquare(x, y);
            rowHeights[y] = 1;
            continue;
          }
          // Seast-west
          if (x > mid - quat + 2 && x < mid + quat - 2 && y == vars.gridSize - mid + eigh + 2) {
            addSquare(x, y);
            rowHeights[y] = 1;
            continue;
          }
          // Enorth-south
          if (y > mid - quat + 2 && y < mid + quat - 2 && x == vars.gridSize - mid + eigh + 2) {
            addSquare(x, y);
            rowHeights[y] = 1;
            continue;
          }
          // Wnorth-south
          if (y > mid - quat + 2 && y < mid + quat - 2 && x == mid - eigh - 2) {
            addSquare(x, y);
            rowHeights[y] = 1;
            continue;
          }
          // Nentryway
          if ((x == mid - quat + 3 || x == mid + quat - 3) && y == mid - eigh - 3) {
            addSquare(x, y);
            rowHeights[y] = 1;
            // Nroom
            for (let dy = 0; dy < vars.roomSize; dy++) {
              for (let dx = 0; dx < vars.roomSize; dx++) {
                let ry = y - dy - 1;
                let rx = x - Math.floor(vars.roomSize / 2) + dx;
                let square = addSquare(rx, ry);
                square.classList.add('room',`roomNo${roomNo}`,'armNorth');
                if (!roomMap[`roomNo${roomNo}`]) {
                  roomMap[`roomNo${roomNo}`] = [];
                }
                roomMap[`roomNo${roomNo}`].push(square);
                rowHeights[ry] = 1;
              }
            }
            roomNo++;
            continue;
          }
          // Sentryway
          if ((x == mid - quat + 3 || x == mid + quat - 3) && y == vars.gridSize - mid + eigh + 3) {
            addSquare(x, y);
            rowHeights[y] = 1;
            // Sroom
            for (let dy = 0; dy < vars.roomSize; dy++) {
              for (let dx = 0; dx < vars.roomSize; dx++) {
                let ry = y + dy + 1;
                let rx = x - Math.floor(vars.roomSize / 2) + dx;
                let square = addSquare(rx, ry);
                square.classList.add('room',`roomNo${roomNo}`,'armSouth');
                if (!roomMap[`roomNo${roomNo}`]) {
                  roomMap[`roomNo${roomNo}`] = [];
                }
                roomMap[`roomNo${roomNo}`].push(square);
                rowHeights[ry] = 1;
              }
            }
            roomNo++;
            continue;
          }
          // Eentryway
          if ((y == mid - quat + 3 || y == mid + quat - 3) && x == vars.gridSize - mid + eigh + 3) {
            addSquare(x, y);
            rowHeights[y] = 1;
            // Sroom
            for (let dy = 0; dy < vars.roomSize; dy++) {
              for (let dx = 0; dx < vars.roomSize; dx++) {
                let rx = x + dx + 1;
                let ry = y - Math.floor(vars.roomSize / 2) + dy;
                let square = addSquare(rx, ry);
                square.classList.add('room',`roomNo${roomNo}`,'armEast');
                if (!roomMap[`roomNo${roomNo}`]) {
                  roomMap[`roomNo${roomNo}`] = [];
                }
                roomMap[`roomNo${roomNo}`].push(square);
                rowHeights[ry] = 1;
              }
            }
            roomNo++;
            continue;
          }
          // Wentryway
          if ((y == mid - quat + 3 || y == mid + quat - 3) && x == mid - eigh - 3) {
            addSquare(x, y);
            rowHeights[y] = 1;
            // Nroom
            for (let dy = 0; dy < vars.roomSize; dy++) {
              for (let dx = 0; dx < vars.roomSize; dx++) {
                let rx = x - dx - 1;
                let ry = y - Math.floor(vars.roomSize / 2) + dy;
                let square = addSquare(rx, ry);
                square.classList.add('room',`roomNo${roomNo}`,'armWest');
                if (!roomMap[`roomNo${roomNo}`]) {
                  roomMap[`roomNo${roomNo}`] = [];
                }
                roomMap[`roomNo${roomNo}`].push(square);
                rowHeights[ry] = 1;
              }
            }
            roomNo++;
            continue;
          }
        }
      }
      // north room
          for (let dy = 0; dy < vars.roomSize; dy++) {
            for (let dx = 0; dx < vars.roomSize; dx++) {
              let ry = quat - 1 - dy - 2;
              let rx = mid - Math.floor(vars.roomSize / 2) + dx
              let square = addSquare(rx, ry);
              square.classList.add('room','roomNo1','armNorth');
              if (!roomMap['roomNo1']) {
                  roomMap['roomNo1'] = [];
              }
              roomMap['roomNo1'].push(square);
              rowHeights[ry] = 1;
            }
          }
          // south room
          for (let dy = 0; dy < vars.roomSize; dy++) {
            for (let dx = 0; dx < vars.roomSize; dx++) {
              let ry = vars.gridSize - quat + 1 + dy + 2;
              let rx = mid - Math.floor(vars.roomSize / 2) + dx
              let square = addSquare(rx, ry);
              square.classList.add('room', 'roomNo2','armSouth');
              if (!roomMap['roomNo2']) {
                roomMap['roomNo2'] = [];
              }
              roomMap['roomNo2'].push(square);
              rowHeights[ry] = 1;
            }
          }
          // east room
          for (let dy = 0; dy < vars.roomSize; dy++) {
            for (let dx = 0; dx < vars.roomSize; dx++) {
              let rx = vars.gridSize - quat + 1 + dx + 2;
              let ry = mid - Math.floor(vars.roomSize / 2) + dy
              let square = addSquare(rx, ry);
              square.classList.add('room', 'roomNo3','armEast');
              if (!roomMap['roomNo3']) {
                roomMap['roomNo3'] = [];
              }
              roomMap['roomNo3'].push(square);
              rowHeights[ry] = 1;
            }
          }
          // west room
          for (let dy = 0; dy < vars.roomSize; dy++) {
            for (let dx = 0; dx < vars.roomSize; dx++) {
              let rx = quat - 1 - dx - 2;
              let ry = mid - Math.floor(vars.roomSize / 2) + dy
              let square = addSquare(rx, ry);
              square.classList.add('room', 'roomNo4','armWest');
              if (!roomMap['roomNo4']) {
                roomMap['roomNo4'] = [];
              }
              roomMap['roomNo4'].push(square);
              rowHeights[ry] = 1;
            }
          }

      gridContainer.style.gridTemplateRows = rowHeights.map(height => height ? `${squareSize}px` : '0px').join(' ');
      var initialSquare = convertXY2Square(vars.initialPosX, vars.initialPosY);
      gridContainer.children[initialSquare].classList.remove('grey');
      gridContainer.children[initialSquare].classList.add('white');
      gridContainer.children[initialSquare].classList.add('current');
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
      let url = htmlFile + '?blob=' + initialRewardPos + '&rounds=' + vars.finalRound + '&round=' + round;
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
      validateVar(variables, 'roomSize', 3, 3, variables.roomFrequency * 2);
      validateVar(variables, 'minStepsUntilReward', 3, 0, variables.moves - 1);
      validateVar(variables, 'maxStepsUntilReward', 3, variables.minStepsUntilReward, variables.moves - 1);
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