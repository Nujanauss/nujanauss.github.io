document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('grid-container');
    const movesText = document.getElementById('moves');
    const scoreText = document.getElementById('score');
    
    var vars = {
      gridSize: -1,
      moves: 70,
      currentPosX: 20,
      currentPosY: 20,
      roundsTillComparison: 3,
      finalRound: 6,
      actionStochasticity: 0,
      greenSquareScore: 10,
      purpleSquareScore: 1000,
      maxNoGreenSquares: 2,
      maxNoPurpleSquares: 2,
      greenSquareOffsetFromEdgeX: 1,
      greenSquareOffsetFromEdgeY: 1,
      greenSquarePosRangeX: 2,
      greenSquarePosRangeY: 2,
      purpleSquareOffsetFromEdgeX: 0,
      purpleSquareOffsetFromEdgeY: 0,
      purpleSquarePosRangeX: 2,
      purpleSquarePosRangeY: 2
    };
    vars = validateVars(vars);

    const gridSize = vars.gridSize, rewards = generateRewards();

    let score = 0, previousScore = 0, currentPosition = { x: vars.currentPosX, y: vars.currentPosY }, moves = vars.moves
    setupGrid();
    movesText.innerHTML = 'Moves left: ' + moves;

    var round = getUrlParameter('round');
    if (!round) {
      round = 2;
    } else {
      round++;
    }

    document.addEventListener('keydown', function(event) {
        if (moves < 1) {
          if (round == 4) {
            window.location.href = 'standings.html?score=' + score;
          } else if (round > 6){
            window.location.href = 'thanks.html';
          } else {
            window.location.href = 'intermediary.html?score=' + score + '&round=' + round;
          }
          return;
        }
        const key = event.key, newPosition = { ...currentPosition };
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            const axis = key.includes('Up') || key.includes('Down') ? 'y' : 'x';
            const increment = key.includes('Up') || key.includes('Left') ? -1 : 1;
            if (axis === 'x') {
              if (newPosition.x + increment >= 0 && newPosition.x + increment < gridSize) { // check within grid boundaries
                  newPosition.x += increment;
                  moves--;
              }
            } else {
                if (newPosition.y + increment >= 0 && newPosition.y + increment < gridSize) {
                    newPosition.y += increment;
                    moves--;
                }
            }
            if (newPosition.x !== currentPosition.x || newPosition.y !== currentPosition.y) {
                gridContainer.children[currentPosition.y * gridSize + currentPosition.x].classList.remove('current');
                currentPosition = newPosition;
                gridContainer.children[currentPosition.y * gridSize + currentPosition.x].classList.add('current');
                score = revealSquare(currentPosition);
            }
        }
        scoreText.innerHTML = 'Score: ' + score;
        movesText.innerHTML = 'Moves left: ' + moves;
        const originalColor = 'black';

        scoreText.style.color = score > previousScore ? '#1F449C' : '#F05039';
        setTimeout(() => {
            scoreText.style.color = originalColor;
        }, 300);

        previousScore = score;
    });

    function revealSquare(position) {
      const index = position.y * gridSize + position.x, square = gridContainer.children[index];
      square.classList.remove('grey');
      if (rewards[position.y][position.x] === 1) {
          square.classList.add('green');
          score += 20;
      } else if (rewards[position.y][position.x] === 2) {
          square.classList.add('gold');
          score += 1000;
      } else {
          square.classList.add('white');
          score--;
      }
      return score;
    }

    function generateRewards() {
      const rewards = Array.from({ length: vars.gridSize }, () => Array.from({ length: vars.gridSize }, () => 0));
      const [rowGreen1, colGreen1] = [Math.floor(Math.random() * 2) + 1, Math.floor(Math.random() * 2) + 1];
      rewards[rowGreen1][colGreen1] = 1;
      const [rowGreen2, colGreen2] = [Math.floor(Math.random() * 2) + 1, Math.floor(Math.random() * 2) + 1];
      rewards[rowGreen2][colGreen2] = 1;
      const [rowGold, colGold] = [vars.gridSize - 1 - Math.floor(Math.random() * 2), vars.gridSize - 1 - Math.floor(Math.random() * 2)];
      rewards[rowGold][colGold] = 2;
      return rewards;
    }

    function setupGrid() {
      const minDimension = Math.min(window.innerWidth, window.innerHeight - 50), squareSize = minDimension / gridSize;
      gridContainer.innerHTML = '';
      gridContainer.style.width = gridSize * squareSize + 'px';
      gridContainer.style.height = gridSize * squareSize + 'px';
      gridContainer.style.margin = 'auto';
      gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${squareSize}px)`;
      gridContainer.style.gridTemplateRows = `repeat(${gridSize}, ${squareSize}px)`;
      for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
              const square = document.createElement('div');
              square.classList.add('square', 'grey');
              square.style.width = square.style.height = squareSize + 'px';
              gridContainer.appendChild(square);
          }
      }
      gridContainer.children[0].classList.remove('grey');
      gridContainer.children[0].classList.add('white');
      gridContainer.children[0].classList.add('current');
    }

    function getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function validateVars(variables) {
      if (variables.gridSize < 2 || variables.gridSize > 200 || variables.gridSize === undefined) {
          console.error('Invalid gridSize! Setting to default: 30');
          variables.gridSize = 30;
      }
      if (variables.moves < 1 || variables.moves === undefined) {
          console.error('Invalid moves! Setting to default: 70');
          variables.moves = 70;
      }
      if (variables.currentPosX < 0 || variables.currentPosX > (variables.gridSize - 1) || variables.currentPosX === undefined) {
          console.error('Invalid currentPosX! Setting to default: 0');
          variables.currentPosX = 0;
      }
      if (variables.currentPosY < 0 || variables.currentPosY > (variables.gridSize - 1) || variables.currentPosY === undefined) {
          console.error('Invalid currentPosY! Setting to default: 0');
          variables.currentPosY = 0;
      }
      if (variables.roundsTillComparison < 1 || variables.roundsTillComparison > variables.finalRound - 1 || variables.roundsTillComparison === undefined) {
          console.error('Invalid roundsTillComparison! Setting to default: 3');
          variables.roundsTillComparison = 3;
      }
      if (variables.finalRound < 1 || variables.finalRound === undefined) {
          console.error('Invalid finalRound! Setting to default: 6');
          variables.finalRound = 6;
      }
      if (variables.actionStochasticity < 0 || variables.actionStochasticity > 1 || variables.actionStochasticity === undefined) {
          console.error('Invalid actionStochasticity! Setting to default: 0');
          variables.actionStochasticity = 0;
      }
      if (variables.greenSquareScore < 1 || variables.greenSquareScore === undefined) {
          console.error('Invalid greenSquareScore! Setting to default: 10');
          variables.greenSquareScore = 10;
      }
      if (variables.purpleSquareScore < variables.greenSquareScore || variables.purpleSquareScore === undefined) {
          console.error('Invalid purpleSquareScore! Setting to default: 1000');
          variables.purpleSquareScore = 1000;
      }
      if (variables.maxNoGreenSquares < 0 || variables.maxNoGreenSquares === undefined) {
          console.error('Invalid maxNoGreenSquares! Setting to default: 2');
          variables.maxNoGreenSquares = 2;
      }
      if (variables.maxNoPurpleSquares < 0 || variables.maxNoPurpleSquares === undefined) {
          console.error('Invalid maxNoPurpleSquares! Setting to default: 1');
          variables.maxNoPurpleSquares = 1;
      }
      if (variables.greenSquareOffsetFromEdgeX < 0 || variables.greenSquareOffsetFromEdgeX > (variables.gridSize - 1) || variables.greenSquareOffsetFromEdgeX === undefined) {
          console.error('Invalid greenSquareOffsetFromEdgeX! Setting to default: 1');
          variables.greenSquareOffsetFromEdgeX = 1;
      }
      if (variables.greenSquareOffsetFromEdgeY < 0 || variables.greenSquareOffsetFromEdgeY > (variables.gridSize - 1) || variables.greenSquareOffsetFromEdgeY === undefined) {
          console.error('Invalid greenSquareOffsetFromEdgeY! Setting to default: 1');
          variables.greenSquareOffsetFromEdgeY = 1;
      }
      if (variables.greenSquarePosRangeX < 0 || variables.greenSquarePosRangeX > (variables.gridSize - 1) || variables.greenSquarePosRangeX === undefined) {
          console.error('Invalid greenSquarePosRangeX! Setting to default: 2');
          variables.greenSquarePosRangeX = 2;
      }
      if (variables.greenSquarePosRangeY < 0 || variables.greenSquarePosRangeY > (variables.gridSize - 1) || variables.greenSquarePosRangeY === undefined) {
          console.error('Invalid greenSquarePosRangeY! Setting to default: 2');
          variables.greenSquarePosRangeY = 2;
      }
      if (variables.purpleSquareOffsetFromEdgeX < 0 || variables.purpleSquareOffsetFromEdgeX > (variables.gridSize - 1) || variables.purpleSquareOffsetFromEdgeX === undefined) {
          console.error('Invalid purpleSquareOffsetFromEdgeX! Setting to default: 0');
          variables.purpleSquareOffsetFromEdgeX = 0;
      }
      if (variables.purpleSquareOffsetFromEdgeY < 0 || variables.purpleSquareOffsetFromEdgeY > (variables.gridSize - 1) || variables.purpleSquareOffsetFromEdgeY === undefined) {
          console.error('Invalid purpleSquareOffsetFromEdgeY! Setting to default: 0');
          variables.purpleSquareOffsetFromEdgeY = 0;
      }
      if (variables.purpleSquarePosRangeX < 0 || variables.purpleSquarePosRangeX > (variables.gridSize - 1) || variables.purpleSquarePosRangeX === undefined) {
          console.error('Invalid purpleSquarePosRangeX! Setting to default: 2');
          variables.purpleSquarePosRangeX = 2;
      }
      if (variables.purpleSquarePosRangeY < 0 || variables.purpleSquarePosRangeY > (variables.gridSize - 1) || variables.purpleSquarePosRangeY === undefined) {
          console.error('Invalid purpleSquarePosRangeY! Setting to default: 2');
          variables.purpleSquarePosRangeY = 2;
      }
      return variables;
    }

});