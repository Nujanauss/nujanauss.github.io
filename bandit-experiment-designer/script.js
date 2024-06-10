import { getUrlParameter, getScoresSoFar, getComparersScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const gridContainer = document.getElementById('grid-container');
    const movesText = document.getElementById('moves');
    const scoreText = document.getElementById('score');
    const settingsCard = document.getElementById('settings-card');
    const comparisonCard = document.getElementById('comparison-card');

    const movesSlider = document.getElementById('moves-slider');
    const gridColSlider = document.getElementById('grid-col-slider');
    const gridRowSlider = document.getElementById('grid-row-slider');
    const toggleStochasticButton = document.getElementById('toggle-stochastic-button');
    const toggleBinaryButton = document.getElementById('toggle-binary-button');
    const toggleChartsButton = document.getElementById('toggle-charts-button');
    const toggleToolsButton = document.getElementById('toggle-tools-button');
    const decaySlider = document.getElementById('decay-slider');
    const decayCenterSlider = document.getElementById('decay-center-slider');
    const noiseStdDevSlider = document.getElementById('noise-std-dev-slider');

    const numberOfRoundsSlider = document.getElementById('number-rounds-slider');
    const includeComparisonButton = document.getElementById('toggle-comparison-button');
    const comparisonFrequencyRoundsSlider = document.getElementById('comparison-frequency-rounds-slider');
    const comparisonFrequencySlider = document.getElementById('comparison-frequency-slider');
    const comparisonOnNewPageButton = document.getElementById('toggle-comparison-page-button');
    const probUpwardComparisonSlider = document.getElementById('prob-upward-comparison-slider');
    const comparisonMeanSlider = document.getElementById('comparison-mean-slider');
    const comparisonStdDevSlider = document.getElementById('comparison-std-dev-slider');

    let movesSinceLastComparison = 0;
    let scoreSinceLastComparison = 0;
    const initialStochasticValue = 0.5;
    const initialPurpleValue = 0.;

    let moves = intTranslation(movesSlider.value); // Start with the initial value of the slider
    comparisonFrequencySlider.max = moves;
    let rows = intTranslation(gridRowSlider.value);
    let cols = intTranslation(gridColSlider.value);
    let decay = over1000Translation(decaySlider.value);
    let decayCenter = over1000Translation(decayCenterSlider.value);
    let noiseStdDev = over100Translation(noiseStdDevSlider.value);
    let showCharts = toggleChartsButton.checked;
    let showTools = toggleToolsButton.checked;
    let stochastic = toggleStochasticButton.checked;
    let stochasticValues = Array.from({ length: rows }, () => Array(cols).fill(stochastic));
    let purpleValues = Array.from({ length: rows }, () => Array(cols).fill(0.));
    let binary = toggleBinaryButton.checked;
    var meanValues = generateMeanValues();
    var chanceToWin = generateChanceToWin();
    var chanceToWinPurple = generateChanceToWinPurple();

    toggleToolsButton.disabled = !toggleChartsButton.checked;

    let numberOfRounds = intTranslation(numberOfRoundsSlider.value);
    comparisonFrequencyRoundsSlider.max = numberOfRounds;
    let includeComparison = includeComparisonButton.checked;
    let comparisonFrequencyRounds = intTranslation(comparisonFrequencyRoundsSlider.value);
    let comparisonFrequency = intTranslation(comparisonFrequencySlider.value);
    let comparisonOnNewPage = comparisonOnNewPageButton.checked;
    let probUpwardComparison = over100Translation(probUpwardComparisonSlider.value);
    let comparisonMean = over10Translation(comparisonMeanSlider.value);
    let comparisonStdDev = over10Translation(comparisonStdDevSlider.value);

    comparisonFrequencyRoundsSlider.disabled = !includeComparison;
    comparisonFrequencySlider.disabled = !includeComparison;
    comparisonOnNewPageButton.disabled = !includeComparison;
    probUpwardComparisonSlider.disabled = !includeComparison;
    comparisonMeanSlider.disabled = !includeComparison && binary;
    comparisonStdDevSlider.disabled = !includeComparison && binary;

    let score = 0, previousScore = 0, comparersScore = 0;
    setupGrid();
    var round = getRoundFromURL();

    movesText.innerHTML = 'Moves left: ' + moves;
    const scoresSoFar = getScoresSoFar();
    const comparersScoreSoFar = getComparersScoresSoFar();

    // Update slider values
    function handleSliderInput(slider, updateFunc, updateTheCharts, valueTranslation, textClass) {
        slider.addEventListener('input', function() {
            const translatedValue = valueTranslation(slider.value)
            document.querySelector(textClass).innerHTML = translatedValue;
            updateFunc(translatedValue);
            if (updateTheCharts) {
              meanValues = generateMeanValues();
              chanceToWin = generateChanceToWin();
              chanceToWinPurple = generateChanceToWinPurple();
              updateCharts();
            }
        });
        slider.addEventListener('mousedown', function(event) {
            event.stopPropagation();
        });
    }

    handleSliderInput(movesSlider, updateMoves, true, intTranslation, ".values-text");
    handleSliderInput(gridColSlider, updateCols, true, intTranslation, ".values-text");
    handleSliderInput(gridRowSlider, updateRows, true, intTranslation, ".values-text");
    handleSliderInput(decaySlider, updateDecay, true, over1000Translation, ".values-text");
    handleSliderInput(decayCenterSlider, updateDecayCenter, true, over1000Translation, ".values-text");
    handleSliderInput(noiseStdDevSlider, updateNoiseStdDev, true, over100Translation, ".values-text");

    handleSliderInput(numberOfRoundsSlider, updateNumberRounds, false, intTranslation, ".comparison-text");
    handleSliderInput(comparisonFrequencyRoundsSlider, updateFrequencyRounds, false, intTranslation, ".comparison-text");
    handleSliderInput(comparisonFrequencySlider, updateFrequency, false, intTranslation, ".comparison-text");
    handleSliderInput(probUpwardComparisonSlider, updateProbUpwardComparison, false, over100Translation, ".comparison-text");
    handleSliderInput(comparisonMeanSlider, updateComparisonMean, false, over10Translation, ".comparison-text");
    handleSliderInput(comparisonStdDevSlider, updateComparisonStdDev, false, over10Translation, ".comparison-text");

    function intTranslation(value) {
      return parseInt(value, 10);;
    }
    
    function over1000Translation(value) {
      return parseFloat(value) / 1000;
    }
    
    function over100Translation(value) {
      return parseFloat(value) / 100;
    }

    function over10Translation(value) {
      return parseFloat(value) / 10;
    }

    function updateMoves(value) {
      moves = intTranslation(value);
      comparisonFrequencySlider.max = moves;
      movesText.innerHTML = 'Moves left: ' + moves;
    }

    function updateCols(value) {
      cols = intTranslation(value);
      stochasticValues = Array.from({ length: rows }, () => Array(cols).fill(stochastic));
      purpleValues = Array.from({ length: rows }, () => Array(cols).fill(0.));
      updateCheckboxes();
      setupGrid();
    }

    function updateRows(value) {
      rows = intTranslation(value);
      stochasticValues = Array.from({ length: rows }, () => Array(cols).fill(stochastic));
      purpleValues = Array.from({ length: rows }, () => Array(cols).fill(0.));
      updateCheckboxes();
      setupGrid();
    }

    function updateCheckboxes() {
      const stochasticCheckboxes = document.querySelectorAll('.stochastic-checkbox');
      stochasticCheckboxes.forEach(checkbox => {
        checkbox.checked = stochastic;
      });
      const purpleCheckboxes = document.querySelectorAll('.purple-checkbox');
      purpleCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }

    function updateDecay(value) {
      decay = value;
    }

    function updateDecayCenter(value) {
      decayCenter = value;
    }

    function updateNoiseStdDev(value) {
      noiseStdDev = value;
    }

    function updateNumberRounds(value) {
      if (value <= comparisonFrequencyRoundsSlider) {
        return;
      }
      numberOfRounds = value;
      comparisonFrequencyRoundsSlider.max = numberOfRounds;
    }

    function updateFrequency(value) {
      if (value >= movesSlider.value) {
        return;
      }
      if (comparisonFrequency > 1) {
          document.getElementById("no-comparison-trials").innerHTML = comparisonFrequency;
          document.getElementById("is-trial-plural").innerHTML = "s";
        } else {
          document.getElementById("no-comparison-trials").innerHTML = "";
          document.getElementById("is-trial-plural").innerHTML = "";
      }
      comparisonFrequency = value;
    }

    function updateFrequencyRounds(value) {
      if (value >= numberOfRoundsSlider.value) {
        return;
      }
      numberOfRoundsSlider.min = value;
      comparisonFrequencyRounds = value;
    }

    function updateProbUpwardComparison(value) {
      probUpwardComparison = value;
    }

    function updateComparisonMean(value) {
      comparisonMean = value;
    }

    function updateComparisonStdDev(value) {
      comparisonStdDev = value;
    }

    toggleChartsButton.addEventListener('click', function() {
        showCharts = !showCharts;
        if (showCharts) {
          toggleToolsButton.disabled = false;
        } else {
          toggleToolsButton.disabled = true;
          if (showTools) {
            toggleToolsButton.checked = false;
            showTools = !showTools;
          }
        }
        updateCharts();
    });

    toggleToolsButton.addEventListener('click', function() {
        showTools = !showTools;
        updateCharts();
    });

    toggleBinaryButton.addEventListener('click', function() {
        binary = !binary;
        if (binary) {
          comparisonMeanSlider.disabled = true;
          comparisonStdDevSlider.disabled = true;
        } else {
          comparisonMeanSlider.disabled = false;
          comparisonStdDevSlider.disabled = false;
        }
        meanValues = generateMeanValues();
        chanceToWin = generateChanceToWin();
        updateCharts();
    });

    toggleStochasticButton.addEventListener('click', function() {
        stochastic = !stochastic;
        stochasticValues = Array.from({ length: rows }, () => Array(cols).fill(stochastic));
        updateCheckboxes();
        meanValues = generateMeanValues();
        chanceToWin = generateChanceToWin();
        updateCharts();
    });

    comparisonOnNewPageButton.addEventListener('click', function() {
        comparisonOnNewPage = !comparisonOnNewPage;
        if (comparisonOnNewPage) {
          comparisonFrequencySlider.disabled = true;
        } else {
          comparisonFrequencySlider.disabled = false;
        }
    });

    includeComparisonButton.addEventListener('click', function() {
        includeComparison = !includeComparison;
        if (includeComparison) {
          comparisonFrequencyRoundsSlider.disabled = false;
          comparisonFrequencySlider.disabled = false;
          comparisonOnNewPageButton.disabled = false;
          probUpwardComparisonSlider.disabled = false;
          movesSinceLastComparison = 0;
          if (!binary) {
            comparisonMeanSlider.disabled = false;
            comparisonStdDevSlider.disabled = false;
          }
        } else {
          comparisonFrequencyRoundsSlider.disabled = true;
          comparisonFrequencySlider.disabled = true;
          comparisonOnNewPageButton.disabled = true;
          probUpwardComparisonSlider.disabled = true;
          comparisonMeanSlider.disabled = true;
          comparisonStdDevSlider.disabled = true;
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
              comparersScore += additionalScore + getFromStor('greenSquareScore');
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
          if (!comparisonOnNewPage && (intTranslation(round) % comparisonFrequencyRounds == 0)) {
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
        if (includeComparison && comparisonOnNewPage && (intTranslation(round) % comparisonFrequencyRounds == 0)) {
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
        if (binary) {
            var randomVal = Math.random();
            if (randomVal < chanceToWin[moves][squareY][squareX]) { // CHANCE TO WIN IS HERE!
              if (randomVal < chanceToWinPurple[moves][squareY][squareX]) {
                additionalScore = getFromStor('purpleSquareScore');
                makePurple(square, additionalScore);
              } else {
                additionalScore = getFromStor('greenSquareScore');
                makeGreen(square, additionalScore);
              }
            }
        } else if (!binary) {
            if (randomVal < chanceToWinPurple[moves][squareY][squareX]) {
                additionalScore = getFromStor('purpleSquareScore');
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
        if ((score - previousScore) == getFromStor('greenSquareScore')) {
            newColor = '#228833';
            timeout = 500;
        } else if ((score - previousScore) == getFromStor('purpleSquareScore')) {
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

      addStochasticSlider(square, x, y);
      addPurpleSlider(square, x, y);
      addStochasticCheckbox(square, x, y);
      addPurpleCheckbox(square, x, y);

      square.addEventListener('click', function(event) {
          gameLogic(square);
      });

      return square;
    }

    function addStochasticSlider(square, x, y) {
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.classList.add('mean-slider');
      slider.min = 0;
      slider.max = 1000;
      slider.value = slider.max * initialStochasticValue;
      slider.addEventListener('mousedown', function(event) {
          event.stopPropagation();
      });
      slider.addEventListener('click', function(event) {
          event.stopPropagation();
      });
      slider.addEventListener('input', function(event) {
          var mean = parseFloat(event.target.value);
          meanValues[y][x] = mean / 1000;
          chanceToWin = generateChanceToWin();
          updateChart(x, y);
      });
      square.appendChild(slider);
    }

    function addPurpleSlider(square, x, y) {
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.classList.add('purple-slider');
      slider.id = `purple-${x},${y}`;
      slider.min = 0;
      slider.max = 1000;
      slider.value = slider.max * initialPurpleValue;
      slider.addEventListener('mousedown', function(event) {
          event.stopPropagation();
      });
      slider.addEventListener('click', function(event) {
          event.stopPropagation();
      });
      slider.addEventListener('input', function(event) {
          var mean = parseFloat(event.target.value);
          purpleValues[y][x] = mean / 1000;
          chanceToWinPurple = generateChanceToWinPurple();
          updateChart(x, y);
      });
      square.appendChild(slider);
    }

    function addStochasticCheckbox(square, x, y) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('stochastic-checkbox');
      checkbox.checked = stochasticValues[y][x];
      checkbox.addEventListener('change', function(event) {
          if (event.target.checked) {
              stochasticValues[y][x] = true;
          } else {
              stochasticValues[y][x] = false;
          }
          chanceToWin = generateChanceToWin();
          updateChart(x, y);
      });

      const checkboxContainer = document.createElement('div');
      checkboxContainer.classList.add('checkbox-container');
      checkboxContainer.appendChild(checkbox);
      square.appendChild(checkboxContainer);

      checkboxContainer.addEventListener('mousedown', function(event) {
          event.stopPropagation();
      });
      checkboxContainer.addEventListener('click', function(event) {
          event.stopPropagation();
      });
    }

    function addPurpleCheckbox(square, x, y) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('purple-checkbox');
      checkbox.checked = (purpleValues[y][x] > 0);
      checkbox.addEventListener('change', function(event) {
          if (event.target.checked) {
              purpleValues[y][x] = over1000Translation(square.querySelector('.purple-slider').value);
              document.getElementById(`purple-${x},${y}`).style.visibility = 'visible';
          } else {
              purpleValues[y][x] = 0.;
              document.getElementById(`purple-${x},${y}`).style.visibility = 'hidden';
          }
          chanceToWinPurple = generateChanceToWinPurple();
          updateChart(x, y);
      });

      const checkboxContainer = document.createElement('div');
      checkboxContainer.classList.add('purple-checkbox-container');
      checkboxContainer.appendChild(checkbox);
      square.appendChild(checkboxContainer);

      checkboxContainer.addEventListener('mousedown', function(event) {
          event.stopPropagation();
      });
      checkboxContainer.addEventListener('click', function(event) {
          event.stopPropagation();
      });
    }

    function createChart(square, x, y) {
      // Create SVG element
      const svg = d3.select(square)
          .append('svg')
          .attr('width', square.clientWidth)
          .attr('height', square.clientHeight);

      // Create data for the chart using chanceToWin values
      const data = chanceToWin.map((row, i) => ({ x: i + 1, y: row[y][x] }));
      const purpleData = chanceToWinPurple.map((row, i) => ({ x: i + 1, y: row[y][x] }));

      // Set the scales
      const xScale = d3.scaleLinear()
          .domain([0, moves])
          .range([0, square.clientWidth]);

      var yDomainMax = 1;
      const yScale = d3.scaleLinear()
          .domain([0, yDomainMax])
          .range([square.clientHeight, 0]);

      // Create the line generator
      const line = d3.line()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y));

      // Append the line path
      svg.append('path')
          .datum(data)
          .attr('z-index', -1)
          .attr('d', line)
          .attr('fill', 'none')
          .attr('stroke', '#1F449C')
          .attr('stroke-width', 1.5);

      svg.append('path')
          .datum(purpleData)
          .attr('z-index', -1)
          .attr('d', line)
          .attr('fill', 'none')
          .attr('stroke', '#AA3377')
          .attr('stroke-width', 1.5);
    }

    function updateCharts() {
      const squares = document.querySelectorAll('.square');
      squares.forEach(square => {
          // Remove existing SVG elements
          const existingSvg = square.querySelector('svg');
          if (existingSvg) {
              existingSvg.remove();
          }
          // Create charts if showCharts is true
          var stochasticSlider = square.querySelector('.mean-slider');
          var purpleSlider = square.querySelector('.purple-slider');
          var stochasticCheckbox = square.querySelector('.checkbox-container');
          var purpleCheckbox = square.querySelector('.purple-checkbox-container');
          if (showCharts) {
              const [x, y] = square.id.split(',').map(Number);
              createChart(square, x, y);
          }
          if (showTools) {
              stochasticSlider.style.visibility = 'visible';
                if (purpleCheckbox.childNodes[0].checked) {
                  purpleSlider.style.visibility = 'visible';
                }
              stochasticCheckbox.style.visibility = 'visible';
              purpleCheckbox.style.visibility = 'visible';
          } else {
              stochasticSlider.style.visibility = 'hidden';
              purpleSlider.style.visibility = 'hidden';
              stochasticCheckbox.style.visibility = 'hidden';
              purpleCheckbox.style.visibility = 'hidden';
          }
      });
    }

    function updateChart(column, row) {
      const squares = document.querySelectorAll('.square');
      squares.forEach(square => {
          const [x, y] = square.id.split(',').map(Number);
          if (x != column || y != row) {
            return;
          }
          // Remove existing SVG elements
          const existingSvg = square.querySelector('svg');
          if (existingSvg) {
              existingSvg.remove();
          }
          // Create charts if showCharts is true
          var stochasticSlider = square.querySelector('.mean-slider');
          var purpleSlider = square.querySelector('.purple-slider');
          var stochasticCheckbox = square.querySelector('.checkbox-container');
          var purpleCheckbox = square.querySelector('.purple-checkbox-container');
          if (showCharts) {
              createChart(square, x, y);
          }
          if (showTools) {
              stochasticSlider.style.visibility = 'visible';
                if (purpleCheckbox.childNodes[0].checked) {
                  purpleSlider.style.visibility = 'visible';
                }
              stochasticCheckbox.style.visibility = 'visible';
              purpleCheckbox.style.visibility = 'visible';
          } else {
              stochasticSlider.style.visibility = 'hidden';
              purpleSlider.style.visibility = 'hidden';
              stochasticCheckbox.style.visibility = 'hidden';
              purpleCheckbox.style.visibility = 'hidden';
          }
      });
    }

    function generateMeanValues() {
        const meanValues = Array.from({ length: rows }, () => Array(cols).fill(initialStochasticValue));

        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            const [x, y] = square.id.split(',').map(Number);
            var slider = square.querySelector('.mean-slider');
            var mean = over1000Translation(slider.value);
            meanValues[y][x] = mean;
        });

        return meanValues;
    }

    function generatePurpleValues() {
      const purpleValues = Array.from({ length: rows }, () => Array(cols).fill(initialPurpleValue));

        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            const [x, y] = square.id.split(',').map(Number);
            var slider = square.querySelector('.purple-slider');
            var mean = over1000Translation(slider.value);
            purpleValues[y][x] = mean;
        });

        return purpleValues;
    }

    function generateChanceToWinPurple() {
      return Array.from({ length: moves }, () => {
        return purpleValues.map(row => row.slice()); // deep copy
      });
    }

    function generateChanceToWin() {
      var noiseMagnitude = 0.1;
      var noise = 0;
      const chanceToWin = Array.from({ length: moves }, () => {
        return meanValues.map(row => row.slice()); // deep copy
      });
      const lamda = decay;
      const theta = decayCenter;
      for (let move = 1; move < chanceToWin.length; move++) {
          for (let row = 0; row < chanceToWin[move].length; row++) {
              for (let col = 0; col < chanceToWin[move][row].length; col++) {
                  const currentVal = chanceToWin[move-1][row][col];
                  if (stochasticValues[row][col]) {
                    noise = noiseMagnitude * gaussianRandom(0, noiseStdDev);
                    chanceToWin[move][row][col] = lamda * currentVal + (1 - lamda) * theta + noise;
                    continue;
                  }
                  chanceToWin[move][row][col] = currentVal;
              }
          }
      }
      return chanceToWin;
    }

    function gaussianRandom(mean=0, stdev=1) { //stackOverflow
      const u = 1 - Math.random(); // Converting [0,1) to (0,1]
      const v = Math.random();
      const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      // Transform to the desired mean and standard deviation:
      return z * stdev + mean;
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

    function getFromStor(varr) {
      return JSON.parse(sessionStorage.getItem(varr));
    }

    // Function to make a card draggable
    function makeDraggable(card, ignoreElements = []) {
      let isDragging = false;
      let offsetX, offsetY;

      card.addEventListener('mousedown', function(e) {
        if (!ignoreElements.includes(e.target)) { // Ensure the slider interaction doesn't trigger dragging
          isDragging = true;
          offsetX = e.clientX - card.getBoundingClientRect().left;
          offsetY = e.clientY - card.getBoundingClientRect().top;
          card.style.cursor = 'grabbing';
        }
      });

      document.addEventListener('mousemove', function(e) {
        if (isDragging) {
          card.style.left = e.clientX - offsetX + 'px';
          card.style.top = e.clientY - offsetY + 'px';
        }
      });

      document.addEventListener('mouseup', function() {
        isDragging = false;
        card.style.cursor = 'move';
      });
    }

    // Elements to ignore during drag
    const ignoreElements = [movesSlider, gridColSlider, gridRowSlider, toggleStochasticButton, toggleBinaryButton, toggleChartsButton, decaySlider, decayCenterSlider, noiseStdDevSlider, comparisonFrequencySlider];

    // Apply draggable functionality to both cards
    makeDraggable(settingsCard, ignoreElements);
    makeDraggable(comparisonCard, ignoreElements);

    document.getElementById("read-comparison").addEventListener('click', function() {
      overlay.style.display = 'none';
      document.getElementById("comparison-information").classList.add('gone');
      document.body.style.cursor = 'move';
    });

    function toggleCollapse(card) {
      const isCollapsed = card.classList.toggle('collapsed');
      const button = card.querySelector('.toggle-button');
      button.innerHTML = isCollapsed ? '+' : '-';
    }

    // Add event listeners to toggle buttons
    document.querySelectorAll('.toggle-button').forEach(button => {
      button.addEventListener('click', function() {
        toggleCollapse(button.closest('.card'));
      });
    });
});