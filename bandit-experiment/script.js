import { getUrlParameter, getScoresSoFar, getComparersScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const settings = getGameSettings();

    const gridContainer = document.getElementById('grid-container');
    const movesText = document.getElementById('moves');
    const scoreText = document.getElementById('score');

    let movesSinceLastComparison = 0;
    let scoreSinceLastComparison = 0;
    const initialStochasticValue = 0.5;
    const initialPurpleValue = 0.;

    var moves = settings.moves;

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
    const roundsUntilPurple = settings.roundsUntilPurple;
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
    setupGrid();
    var round = getRoundFromURL();

    movesText.innerHTML = 'Moves left: ' + moves;
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
        if (moves < 1) {
            return;
        }
        moves--;
        var additionalScore = revealSquare(square);
        score += additionalScore;

        if (includeComparison) {
          movesSinceLastComparison++;
          scoreSinceLastComparison += additionalScore;
          if (Math.random() < probUpwardComparison) { // upward comparison
            if (!binary) { 
              comparersScore += Math.round(Math.min(additionalScore + gaussianRandom(comparisonMean, comparisonStdDev), 100));
            } else if (additionalScore == 0) { // binary: player either scores 0 or greenSquare
              comparersScore += additionalScore + greenSquareScore;
            } else {
              comparersScore += additionalScore;
            }
          } else { // downward/lateral comparison
            if (!binary) {
              comparersScore += Math.round(Math.max(0, additionalScore - gaussianRandom(comparisonMean, comparisonStdDev)));
            }
          }
        }

        scoreText.innerHTML = 'Score: ' + score;
        movesText.innerHTML = 'Moves left: ' + moves;
        updateTextColor(scoreText, score, previousScore);

        previousScore = score;

        if (includeComparison && movesSinceLastComparison == comparisonFrequency) {
          if (!comparisonOnNewPage && (round % comparisonFrequencyRounds == 0)) {
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
        }
        if (moves < 1) {
          endTrialLogic(scoresSoFar, comparersScoreSoFar);
        }
    }

    function endTrialLogic(scoresSoFar, comparersScoreSoFar) {
      document.getElementById("trialOver").classList.remove("gone");
      document.getElementById("trialOverBut").classList.remove("gone");
      scoresSoFar.push(score);
      comparersScoreSoFar.push(comparersScore);
      if (round < numberOfRounds) {
        if (includeComparison && comparisonOnNewPage && (round % comparisonFrequencyRounds == 0)) {
          document.getElementById('trialOverBut').addEventListener('click', function() {
            window.location.href = constructURLWithScores("standings.html", scoresSoFar, comparersScoreSoFar);
          });
        } else {
          document.getElementById('trialOverBut').addEventListener('click', function() {
            window.location.href = constructURLWithScores("intermediary.html", scoresSoFar, comparersScoreSoFar);
          });
        }
      } else {
        document.getElementById('trialOverBut').addEventListener('click', function() {
          window.location.href = constructURLWithScores("thanks.html", scoresSoFar, comparersScoreSoFar);
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
        if (binary) {
            if (randomVal < chanceToWin[moves][squareY][squareX]) { // CHANCE TO WIN IS HERE!
              if (round >= roundsUntilPurple && randomVal < chanceToWinPurple[moves][squareY][squareX]) {
                additionalScore = purpleSquareScore;
                makePurple(square, additionalScore);
              } else {
                additionalScore = greenSquareScore;
                makeGreen(square, additionalScore);
              }
            }
        } else {
            if (round >= roundsUntilPurple && randomVal < chanceToWinPurple[moves][squareY][squareX]) {
                additionalScore = purpleSquareScore;
                makePurple(square, additionalScore);
            } else {
              additionalScore = Math.round(chanceToWin[moves][squareY][squareX] * 100);
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

    function getGameSettings() {
        const settings = sessionStorage.getItem('gameSettings');
        return settings ? JSON.parse(settings) : {};
    }

    function gaussianRandom(mean=0, stdev=1) { //stackOverflow
      const u = 1 - Math.random(); // Converting [0,1) to (0,1]
      const v = Math.random();
      const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      // Transform to the desired mean and standard deviation:
      return z * stdev + mean;
    }
});