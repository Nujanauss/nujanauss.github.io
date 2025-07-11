import { getUrlParameter, getScoresSoFar, getComparersScoresSoFar } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    const colorPalette = ['#1F449C', '#AA3377', '#2E8B57', '#FF6347', '#6A5ACD', '#FFA500', '#8A2BE2', '#008080', '#FFD700', '#CD5C5C'];

    const gridContainer = document.getElementById('grid-container');
    const settingsCard = document.getElementById('settings-card');
    const comparisonCard = document.getElementById('comparison-card');
    const experimentCard = document.getElementById('experiment-card');

    const numberOfRoundsSlider = document.getElementById('number-rounds-slider');
    const movesSlider = document.getElementById('moves-slider');
    const gridColSlider = document.getElementById('grid-col-slider');
    const gridRowSlider = document.getElementById('grid-row-slider');
    const toggleNewSampleButton = document.getElementById('toggle-new-sample');

    const toggleChartsButton = document.getElementById('toggle-charts-button');
    const toggleToolsButton = document.getElementById('toggle-tools-button');
    const toggleBinaryButton = document.getElementById('toggle-binary-button');
    const toggleStochasticButton = document.getElementById('toggle-stochastic-button');
    const stdDevSlider = document.getElementById('std-dev-slider');
    const decaySlider = document.getElementById('decay-slider');
    const recurranceSlider = document.getElementById('precurrance-slider');
    const rewardsChangeAcrossRoundsButton = document.getElementById('toggle-continuous-reward');

    let movesSinceLastComparison = 0;
    let scoreSinceLastComparison = 0;
    const initialStochasticValue = 0.5;

    let movesRemaining = intTranslation(movesSlider.value); // Start with the initial value of the slider
    let numberOfMoves = intTranslation(movesSlider.value); // Start with the initial value of the slider
    let rows = intTranslation(gridRowSlider.value);
    let cols = intTranslation(gridColSlider.value);
    let stdDev = over1000Translation(stdDevSlider.value);
    let decay = over1000Translation(decaySlider.value);
    let recurranceProb = over100Translation(recurranceSlider.value);
    let showCharts = toggleChartsButton.checked;

    let showTools = toggleToolsButton.checked;
    let stochastic = toggleStochasticButton.checked;
    let stochasticValues = Array.from({ length: rows }, () => Array(cols).fill(stochastic));
    let binary = toggleBinaryButton.checked;
    let rewardsChangeAcrossRounds = rewardsChangeAcrossRoundsButton.checked;
    var meanValues = generateMeanValues();
    var chanceToWin = generateChanceToWin();

    let numberOfRounds = intTranslation(numberOfRoundsSlider.value);

    toggleToolsButton.disabled = !toggleChartsButton.checked;
    rewardsChangeAcrossRoundsButton.disabled = numberOfRounds < 2;

    let score = 0, previousScore = 0, comparersScore = 0;
    setupGrid();
    var round = getRoundFromURL();

    // Update slider values
    function handleSliderInput(slider, updateFunc, updateTheCharts, valueTranslation, textClass) {
        slider.addEventListener('input', function() {
            const translatedValue = valueTranslation(slider.value)
            document.querySelector(textClass).innerHTML = translatedValue;
            updateFunc(translatedValue);
            if (updateTheCharts) {
              chanceToWin = generateChanceToWin();
              updateCharts();
            }
        });
        slider.addEventListener('mousedown', function(event) {
            event.stopPropagation();
        });
    }

    handleSliderInput(movesSlider, updateMoves, true, intTranslation, ".experiment-text");
    handleSliderInput(gridColSlider, updateCols, true, intTranslation, ".experiment-text");
    handleSliderInput(gridRowSlider, updateRows, true, intTranslation, ".experiment-text");
    handleSliderInput(numberOfRoundsSlider, updateNumberRounds, false, intTranslation, ".experiment-text");

    handleSliderInput(stdDevSlider, updateStdDev, true, over1000Translation, ".values-text");
    handleSliderInput(decaySlider, updateDecay, true, over1000Translation, ".values-text");
    handleSliderInput(recurranceSlider, updateRecurrance, true, over100Translation, ".values-text");

    function intTranslation(value) {
      return parseInt(value, 10);
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
      movesRemaining = intTranslation(value);
      numberOfMoves = intTranslation(value);
      chanceToWin = generateChanceToWin();
    }

    function updateCols(value) {
      cols = intTranslation(value);
      stochasticValues = Array.from({ length: rows }, () => Array(cols).fill(stochastic));
      updateCheckboxes();
      setupGrid();
    }

    function updateRows(value) {
      rows = intTranslation(value);
      stochasticValues = Array.from({ length: rows }, () => Array(cols).fill(stochastic));
      updateCheckboxes();
      setupGrid();
    }

    function updateCheckboxes() {
      const stochasticCheckboxes = document.querySelectorAll('.stochastic-checkbox');
      stochasticCheckboxes.forEach(checkbox => {
        checkbox.checked = stochastic;
      });
    }

    function updateDecay(value) {
      decay = value;
    }

    function updateStdDev(value) {
      stdDev = value;
    }

    function updateRecurrance(value) {
      recurranceProb = value;
    }

    function updateNumberRounds(value) {
      numberOfRounds = value;
      if (numberOfRounds < 2) {
        rewardsChangeAcrossRoundsButton.disabled = true;
        rewardsChangeAcrossRounds = false;
        rewardsChangeAcrossRoundsButton.checked = false;
        chanceToWin = generateChanceToWin();
        updateCharts();
      } else {
        rewardsChangeAcrossRoundsButton.disabled = false;
        if (rewardsChangeAcrossRounds) {
          chanceToWin = generateChanceToWin();
          updateCharts();
          addLinesOrNotToComposite();
        }
      }
    }

    toggleNewSampleButton.addEventListener('click', function() {
      setTimeout(function() {
        toggleNewSampleButton.checked = false;
      }, 200);
      chanceToWin = generateChanceToWin();
      updateCharts();
    });

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
        chanceToWin = generateChanceToWin();
        updateCharts();
    });

    toggleStochasticButton.addEventListener('click', function() {
        stochastic = !stochastic;
        stochasticValues = Array.from({ length: rows }, () => Array(cols).fill(stochastic));
        updateCheckboxes();
        chanceToWin = generateChanceToWin();
        updateCharts();
    });

    rewardsChangeAcrossRoundsButton.addEventListener('click', function() {
        rewardsChangeAcrossRounds = !rewardsChangeAcrossRounds;
        chanceToWin = generateChanceToWin();
        updateCharts();
        addLinesOrNotToComposite();
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
      addStochasticCheckbox(square, x, y);

      square.addEventListener('click', function(event) {
          gameLogic(square);
      });

      return square;
    }

    function addStochasticSlider(square, x, y) {
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.classList.add('mean-slider');
      slider.min = 1;
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
          meanValues[0][y][x] = mean / 1000;
          chanceToWin = generateChanceToWinForXY(x, y);
          updateCompositeChart(x, y);
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
          updateCharts();
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

    function createChart(square, x, y) {
      // Create SVG element
      const svg = d3.select(square)
          .append('svg')
          .attr('width', square.clientWidth)
          .attr('height', square.clientHeight);

      // Create data for the chart using chanceToWin values
      const data = chanceToWin.map((row, i) => ({ x: i + 1, y: row[y][x] }));

      // Set the scales
      const xScale = d3.scaleLinear()
          .domain([1, data.length])
          .range([0, square.clientWidth]);

      const yScale = d3.scaleLinear()
          .domain([0, 1])
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

      // Draw dashed vertical lines for each round
      if (rewardsChangeAcrossRounds) {
        for (let i = 1; i < numberOfRounds; i++) {
            const xPosition = (i / numberOfRounds) * square.clientWidth;
            svg.append('line')
                .attr('x1', xPosition)
                .attr('y1', 0)
                .attr('x2', xPosition)
                .attr('y2', square.clientHeight)
                .attr('stroke', '#1F449C')
                .attr('stroke-opacity', 0.5)
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '5,5');
        }
      }
      addCurveToCompositeChart(data, colorPalette[x], x, y);
    }

    function updateCharts() {
      resetCompositeChart();
      const squares = document.querySelectorAll('.square');
      squares.forEach(square => {
          // Remove existing SVG elements
          const existingSvg = square.querySelector('svg');
          if (existingSvg) {
              existingSvg.remove();
          }
          // Create charts if showCharts is true
          var stochasticSlider = square.querySelector('.mean-slider');
          var stochasticCheckbox = square.querySelector('.checkbox-container');
          if (showCharts) {
              const [x, y] = square.id.split(',').map(Number);
              createChart(square, x, y);
          }
          if (showTools) {
              stochasticSlider.style.visibility = 'visible';
              stochasticCheckbox.style.visibility = 'visible';
          } else {
              stochasticSlider.style.visibility = 'hidden';
              stochasticCheckbox.style.visibility = 'hidden';
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
          var stochasticCheckbox = square.querySelector('.checkbox-container');
          if (showCharts) {
              createChart(square, x, y);
          }
          if (showTools) {
              stochasticSlider.style.visibility = 'visible';
              stochasticCheckbox.style.visibility = 'visible';
          } else {
              stochasticSlider.style.visibility = 'hidden';
              stochasticCheckbox.style.visibility = 'hidden';
          }
      });
    }

    function generateMeanValues() {
      const totalMoves = rewardsChangeAcrossRounds ? movesSlider.value * numberOfRounds : movesSlider.value;
      const meanValues = Array.from({ length: totalMoves }, () => Array.from({ length: rows }, () => Array(cols).fill(initialStochasticValue)));
      const squares = document.querySelectorAll('.square');
      squares.forEach(square => {
          const [x, y] = square.id.split(',').map(Number);
          var slider = square.querySelector('.mean-slider');
          var mean = over1000Translation(slider.value);
          meanValues[0][y][x] = mean;
      });

      return meanValues;
    }
    
    function updateMeanValuesForXY(x, y, meanValues) {
      const updateMeanValues = [...meanValues]; // Shallow copy to avoid mutating original meanValues array
      const square = document.querySelector(`.square[id='${x},${y}']`);
      var slider = square.querySelector('.mean-slider');
      var mean = over1000Translation(slider.value);
      updateMeanValues.forEach(move => move[y][x] = mean);
      return updateMeanValues;
    }

    function generateChanceToWin() {
      meanValues = generateMeanValues();
      const totalMoves = rewardsChangeAcrossRounds ? movesSlider.value * numberOfRounds : movesSlider.value;
      const chanceToWin = meanValues; // deep copy
      const lamda = decay;
      for (let move = 1; move < chanceToWin.length; move++) {
          for (let row = 0; row < chanceToWin[move].length; row++) {
              for (let col = 0; col < chanceToWin[move][row].length; col++) {
                  const currentMean = meanValues[move-1][row][col];
                  if (stochasticValues[row][col]) {
                    var newMeanValue;
                    if (Math.random() < recurranceProb) {
                      newMeanValue = 0.8 - (Math.random() * 0.2);
                    } else {
                      newMeanValue = Math.min(1, Math.max(0.01, lamda * currentMean));
                    }
                    meanValues[move][row][col] = newMeanValue;
                    chanceToWin[move][row][col] = Math.min(1, Math.max(0.01, gaussianRandom(newMeanValue, stdDev)));
                    continue;
                  }
                  chanceToWin[move][row][col] = currentMean;
              }
          }
      }
      return chanceToWin;
    }

    function generateChanceToWinForXY(x, y) {
      meanValues = updateMeanValuesForXY(x, y, meanValues); // Update meanValues only for (x, y)
      const totalMoves = rewardsChangeAcrossRounds ? movesSlider.value * numberOfRounds : movesSlider.value;
      const lamda = decay;
      for (let move = 1; move < totalMoves; move++) {
          const currentMean = meanValues[move - 1][y][x];
          if (stochasticValues[y][x]) {
            var newMeanValue;
            if (Math.random() < recurranceProb) {
              newMeanValue = 0.8 - (Math.random() * 0.2);
            } else {
              newMeanValue = Math.min(1, Math.max(0.01, lamda * currentMean));
            }
              meanValues[move][y][x] = newMeanValue;
              chanceToWin[move][y][x] = Math.min(1, Math.max(0.01, gaussianRandom(newMeanValue, stdDev)));
          } else {
              chanceToWin[move][y][x] = currentMean;
          }
      }
      return chanceToWin;
    }

    function gaussianRandom(mean, stdev) { //stackOverflow
      const u = 1 - Math.random(); // Converting [0,1) to (0,1]
      const v = Math.random();
      const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      // Transform to the desired mean and standard deviation:
      return z * stdev + mean;
    }

    function poisson(k, landa) {
        var exponentialPower = Math.pow(2.718281828, -landa);
        var landaPowerK = Math.pow(landa, k);
        var numerator = exponentialPower * landaPowerK;
        var denominator = fact(k); // factorial of k.
        return (numerator / denominator);
    }

    function fact(x) {
       if(x==0) {
          return 1;
       }
       return x * fact(x-1);
    }

    function convertXY2Square(x, y) {
      return y * cols + x;
    }

    function convertXY2Square(x, y) {
      return gridSize * y + x;
    }

    /* DRAG */
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

    const ignoreElements = [movesSlider, gridColSlider, gridRowSlider, toggleStochasticButton, toggleBinaryButton, toggleChartsButton, decaySlider, recurranceSlider];

    makeDraggable(settingsCard, ignoreElements);
    makeDraggable(experimentCard, ignoreElements);

    /* COLLAPSE */
    function toggleCollapse(card) {
      const isCollapsed = card.classList.toggle('collapsed');
      const button = card.querySelector('.toggle-button');
      button.innerHTML = isCollapsed ? '+' : '-';
    }

    document.querySelectorAll('.toggle-button').forEach(button => {
      button.addEventListener('click', function() {
        toggleCollapse(button.closest('.card-body'));
      });
    });

    /* COMPOSITE CHART */
    const compositeChartHeight = 300;
    const compositeChartWidth = 300;

    function initializeCompositeChart() {
        const compositeSvg = d3.select('body')
            .append('svg')
            .attr('id', 'composite-chart')
            .attr('width', compositeChartWidth)
            .attr('height', compositeChartHeight)
            .style('position', 'absolute')
            .style('bottom', '10px')
            .style('right', '10px');

        // Create scales for the composite chart
        compositeSvg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, 290)');

        compositeSvg.append('g')
            .attr('class', 'y-axis')
            .attr('transform', 'translate(10, 0)');
    }

    initializeCompositeChart();

    function addCurveToCompositeChart(data, color, x, y) {
        const compositeSvg = d3.select('#composite-chart');

        // Set the scales
        const xScale = d3.scaleLinear()
            .domain([1, data.length])
            .range([10, 290]);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([290, 10]);

        // Create the line generator
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        // Append the line path
        compositeSvg.append('path')
            .datum(data)
            .attr('id', `${x}-${y}`)  // Unique ID based on x and y
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 1.5);
    }

    function resetCompositeChart() {
        // Select the composite chart SVG
        const compositeSvg = d3.select('#composite-chart');

        // Remove all paths (lines) inside the composite chart
        compositeSvg.selectAll('path').remove();
    }

    function updateCompositeChart(x, y) {
      // Select the specific path to remove based on x and y
      const compositeSvg = d3.select('#composite-chart');
      const pathId = `${x}-${y}`;
      const paths = d3.select('#composite-chart').selectAll('path');
      const pathToRemove = paths.filter(function() {
        return d3.select(this).attr('id') === pathId;
      });

      // Check if the path exists and then remove it
      if (!pathToRemove.empty()) {
        pathToRemove.remove();
      } else {
        console.warn(`Path with ID ${pathId} not found.`);
      }
    }

    function addLinesOrNotToComposite() {
      const compositeSvg = d3.select('#composite-chart');
      if (rewardsChangeAcrossRounds) {
        d3.select('#composite-chart').selectAll('line').remove();
        for (let i = 1; i < numberOfRounds; i++) {
            const xPosition = (i / numberOfRounds) * compositeChartWidth;
            compositeSvg.append('line')
                .attr('x1', xPosition)
                .attr('y1', 0)
                .attr('x2', xPosition)
                .attr('y2', compositeChartHeight)
                .attr('stroke', '#1F449C')
                .attr('stroke-opacity', 0.5)
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '5,5');
        }
      } else {
        d3.select('#composite-chart').selectAll('line').remove();
      }
    }


     /* SAVE */
    document.getElementById('save-settings').addEventListener('click', () => {
      const id = makeid(5);
      const settings = {
        vars: {
          id:             id,
          moves:          numberOfMoves,
          rows:           rows,
          cols:           cols,
          stdDev:         stdDev,
          decay:          decay,
          recurrance:     recurranceProb,
          numberOfRounds: numberOfRounds,
          chanceToWin:    chanceToWin
        }
      };
      saveJSON(settings, `settings_${id}.json`);
      const randomSim   = runSimulations('random');
      const oracleSim = runSimulations('oracle');
      saveJSON(randomSim, `randomSimulationResults_${id}.json`);
      saveJSON(oracleSim, `oracleSimulationResults_${id}.json`);
    });

  function runSimulations(agentType) {
    const simulationResults = [];
    for (let round = 0; round < numberOfRounds; round++) {
      const agent = getNewAgentFromType(agentType);
      let roundResult = [];
      for (let trial = 0; trial < numberOfMoves; trial++) {
        roundResult = runTrial(agent, trial, roundResult, round);
      }
      simulationResults.push({ [`round_${round+1}`]: roundResult });
    }
    return simulationResults;

    function runTrial(agent, trial, roundResult, round) {
      const decision = agent.nextDecision(trial);
      let reward = Math.round(chanceToWin[trial][0][decision] * 100);
      agent.update(decision, reward);
      agent.updatePreviousDecision(decision);
      roundResult.push({ trial, decision, reward });
      return roundResult;
    }

    function getNewAgentFromType(type) {
      if (type === 'oracle') return new Oracle(cols, 0.1);
      return new RandomAgent();
    }
  }

  // Agent Classes
  class Agent {
    constructor(numActions = cols) {
      this.numActions = numActions;
      this.previousDecision = -1;
    }
    updatePreviousDecision(previous) {
      this.previousDecision = previous;
    }
    nextDecision(trial) { return 1; }
    update() {}
  }

  class RandomAgent extends Agent {
    nextDecision(trial) {
      return Math.floor(Math.random() * this.numActions);
    }
  }

  class Oracle extends Agent {
    constructor(numActions = cols, flaw = 0.15) {
      super(numActions);
      this.flaw = flaw;
      this.N = Array(numActions).fill(0); // Number of times each arm has been pulled
    }

    nextDecision(trial) {
      const unpulled = [];
      for (let i = 0; i < this.numActions; i++) {
        if (this.N[i] === 0) unpulled.push(i);
      }

      if (unpulled.length > 0 && Math.random() < 0.9) {
        // With 90% probability, pick randomly among unpulled arms
        return unpulled[Math.floor(Math.random() * unpulled.length)];
      }

      if (Math.random() > this.flaw) {
        // Choose best arm using oracle, breaking ties randomly
        const trialData = chanceToWin[trial][0];
        const maxVal = Math.max(...trialData);
        const bestArms = [];
        for (let i = 0; i < trialData.length; i++) {
          if (trialData[i] === maxVal) bestArms.push(i);
        }
        return bestArms[Math.floor(Math.random() * bestArms.length)];
      } else {
        // Choose randomly based on uncertainty (inverse of how often arm has been used)
        const total = this.N.reduce((a, b) => a + b, 0) + 1e-6;
        const invProbs = this.N.map(n => 1 - n / total);
        const sum = invProbs.reduce((a, b) => a + b, 0);

        const normProbs = invProbs.map(p => p / sum);
        return weightedRandomChoice(normProbs);
      }
    }

    update(action, reward) {
      this.N[action] += 1;
    }
  }

  // Fairly choose an index based on given probability distribution
  function weightedRandomChoice(probabilities) {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < probabilities.length; i++) {
      acc += probabilities[i];
      if (r < acc) return i;
    }
    return probabilities.length - 1; // fallback (shouldn't normally happen)
  }

  function makeid(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  function saveJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.download = filename;
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});