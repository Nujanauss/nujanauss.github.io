import { getUrlParameter, getScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const gridContainer = document.getElementById('grid-container'), movesText = document.getElementById('moves'), scoreText = document.getElementById('score');

    const vars = await loadGameSettings();
    const rewards = generateRewards(vars);

    let score = 0, previousScore = 0, currentPosition = { x: vars.initialPosX, y: vars.initialPosY }, moves = vars.moves;
    setupGrid();

    movesText.innerHTML = 'Moves left: ' + vars.moves;
    var round = updateRoundAndURL();
    const scoresSoFar = getScoresSoFar();

    var urlModified = false;
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
          return;
        }

        if (!urlModified && moves < 1) { //only modify URL once
          endTrialLogic();
          return;
        }
        [score, moves, currentPosition] = gameLogic(event,key,currentPosition);
        scoreText.innerHTML = 'Score: ' + score;
        movesText.innerHTML = 'Moves left: ' + moves;
        updateTextColor(scoreText,score,previousScore)

        previousScore = score;
    });
    
    async function loadGameSettings() {
      const response = await fetch('settings.json');
      const data = await response.json();
      return validateVars(data.vars);
    }

    function updateRoundAndURL() {
      var round = new URLSearchParams(window.location.search).get('round');
      if (!round) {
        round = 1;
        const url = new URL(window.location.href);
        url.searchParams.set('rounds', vars.finalRound);
        url.searchParams.set('round', round);
        history.replaceState(null, '', url);
      } else {
        round++;
      }
      return round;
    }

    function gameLogic(event,key,currentPosition) {
      const newPosition = { ...currentPosition };

      var axis = key.includes('Up') || key.includes('Down') ? 'y' : 'x';
      var increment = key.includes('Up') || key.includes('Left') ? -1 : 1;
      // Introduce stochasticity
      [axis, increment] = addStochasticity(axis, increment);
      if (axis === 'x') {
        if (newPosition.x + increment >= 0 && newPosition.x + increment < vars.gridSize) { // check within grid boundaries
            newPosition.x += increment;
            moves--;
        }
      } else {
          if (newPosition.y + increment >= 0 && newPosition.y + increment < vars.gridSize) {
              newPosition.y += increment;
              moves--;
          }
      }
      if (newPosition.x !== currentPosition.x || newPosition.y !== currentPosition.y) {
          gridContainer.children[currentPosition.y * vars.gridSize + currentPosition.x].classList.remove('current');
          currentPosition = newPosition;
          gridContainer.children[currentPosition.y * vars.gridSize + currentPosition.x].classList.add('current');
          score = revealSquare(currentPosition);
      }
      return [score, moves, currentPosition];
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

    function revealSquare(position) {
      const index = position.y * vars.gridSize + position.x, square = gridContainer.children[index];
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

    function generateRewards(vars) {
      const rewards = Array.from({ length: vars.gridSize }, () => Array.from({ length: vars.gridSize }, () => 0));
      const [rowGreen1, colGreen1] = [Math.floor(Math.random() * 2) + 1, Math.floor(Math.random() * 2) + 1];
      rewards[rowGreen1][colGreen1] = 1;
      const [rowGreen2, colGreen2] = [Math.floor(Math.random() * 2) + 1, Math.floor(Math.random() * 2) + 1];
      rewards[rowGreen2][colGreen2] = 1;
      const [rowGold, colGold] = [vars.gridSize - 1 - Math.floor(Math.random() * 2), vars.gridSize - 1 - Math.floor(Math.random() * 2)];
      rewards[rowGold][colGold] = 2;
      return rewards;
    }

    function updateTextColor(scoreText,score,previousScore) {
      const originalColor = 'black';
      var newColor = 'black';
      if ((score - previousScore) == vars.greenSquareScore) {
        newColor = '#228833';
      } else if ((score - previousScore) == vars.purpleSquareScore) {
        newColor = '#AA3377';
      } else if (score < previousScore) {
        newColor = '#BBBBBB' //red:#F05039
      }
      scoreText.style.color = newColor;
      setTimeout(() => {
          scoreText.style.color = originalColor;
      }, 300);
    }

    function setupGrid() {
      const minDimension = Math.min(window.innerWidth, window.innerHeight - 50), squareSize = minDimension / vars.gridSize;
      gridContainer.innerHTML = '';
      gridContainer.style.width = vars.gridSize * squareSize + 'px';
      gridContainer.style.height = vars.gridSize * squareSize + 'px';
      gridContainer.style.margin = 'auto';
      gridContainer.style.gridTemplateColumns = `repeat(${vars.gridSize}, ${squareSize}px)`;
      gridContainer.style.gridTemplateRows = `repeat(${vars.gridSize}, ${squareSize}px)`;
      for (let i = 0; i < vars.gridSize; i++) {
          for (let j = 0; j < vars.gridSize; j++) {
              const square = document.createElement('div');
              square.classList.add('square', 'grey');
              square.style.width = square.style.height = squareSize + 'px';
              square.style.borderRadius = 5 + 'px';
              gridContainer.appendChild(square);
          }
      }
      var initialSquare = convertXY2Square(vars.initialPosX, vars.initialPosY);
      gridContainer.children[initialSquare].classList.remove('grey');
      gridContainer.children[initialSquare].classList.add('white');
      gridContainer.children[initialSquare].classList.add('current');
    }

    function convertXY2Square(x, y) {
      return vars.gridSize * y + x;
    }

    function constructURLWithScores(htmlFile, scoresSoFar) {
      let url = htmlFile + '?rounds=' + vars.finalRound + '&round=' + round;
      scoresSoFar.forEach((score, index) => {
          url += '&score' + (index + 1) + '=' + score;
      });
      return url;
    }

    function endTrialLogic() {
      scoresSoFar.push(score);
      if (round == vars.roundsTillComparison) {
        window.location.href = constructURLWithScores("standings.html", scoresSoFar);
      } else if (round > (vars.finalRound - 1)){
        window.location.href = constructURLWithScores("thanks.html", scoresSoFar);
      } else {
        window.location.href = constructURLWithScores("intermediary.html", scoresSoFar);
      }
      urlModified = true; 
      return;
    }

    function validateVars(variables) {
      validateVar(variables, 'gridSize', 30, 2, 200);
      validateVar(variables, 'moves', 70, 1);
      validateVar(variables, 'initialPosX', 0, 0, variables.gridSize - 1);
      validateVar(variables, 'initialPosY', 0, 0, variables.gridSize - 1);
      validateVar(variables, 'roundsTillComparison', 3, 1, variables.finalRound - 1);
      validateVar(variables, 'finalRound', 6, 1);
      validateVar(variables, 'actionStochasticity', 0, 0, 1);
      validateVar(variables, 'greenSquareScore', 10, 1);
      validateVar(variables, 'purpleSquareScore', 1000, variables.greenSquareScore);
      validateVar(variables, 'maxNoGreenSquares', 2, 0);
      validateVar(variables, 'maxNoPurpleSquares', 1, 0);
      validateVar(variables, 'greenSquareOffsetFromEdgeX', 1, 0, variables.gridSize - 1);
      validateVar(variables, 'greenSquareOffsetFromEdgeY', 1, 0, variables.gridSize - 1);
      validateVar(variables, 'greenSquarePosRangeX', 2, 0, variables.gridSize - 1);
      validateVar(variables, 'greenSquarePosRangeY', 2, 0, variables.gridSize - 1);
      validateVar(variables, 'purpleSquareOffsetFromEdgeX', 0, 0, variables.gridSize - 1);
      validateVar(variables, 'purpleSquareOffsetFromEdgeY', 0, 0, variables.gridSize - 1);
      validateVar(variables, 'purpleSquarePosRangeX', 2, 0, variables.gridSize - 1);
      validateVar(variables, 'purpleSquarePosRangeY', 2, 0, variables.gridSize - 1);
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