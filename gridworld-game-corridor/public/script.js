import { getUrlParameter, getScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const gridContainer = document.getElementById('grid-container'), movesText = document.getElementById('moves'), scoreText = document.getElementById('score');

    const vars = await loadGameSettings();
    var rewards = Array.from({ length: vars.gridSize }, () => Array.from({ length: vars.gridSize }, () => 0)); // initialise
    const whenToGenerateRewards = vars.moves - Math.floor(Math.random() * (vars.maxStepsUntilReward - vars.minStepsUntilReward)) - vars.minStepsUntilReward;

    let score = 0, previousScore = 0, currentPosition = { x: vars.initialPosX, y: vars.initialPosY }, moves = vars.moves, previousPosition = currentPosition;
    setupGrid();

    movesText.innerHTML = 'Moves left: ' + vars.moves;
    var round = getRoundFromURL();
    const scoresSoFar = getScoresSoFar();
    let initialRewardPos = getUrlParameter('blob');

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
      gridContainer.children[newIdx].classList.add('current');
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
      if (!gridContainer.children[index].classList.contains('room')
        || gridContainer.children[index].classList.contains('white')) {// don't turn white suddenly green
        return [false, rewards]
      }

      rewards[startAtPos.y][startAtPos.x] = 1;
      const nearbyRange = vars.greenSquarePosRange;
      for (let i = 0; i < vars.maxNoGreenSquares - 1; i++) {
          let x, y, idx, signX, signY;
          do {
              signX = Math.random() < 0.5 ? -1 : 1;
              signY = Math.random() < 0.5 ? -1 : 1;
              x = startAtPos.x + signX * Math.floor(Math.random() * nearbyRange);
              y = startAtPos.y + signY * Math.floor(Math.random() * nearbyRange);
              idx = convertXY2Square(x, y)
          } while (x < 0 || y < 0 || !gridContainer.children[idx].classList.contains('grey'));
          rewards[y][x] = 1;
      }

      rewards[vars.gridSize - 1 - Math.floor(Math.random() * vars.purpleSquarePosRange)][vars.gridSize - 2 - Math.floor(Math.random() * vars.purpleSquarePosRange)] = 2;
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
      const minDimension = Math.min(window.innerWidth, window.innerHeight), squareSize = minDimension / vars.gridSize * 2;
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

      const middleRow = Math.floor(vars.gridSize / 2);
      for (let y = 0; y < vars.gridSize; y++) {
        for (let x = vars.gridSize - ((vars.roomSize - 1)/ 2) - 1; x >= 0; x--) {  // Start from the end and decrement
          if (y == middleRow) {
              addSquare(x, y);
              rowHeights[y] = 1;
              continue;
          }

          if (y < middleRow + vars.corridorWidth - 1 && y > middleRow - vars.corridorWidth + 1) {
              addSquare(x, y);
              rowHeights[y] = 1;
              continue;
          }

          // Entryways top
          if ((x - vars.gridSize + ((vars.roomSize - 1) / 2) + 1) % (vars.roomFrequency * 2) == 0
              && x > vars.roomSize
              && y == middleRow - ((vars.corridorWidth + 1) / 2)) {
              addSquare(x, y);
              rowHeights[y] = 1;
              rowHeights = addRoom(x, y, y > middleRow, rowHeights);
              continue;
          }

          // Entryways bottom
          if ((x - vars.gridSize + ((vars.roomSize - 1) / 2) + 1 - vars.roomFrequency) % (vars.roomFrequency * 2) == 0
              && x > vars.roomSize
              && y == middleRow + ((vars.corridorWidth + 1) / 2)) {
              addSquare(x, y);
              rowHeights[y] = 1;
              rowHeights = addRoom(x, y, y > middleRow, rowHeights);
              continue;
          }
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

    function addRoom(entryX, entryY, upper, rowHeights) {
      var dir = upper ? 1 : -1;
      for (let dy = 0; dy < vars.roomSize; dy++) {
        for (let dx = 0; dx < vars.roomSize; dx++) {
          let y = entryY + dir + (dy * dir)
          let x = entryX + dx - ((vars.roomSize - 1) / 2);
          let square = addSquare(x, y);
          square.classList.add('room');
          rowHeights[y] = 1;
        }
      }
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