import { getUrlParameter, getScoresSoFar, getComparersScoresSoFar, getGameSettings, buttonToNewPage } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const settings = getGameSettings();

    const trainingSettings = await loadTrainingSettings();
    async function loadTrainingSettings() {
      let response;
      if (settings.stochastic) {
        response = await fetch('training-settings-stochastic.json');
      } else {
        response = await fetch('training-settings-non-stochastic.json');
      }
      const data = await response.json();
      return data.vars;
    }

    const gridContainer = document.getElementById('grid-container');
    const movesText = document.getElementById('moves');
    const scoreText = document.getElementById('score');

    const initialStochasticValue = 0.5;
    const initialPurpleValue = 0.;
    const round = 1;
    var currentMove = 0;

    const numberOfMoves = trainingSettings.moves;
    const rows = trainingSettings.rows;
    const cols = trainingSettings.cols;
    const decay = trainingSettings.decay;
    const decayCenter = trainingSettings.decayCenter;
    const noiseStdDev = trainingSettings.noiseStdDev;
    const stochastic = settings.stochastic;
    const stochasticValues = trainingSettings.stochasticValues;
    const purpleValues = trainingSettings.purpleValues;
    const binary = settings.binary;
    const meanValues = trainingSettings.meanValues;
    const chanceToWin = trainingSettings.chanceToWin;
    const chanceToWinPurple = trainingSettings.chanceToWinPurple;

    const numberOfRounds = settings.numberOfRounds;
    const roundsUntilPurple = settings.roundsUntilPurple;
    const greenSquareScore = settings.greenSquareScore;
    const purpleSquareScore = settings.purpleSquareScore;

    let score = 0, previousScore = 0;
    const successScore = settings.stochastic ? 500 : 100;
    let decision = Array(), rewardReceived = Array(), timeStamps = Array();
    setupGrid();

    document.getElementById('trainingOver').innerHTML = 'Score above ' + successScore;

    function gameLogic(square) {
        if (score > successScore) {
            return;
        }
        var additionalScore = revealSquare(square);

        decision[currentMove] = square;
        rewardReceived[currentMove] = additionalScore;
        timeStamps[currentMove] = new Date().toISOString().split('T')[1];

        score += additionalScore;
        currentMove = (currentMove + 1) % numberOfMoves;

        scoreText.innerHTML = 'Score: ' + score;
        updateTextColor(scoreText, score, previousScore);

        previousScore = score;

        if (score > successScore) {
          endTrialLogic(successScore, decision, rewardReceived, timeStamps);
        }
    }

    function endTrialLogic(successScore, decision, rewardReceived, timeStamps) {
      saveTrainingData(decision, rewardReceived, timeStamps);
      document.getElementById('trainingOverBut').classList.remove('gone');
      document.getElementById('trainingOver').innerHTML = 'Nice! You scored more than ' + successScore;
      buttonToNewPage('trainingOverBut', 'prebegin1');
      return;
    }

    function revealSquare(square) {
        square.classList.remove('grey');
        square.classList.add('white');
        const squareX = parseFloat(square.id.split(',')[0]);
        const squareY = parseFloat(square.id.split(',')[1]);
        var additionalScore = 0;
        var randomVal = Math.random();
        if (binary) {
            if (randomVal < chanceToWin[currentMove][squareY][squareX]) { // CHANCE TO WIN IS HERE!
              if (round >= roundsUntilPurple && randomVal < chanceToWinPurple[currentMove][squareY][squareX]) {
                additionalScore = purpleSquareScore;
                makePurple(square, additionalScore);
              } else {
                additionalScore = greenSquareScore;
                makeGreen(square, additionalScore);
              }
            }
        } else {
            if (round >= roundsUntilPurple && randomVal < chanceToWinPurple[currentMove][squareY][squareX]) {
                additionalScore = purpleSquareScore;
                makePurple(square, additionalScore);
            } else {
              additionalScore = Math.round(chanceToWin[currentMove][squareY][squareX] * 100);
              makeGreen(square, additionalScore);
            }
        }
        setTimeout(() => {
            square.classList.remove('white');
            square.classList.add('grey');
        }, 500);
        return additionalScore;
    }

    function makeGreen(square, additionalScore) {
        const pseudoElement = document.createElement('div');
        pseudoElement.classList.add('green');
        const text = document.createElement('div');
        text.classList.add('square-score');
        text.innerHTML = additionalScore;
        pseudoElement.appendChild(text);
        square.appendChild(pseudoElement);
        square.classList.add('greenish');
        setTimeout(() => {
            square.classList.remove('greenish');
            square.classList.remove('white');
            square.classList.add('grey');
            square.removeChild(pseudoElement);
        }, 700);
    }

    function makePurple(square, additionalScore) {
        const pseudoElement = document.createElement('div');
        pseudoElement.classList.add('gold');
        const text = document.createElement('div');
        text.classList.add('square-score');
        text.innerHTML = additionalScore;
        pseudoElement.appendChild(text);
        square.appendChild(pseudoElement);
        square.classList.add('goldish');
        setTimeout(() => {
            square.classList.remove('goldish');
            square.classList.remove('white');
            square.classList.add('grey');
            square.removeChild(pseudoElement);
        }, 700);
    }

    function updateTextColor(scoreText, score, previousScore) {
        const originalColor = 'black';
        var newColor = 'black';
        var timeout = 300;
        if ((score - previousScore) == greenSquareScore) {
            newColor = '#228833';
            timeout = 500;
        } else if ((score - previousScore) == purpleSquareScore) {
            newColor = '#AA3377';
            timeout = 500;
        } else if (score < previousScore) {
            newColor = '#BBBBBB'; //red:#F05039
        }
        scoreText.style.color = newColor;
        setTimeout(() => {
            scoreText.style.color = originalColor;
        }, timeout);
    }

    function setupGrid() {
      const padding = 10;
      const minDimension = Math.min(window.innerWidth, window.innerHeight - rows * padding);
      const squareSize = (minDimension / Math.max(rows, cols)) - padding;

      gridContainer.innerHTML = '';
      gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${squareSize + padding}px)`;
      gridContainer.style.gridTemplateRows = `repeat(${rows}, ${squareSize + padding}px)`;

      createGridSquares(rows, cols, squareSize, padding);
    }

    function createGridSquares(rows, cols, squareSize, padding) {
      for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
              const square = createSquare(x, y, squareSize, padding);
              gridContainer.appendChild(square);
          }
      }
    }

    function createSquare(x, y, squareSize, padding) {
      const square = document.createElement('div');
      square.id = `${x},${y}`;
      square.classList.add('square');
      square.classList.add('grey');
      square.style.width = square.style.height = squareSize + 'px';
      square.style.borderRadius = '5px';
      square.style.margin = `${padding / 2}px`;

      square.addEventListener('click', function(event) {
          gameLogic(square);
      });

      return square;
    }

    function convertXY2Square(x, y) {
      return y * cols + x;
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

    function gaussianRandom(mean=0, stdev=1) { //stackOverflow
      const u = 1 - Math.random(); // Converting [0,1) to (0,1]
      const v = Math.random();
      const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      // Transform to the desired mean and standard deviation:
      return z * stdev + mean;
    }
    
    function saveTrainingData(decision, rewardReceived, timeStamps) {
      // Create the main object with the trainingData label
      const data = {
              move: {}
      };

      // Populate the trainingData object
      let squareX;
      let squareY;
      decision.forEach((square, index) => {
          squareX = parseFloat(square.id.split(',')[0]);
          squareY = parseFloat(square.id.split(',')[1]);
          data.move[index] = {
              decisionX: squareX,
              decisionY: squareY,
              reward: rewardReceived[index],
              timestamp: timeStamps[index]
          };
      });

      // Convert the data object to a JSON string
      const dataJSON = JSON.stringify(data);

      // Store the JSON string in sessionStorage
      sessionStorage.setItem("trainingData", dataJSON);
    }
});