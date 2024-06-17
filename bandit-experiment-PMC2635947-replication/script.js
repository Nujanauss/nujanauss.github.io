import { getUrlParameter, getScoresSoFar, getComparersScoresSoFar, getGameSettings, initializeFocusTracker } from './shared.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
    const settings = getGameSettings();

    const gridContainer = document.getElementById('grid-container');
    const movesText = document.getElementById('moves');
    const scoreText = document.getElementById('score');

    let movesSinceLastComparison = 0;
    let scoreSinceLastComparison = 0;
    const initialStochasticValue = 0.5;
    const initialPurpleValue = 0.;

    const numberOfMoves = settings.moves;
    var movesRemaining = settings.moves;

    const rows = settings.rows;
    const cols = settings.cols;
    const decay = settings.decay;
    const decayCenter = settings.decayCenter;
    const noiseStdDev = settings.noiseStdDev;
    const stochastic = settings.stochastic;
    const stochasticValues = settings.stochasticValues;
    const purpleValues = settings.purpleValues;
    const binary = settings.binary;
    const meanValues = settings.meanValues;
    const chanceToWin = settings.chanceToWin;
    const chanceToWinPurple = settings.chanceToWinPurple;

    const numberOfRounds = settings.numberOfRounds;
    const includeComparison = settings.includeComparison;
    const comparisonFrequencyRounds = settings.comparisonFrequencyRounds;
    const comparisonFrequency = settings.comparisonFrequency;
    const comparisonOnNewPage = settings.comparisonOnNewPage;
    const probUpwardComparison = settings.probUpwardComparison;
    const comparisonMean = settings.comparisonMean;
    const comparisonStdDev = settings.comparisonStdDev;
    const greenSquareScore = settings.greenSquareScore;
    const purpleSquareScore = settings.purpleSquareScore;


    let score = 0, previousScore = 0, comparersScore = 0;
    let decision = Array(numberOfMoves), rewardReceived = Array(numberOfMoves), comparison = Array(numberOfMoves), timeStamps = Array(numberOfMoves);
    setupGrid();
    var round = getRoundFromURL();

    movesText.innerHTML = 'Moves left: ' + movesRemaining;
    const scoresSoFar = getScoresSoFar();
    const comparersScoreSoFar = getComparersScoresSoFar();

    function getRoundFromURL() {
        var round = new URLSearchParams(window.location.search).get('round');
        if (!round) {
            round = 1;
            const url = new URL(window.location.href);
            url.searchParams.set('round', round);
            history.replaceState(null, '', url);
        }
        return parseInt(round, 10);
    }

    function gameLogic(square) {
        if (movesRemaining < 1) {
            return;
        }
        movesRemaining--;
        var additionalScore = revealSquare(square);
        score += additionalScore;

        if (includeComparison) {
          movesSinceLastComparison++;
          scoreSinceLastComparison += additionalScore;
          comparersScore += getComparersAdditional(additionalScore);
        }

        var idx = numberOfMoves - movesRemaining - 1; // rewrite this out to SOS
        decision[idx] = square;
        rewardReceived[idx] = additionalScore;
        comparison[idx] = comparersScore;
        timeStamps[idx] = new Date().toISOString().split('T')[1];

        scoreText.innerHTML = 'Score: ' + score;
        movesText.innerHTML = 'Moves left: ' + movesRemaining;
        updateTextColor(scoreText, score, previousScore);

        previousScore = score;

        if (includeComparison && !comparisonOnNewPage && movesSinceLastComparison == comparisonFrequency && (round % comparisonFrequencyRounds == 0)) {
          blockScreenForComparison();
        }

        if (movesRemaining < 1) {
          endTrialLogic(scoresSoFar, comparersScoreSoFar);
        }
    }
    
    function blockScreenForComparison() {
      if (comparisonFrequency > 1) {
        document.getElementById('no-comparison-trials').innerHTML = comparisonFrequency + ' moves';
      } else {
        document.getElementById('no-comparison-trials').innerHTML = 'move';
      }
      document.getElementById("player-score-since-last-comparison").innerHTML = scoreSinceLastComparison;
      document.getElementById("comparison-score-since-last-comparison").innerHTML = comparersScore;
      document.getElementById("comparison-information").classList.remove("gone");
      document.body.style.cursor = 'none !important';
      document.getElementById("overlay").style.display = 'block';
      setTimeout(() => {
        document.getElementById("read-comparison").style.visibility = 'visible';
      }, 3000);
      movesSinceLastComparison = 0;
      scoreSinceLastComparison = 0;
      comparersScore = 0;
    }

    function endTrialLogic(scoresSoFar, comparersScoreSoFar) {
      saveTrainingData(decision, comparison, rewardReceived, timeStamps);
      document.getElementById("trialOver").classList.remove("gone");
      document.getElementById("trialOverBut").classList.remove("gone");
      scoresSoFar.push(score);
      comparersScoreSoFar.push(comparersScore);
      if (round < numberOfRounds) {
        if (includeComparison && comparisonOnNewPage && (round % comparisonFrequencyRounds == 0)) {
          document.getElementById('trialOverBut').addEventListener('click', function() {
            window.location.href = constructURLWithScores("standings", scoresSoFar, comparersScoreSoFar);
          });
        } else {
          document.getElementById('trialOverBut').addEventListener('click', function() {
            window.location.href = constructURLWithScores("intermediary", scoresSoFar, comparersScoreSoFar);
          });
        }
      } else {
        document.getElementById('trialOverBut').addEventListener('click', function() {
          window.location.href = constructURLWithScores("thanks", scoresSoFar, comparersScoreSoFar);
        });
      }
      return;
    }

    function revealSquare(square) {
        square.classList.remove('grey');
        square.classList.add('white');
        const squareX = parseFloat(square.id.split(',')[0]);
        const squareY = parseFloat(square.id.split(',')[1]);
        var additionalScore = 0;
        var randomVal = Math.random();
        var currentMove = numberOfMoves - movesRemaining - 1;
        if (settings.rewardsChangeAcrossRounds) {
          currentMove += ((round - 1) * numberOfMoves);
        }
        if (binary) {
            if (randomVal < chanceToWin[currentMove][squareY][squareX]) { // CHANCE TO WIN IS HERE!
              if (randomVal < chanceToWinPurple[currentMove][squareY][squareX]) {
                additionalScore = purpleSquareScore;
                makePurple(square, additionalScore);
              } else {
                additionalScore = greenSquareScore;
                makeGreen(square, additionalScore);
              }
            }
        } else {
            if (randomVal < chanceToWinPurple[currentMove][squareY][squareX]) {
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

    function getComparersAdditional(playersAdditionalScore) {
      var randomVal = Math.random();
      var currentMove = numberOfMoves - movesRemaining - 1;
      if (settings.rewardsChangeAcrossRounds) {
        currentMove += ((round - 1) * numberOfMoves);
      }
      // upward comparison
      if (Math.random() < probUpwardComparison) {
        if (binary) { 
          return greenSquareScore;
        }
        if (settings.comparerUsesAvailableCards) {
          return getUpwardComparisonAvailableValue(playersAdditionalScore, currentMove);
        }
        return playersAdditionalScore += Math.round(Math.min(additionalScore + gaussianRandom(comparisonMean, comparisonStdDev), 100));
      }
      // downward comparison
      if (binary) {
        return 0;
      }
      if (settings.comparerUsesAvailableCards) {
        return getDownwardLateralComparisonAvailableValue(playersAdditionalScore, currentMove);
      }
      return playersAdditionalScore += Math.round(Math.max(0, additionalScore - gaussianRandom(comparisonMean, comparisonStdDev)));
    }

    function getUpwardComparisonAvailableValue(playersAdditionalScore, currentMove) {
      const greenChances = chanceToWin[currentMove].flat(2);
      const purpleChances = chanceToWinPurple[currentMove].flat(2);
      
      if (settings.optimalValueComparison) {
          if (purpleChances.some(chance => chance > 0)) { // purple is always optimal
              return purpleSquareScore;
          } else { // if no purple available
              return Math.round(Math.max(...greenChances) * 100);
          }
      } else {
          var availableScores = greenChances.map(value => Math.round(value * 100)); // convert all green chances to scores
          purpleChances.forEach(value => { // same for purple chances
              if (value > 0) {
                  availableScores.push(purpleSquareScore);
              }
          });
          shuffleArray(availableScores);
          for (let val of availableScores) { // first value greater than playersAdditionalScore including purple
              if (val > playersAdditionalScore) {
                  return val;
              }
          }
      }
      return playersAdditionalScore; // just in case
    }

    function getDownwardLateralComparisonAvailableValue(playersAdditionalScore, currentMove) {
      const flattenedCombinedArray = [ ...chanceToWin[currentMove].flat(2), ...chanceToWinPurple[currentMove].flat(2) ];
      shuffleArray(flattenedCombinedArray);
      for (let value of flattenedCombinedArray) {
        var val = Math.round(value * 100);
        if (val <= playersAdditionalScore) {// first value less than playersAdditionalScore
          return val;
        }
      }
      return 0; // just in case
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

    function constructURLWithScores(htmlFile, scoresSoFar, comparersScoreSoFar) {
      let url = htmlFile + '?round=' + round;
      scoresSoFar.forEach((score, index) => {
          url += '&score' + (index + 1) + '=' + score;
      });
      comparersScoreSoFar.forEach((score, index) => {
          url += '&n3ssiori' + (index + 1) + '=' + score;
      });
      return url;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }
    
    document.getElementById("read-comparison").addEventListener('click', function() {
      overlay.style.display = 'none';
      document.getElementById("comparison-information").classList.add('gone');
      document.body.style.cursor = 'move';
    });

    function gaussianRandom(mean=0, stdev=1) { //stackOverflow
      const u = 1 - Math.random(); // Converting [0,1) to (0,1]
      const v = Math.random();
      const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      // Transform to the desired mean and standard deviation:
      return z * stdev + mean;
    }

    function saveTrainingData(decision, comparison, rewardReceived, timeStamps) {
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
              comparison: comparison[index],
              timestamp: timeStamps[index]
          };
      });

      // Convert the data object to a JSON string
      const dataJSON = JSON.stringify(data);

      // Store the JSON string in sessionStorage
      sessionStorage.setItem(round, dataJSON);
    }
});