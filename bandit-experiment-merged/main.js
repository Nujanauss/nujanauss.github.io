let currentPage;
var round = 1;
let scoresSoFar = [];
let comparersScoreSoFar = [];
let settings;

// Function to switch between pages and run specific scripts
function showPage(pageId) {
    currentPage = pageId;
    const pages = document.querySelectorAll('.w');
    pages.forEach(page => page.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    switch(pageId) {
        case 'INDEX':
            loadIndex();
            break;
        case 'PRECONSENT':
            loadPreconsent();
            break;
        case 'CONSENT':
            loadConsent();
            break;
        case 'DATA-PROTECTION':
            loadDataProtection();
            break;
        case 'INSTRUCTIONS1':
            loadInstructions1();
            break;
        case 'INSTRUCTIONS2':
            loadInstructions2();
            break;
        case 'INSTRUCTIONS3':
            loadInstructions3();
            break;
        case 'INSTRUCTIONS4':
            loadInstructions4();
            break;
        case 'TRAIN':
            loadTraining();
            break;
        case 'PREBEGIN1':
            loadPrebegin1();
            break;
        case 'PREBEGIN2':
            loadPrebegin2();
            break;
        case 'CHECK':
            loadCheck();
            break;
        case 'GAME':
            loadGame();
            break;
        case 'INTERMEDIARY':
            loadIntermediary();
            break;
        case 'STANDINGS':
            loadStandings();
            break;
        case 'THANKS':
            loadThanks();
            break;
        case 'FINAL':
            loadFinal();
            break;
        case 'RESCINDED':
            loadRescinded();
            break;
        case 'BEFORE':
            loadBefore();
            break;
        case 'NOPID':
            loadNoPid();
            break;
    }
}

// Initialize the first page
document.addEventListener('DOMContentLoaded', () => showPage('INDEX'));

async function loadIndex() {
    initializeFocusTracker();
    checkRefresh();

    const vars = await loadGameSettings();
    sessionStorage.setItem('gameSettings', JSON.stringify(vars));

    async function loadGameSettings() {
      const response = await fetch('settings.csv'); // Fetch CSV containing the list of filenames
      const csvText = await response.text();

      const jsonFiles = csvText.split(',').map(file => file.trim()).filter(file => file.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        throw new Error('No JSON settings files found');
      }

      while (jsonFiles.length > 0) { // Try to find file randomly or run out of options
        const randomIndex = Math.floor(Math.random() * jsonFiles.length);
        const selectedFile = jsonFiles[randomIndex];
        
        try {
          const settingsResponse = await fetch(selectedFile);
          if (settingsResponse.ok) {
            const settingsData = await settingsResponse.json();
            settingsData.vars.id = selectedFile;
            return settingsData.vars;
          } else {
            jsonFiles.splice(randomIndex, 1); // If file doesn't exist, remove it
          }
        } catch (error) {
          jsonFiles.splice(randomIndex, 1);
        }
      }
      throw new Error('No valid JSON settings files found');
    }

    buttonToNewPage('first-next', 'PRECONSENT');
}

function loadPreconsent() {
    document.getElementById('second-next').addEventListener('click', function() {
      // Try to enter fullscreen mode
      const enterFullscreen = () => {
        const element = document.documentElement; // Make the whole document go fullscreen
        if (element.requestFullscreen) {
          element.requestFullscreen().catch(err => {
            console.error(`Fullscreen request failed: ${err}`);
          });
        } else if (element.mozRequestFullScreen) { // Firefox
          element.mozRequestFullScreen().catch(err => {
            console.error(`Fullscreen request failed: ${err}`);
          });
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
          element.webkitRequestFullscreen().catch(err => {
            console.error(`Fullscreen request failed: ${err}`);
          });
        } else if (element.msRequestFullscreen) { // IE/Edge
          element.msRequestFullscreen().catch(err => {
            console.error(`Fullscreen request failed: ${err}`);
          });
        } else {
          console.log('Fullscreen API is not supported.');
        }
      };

      enterFullscreen(); // Attempt to enter fullscreen mode
      
      // Continue with the rest of the code regardless of fullscreen success
      addToInstructionTimings('second-next', new Date().toISOString().split('T')[1]);
      showPage('CONSENT');
    });
}

function loadConsent() {
    document.addEventListener('DOMContentLoaded', async function() {
      document.getElementById('consent-given').addEventListener('click', function() {
        window.location.href = 'data-protection';
      });
      document.getElementById('consent-rescinded').addEventListener('click', function() {
        window.location.href = 'consent-rescinded';
      });
    });
    buttonToNewPage('consent-given', 'DATA-PROTECTION');
    buttonToNewPage('consent-rescinded', 'RESCINDED');
}

function loadDataProtection() {
    const submitButton = document.getElementById('submit-button');
    submitButton.style.cursor = 'not-allowed';
    const checkboxes = document.querySelectorAll('.consent-checkboxes input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.style.cursor = 'pointer';
        checkbox.addEventListener('change', () => {
            if (Array.from(checkboxes).every(cb => cb.checked)) {
                submitButton.classList.remove('disabled');
                submitButton.classList.add('enabled');
                submitButton.disabled = false;
                submitButton.style.cursor = 'pointer';
            } else {
                submitButton.classList.remove('enabled');
                submitButton.classList.add('disabled');
                submitButton.disabled = true;
                submitButton.style.cursor = 'not-allowed';
            }
        });
    });
    buttonToNewPage('submit-button', 'INSTRUCTIONS1');
    buttonToNewPage('data-consent-rescinded', 'RESCINDED');
}

function loadInstructions1() {
    let prolificID = get_prolific_id();
    create_participant(prolificID).then(id => {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        showPage('BEFORE');
        return;
      }
      var playerData = {
        "player": {
            "prolificID": id,
        }
      };
      sessionStorage.setItem('playerData', JSON.stringify(playerData));
    }).catch(error => {
      showPage('BEFORE');
    });

    settings = getGameSettings();
    if (settings.binary == false) {
        document.getElementById('binary-dependent').innerHTML = 'will';
    }
    buttonToNewPage('nextButton1', 'INSTRUCTIONS2');
}


function loadInstructions2() {
    var para1 = document.getElementById('one');
    var para2 = document.querySelector('#two .blue-coloured');
    var para3 = document.getElementById('three');

    if (settings.numberOfRounds < 2) {
      para1.innerHTML = 'You will have a set number of trials to make. Once you run out of trials, the experiment is over.';
      if (settings.stochastic == true) {
        if (settings.binary == false) {
          para2.innerHTML = 'After every trial, each card will change how much it rewards you.';
        } else {
          para2.innerHTML = 'After every trial, the chance that a card will reward you will change.';
        }
      } else {
        if (settings.binary == false) {
          para2.innerHTML = 'Each card will provide a fixed reward, which is the same every trial.';
        } else {
          para2.innerHTML = 'Each card has a fixed chance of rewarding you. And this chance is the same in every trial.';
        }
      }
    } else {
      para1.innerHTML = 'You will have ' + settings.numberOfRounds + ' rounds to maximise your score. In each round, you will have ' + settings.moves + ' trials. Once you run out of trials, the round is over.';
      if (settings.stochastic == true) {
        if (settings.binary == false) {
          if (settings.rewardsChangeAcrossRounds == false) {
            para2.innerHTML = 'After every trial, each card will change how much it rewards you. However, these changes are the same in every round.';
          } else {
            para2.innerHTML = 'After every trial, each card will change how much it rewards you.';
          }
        } else {
          para2.innerHTML = 'After every trial, the chance that a card will reward you will change.';
        }
      } else {
        if (settings.binary == false) {
          para2.innerHTML = 'Each card will provide a fixed reward, which is the same in every round.';
        } else {
          para2.innerHTML = 'Each card has a fixed chance of rewarding you. And this chance is the same in every round.';
        }
      }
    }
    buttonToNewPage('backButton2', 'INSTRUCTIONS1');
    buttonToNewPage('nextButton2', 'INSTRUCTIONS3');
}


function loadInstructions3() {
    buttonToNewPage('backButton3', 'INSTRUCTIONS2');
    buttonToNewPage('nextButton3', 'INSTRUCTIONS4');
}


function loadInstructions4() {
    buttonToNewPage('backButton4', 'INSTRUCTIONS3');
    buttonToNewPage('trainingButton', 'TRAIN');
}

async function loadTraining() {
    let isClickable = true;

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

    const gridContainer = document.getElementById('grid-container-training');
    const movesText = document.getElementById('moves-training');

    const initialStochasticValue = 0.5;
    const initialPurpleValue = 0.;
    const trainingRound = 1;
    var currentMove = 0;

    const numberOfMoves = 8;
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

    function gameLogic(square) {
        if (currentMove > 7) {
            return;
        }
        revealSquare(square);

        decision[currentMove] = square;
        timeStamps[currentMove] = new Date().toISOString().split('T')[1];

        currentMove = currentMove + 1;

        movesText.innerHTML = 'Trials left: ' + (numberOfMoves - currentMove);

        if (currentMove > 7) {
          endTrialLogic(successScore, decision, rewardReceived, timeStamps);
        }
    }

    function endTrialLogic(successScore, decision, rewardReceived, timeStamps) {
      saveTrainingData(decision, rewardReceived, timeStamps);
      document.getElementById('trainingOverBut').classList.remove('gone');
      document.getElementById('trainingOver').innerHTML = 'Nice! You selected ' + numberOfMoves + ' cards.';
      buttonToNewPage('trainingOverBut', 'PREBEGIN1');
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
              if (trainingRound >= roundsUntilPurple && randomVal < chanceToWinPurple[currentMove][squareY][squareX]) {
                additionalScore = purpleSquareScore;
                makePurple(square, additionalScore);
              } else {
                additionalScore = greenSquareScore;
                makeGreen(square, additionalScore);
              }
            }
        } else {
            if (trainingRound >= roundsUntilPurple && randomVal < chanceToWinPurple[currentMove][squareY][squareX]) {
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
        text.innerHTML = '0';
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
        text.innerHTML = '';
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
          if (isClickable) {
              isClickable = false;
              gameLogic(square);
              setTimeout(() => {
                  isClickable = true;
              }, 500); // 500 ms debounce time
          }
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
}

function loadPrebegin1() {
    if (!settings.binary) {
      if (settings.stochastic) {
        document.getElementById('real-thing').innerHTML = 'Now let\'s move onto the real thing. This time there will be some reward associated with every card. However, this reward may change every trial.';
      } else {
        document.getElementById('real-thing').innerHTML = 'Now let\'s move onto the real thing. This time there will be some reward associated with every card.';
      }
    } else {
      document.getElementById('real-thing').innerHTML = 'Now let\'s move onto the real thing. This time there is some chance that each card will reward you after you select it.';
    }

    const prebegin1Butt = document.getElementById('prebegin1');
    prebegin1Butt.addEventListener('click', generateUsername);
    prebegin1Butt.disabled = false;

    let pressedOnce = false;
    let debounceTimeout;

    function generateUsername() {
        if (prebegin1Butt.disabled) {
            return;
        }

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        prebegin1Butt.disabled = true;
        prebegin1Butt.classList.remove('enabled');
        prebegin1Butt.style.cursor = 'not-allowed';
        prebegin1Butt.style.color = 'grey';
        debounceTimeout = setTimeout(() => {
            if (!pressedOnce) {
                pressedOnce = true;
                setTimeout(() => {
                    document.getElementById('username-generation').style.visibility = 'visible';
                }, 700);

                setTimeout(() => {
                    prebegin1Butt.disabled = false;
                    prebegin1Butt.innerHTML = 'Next';
                    prebegin1Butt.classList.add('enabled');
                    prebegin1Butt.style.color = 'black';
                    prebegin1Butt.style.cursor = 'pointer';
                }, 3000);
            } else {

                showPage('PREBEGIN2');
            }
        }, 700);
    }
}

function loadPrebegin2() {
    const prebegin2Butt = document.getElementById('prebegin2');
    prebegin2Butt.addEventListener('click', generateCopmarisonTarget);

    if (!settings.includeComparison) {
      Array.from(document.getElementsByClassName('hide-on-comparison')).forEach(element => element.style.display = 'none');
      prebegin2Butt.innerHTML = 'Quick check';
      document.getElementById('play-command').style.visibility = 'visible';
      document.getElementById('comparison-text').style.display = 'none';
    } else {
      if (!settings.comparisonOnNewPage) {
        if (settings.comparisonFrequency < 2) {
          document.getElementById('comparison-text').innerHTML = 'After every trial, we will show you the score of another player who previously played with exactly the same cards as you.';
          if (settings.comparisonFrequencyRounds > 1) {
            document.getElementById('comparison-text').innerHTML = 'After every trial, we will show you the score of another player who previously played with exactly the same cards as you. This may not happen immediately.';
          }
        } else {
          document.getElementById('comparison-text').innerHTML = 'Every ' + settings.comparisonFrequency + ' trials, we will show you the average score of another player who previously played with exactly the same cards as you.';
          if (settings.comparisonFrequencyRounds > 1) {
            document.getElementById('comparison-text').innerHTML = 'Every ' + settings.comparisonFrequency + ' trials, we will show you the average score of another player who previously played with exactly the same cards as you. This may not happen immediately.';
          }
        }
      } else {
        if (settings.numberOfRounds > 1) {
          if (settings.numberOfRounds / settings.comparisonFrequencyRounds > 2.1) {
            if (settings.comparisonFrequencyRounds == 1) {
            document.getElementById('comparison-text').innerHTML = 'You will play ' + settings.numberOfRounds + ' rounds in total. After every round, we will show you the average score of another player who previously played with exactly the same cards as you.'
            } else {
              document.getElementById('comparison-text').innerHTML = 'You will play ' + settings.numberOfRounds + ' rounds in total. After every ' + settings.comparisonFrequencyRounds + ' rounds, we will show you the average score of another player who previously played with exactly the same cards as you.'
            }
          } else {
            if (settings.comparisonFrequencyRounds == 1) {
              document.getElementById('comparison-text').innerHTML = 'You will play ' + settings.numberOfRounds + ' rounds in total. After the first round, we will show you the average score of another player who previously played with exactly the same cards as you.'
            } else {
              document.getElementById('comparison-text').innerHTML = 'You will play ' + settings.numberOfRounds + ' rounds in total. After round ' + settings.comparisonFrequencyRounds + ', we will show you the average score of another player who previously played with exactly the same cards as you.'
            }
            
          }
        }
      }
    }

    var pressedOnce = false;
    function generateCopmarisonTarget() {
      if (!settings.includeComparison) {
        showPage('CHECK');
        return;
      }
      if (prebegin2Butt.disabled) {
        return;
      }
      if (!pressedOnce) {
        document.querySelector('.loader').style.display = 'block';

        pressedOnce = true;
        prebegin2Butt.disabled = true;
        prebegin2Butt.classList.remove('enabled');
        prebegin2Butt.style.cursor = 'not-allowed';
        prebegin2Butt.style.color = 'grey';
        setTimeout(() => {
          document.getElementById('comparer').style.visibility = 'visible';
          document.getElementById('comparer-name').innerHTML = 'n3ssiori';
          document.querySelector('.loader').style.display = 'none';
          var clock = document.getElementById('clock');
          var startTime = new Date();
          startTime.setHours(startTime.getHours() - 3);
          startTime.setMinutes(startTime.getMinutes() - 14);
          startTime.setSeconds(startTime.getSeconds() - 12); // Set start time to 3 hours, 14 minutes, and 12 seconds ago
          function updateClock() {
            var currentTime = new Date();
            
            var elapsedTime = currentTime - startTime; // Get the elapsed time in milliseconds
            var seconds = Math.floor(elapsedTime / 1000); // Convert milliseconds to seconds
            
            var hours = Math.floor(seconds / 3600); // Calculate hours
            seconds %= 3600;
            var minutes = Math.floor(seconds / 60); // Calculate minutes
            seconds %= 60; // Calculate remaining seconds
            
            clock.textContent = hours + ':' + minutes.toString().padStart(2, '0') + '.' + seconds.toString().padStart(2, '0');
          }
          setInterval(updateClock, 10); // Update the clock every 10 milliseconds
        }, 6530);
        
        setTimeout(() => {
          document.getElementById('play-command').style.visibility = 'visible';
          prebegin2Butt.disabled = false;
          prebegin2Butt.innerHTML = 'Quick check';
          prebegin2Butt.classList.add('enabled');
          prebegin2Butt.style.color = 'black';
          prebegin2Butt.style.cursor = 'pointer';
        }, 8000);
      } else {
        showPage('CHECK');
      }
    }
}

function loadCheck() {
    const submitButton = document.getElementById('check-next');
    let correctAnswers;
    if (settings.includeComparison) {
      correctAnswers = [
        { question: "1", answer: !settings.binary },
        { question: "2", answer: !settings.binary },
        { question: "3", answer: false },
        { question: "3a", answer: false },
        { question: "4", answer: true }
      ];
    } else {
      document.getElementById('final-check').style.display = 'none';
      correctAnswers = [
        { question: "1", answer: !settings.binary },
        { question: "2", answer: !settings.binary },
        { question: "3", answer: false },
        { question: "3a", answer: false }
      ];
    }

    let answers = [];
    let checkedAnswerLog = [];
    let questions = document.querySelectorAll('.check');
    questions.forEach(question => {
        let qID = question.querySelector('.question').id;
        question.querySelectorAll('input[type="radio"]').forEach(answer => {
          answer.addEventListener('change', () => {
            document.getElementById('error-msg').style.visibility = 'hidden';
            question.querySelector('.question').style.color = '#333';
            if (answer.checked) {
              answers.push({
                question: qID,
                answer: answer.value === 'true' ? true : false,
                timestamp: new Date().toISOString().split('T')[1]
              });
            }
            if (new Set(answers.map(item => item.question)).size > correctAnswers.length - 1) { // if we have enough answers, release Check button
                submitButton.classList.remove('disabled');
                submitButton.classList.add('enabled');
                submitButton.disabled = false;
                submitButton.style.cursor = 'pointer';
            }
          });
        });
    });

    if (new Set(answers.map(item => item.question)).size < correctAnswers.length) { // else cannot Check until all answers complete
      submitButton.classList.add('disabled');
      submitButton.disabled = true;
      submitButton.style.cursor = 'not-allowed';
    }

    submitButton.addEventListener('click', () => {
      let questionsChecked = [];
      checkedAnswerLog.push({timestamp: new Date().toISOString().split('T')[1]});
      for (let i = answers.length - 1; i >= 0; i--) { // work backwards because of updating answers
        let userAnswer = answers[i];
        if (questionsChecked.includes(userAnswer.question)) {
          continue;
        }
        questionsChecked.push(userAnswer.question);
        let correctAnswer = correctAnswers.find(answer => answer.question === userAnswer.question);
        if (userAnswer.answer !== correctAnswer.answer) {
          let questionElement = document.getElementById(userAnswer.question);
          //let selectedRadio = questionElement.nextElementSibling.querySelector(`input[type="radio"][value="${userAnswer.answer.toString()}"]`);
          //selectedRadio.style.accentColor = '#b50000';
          questionElement.style.color = '#b50000';
          document.getElementById('error-msg').style.visibility = 'visible';
          return;
        }
      }
      let checkQuestions = {
        answers: answers,
        checkedAnswerLog: checkedAnswerLog
      };
      sessionStorage.setItem('checkQuestions', JSON.stringify(checkQuestions));
      document.getElementById('correct').classList.remove('gone');
      document.getElementById('final-check').style.marginBottom = '0px';
      submitButton.innerHTML = 'Play';
      buttonToNewPage('check-next', 'GAME');

      submitButton.classList.add('disabled');
      submitButton.disabled = true;
      submitButton.style.cursor = 'not-allowed';
      setTimeout(() => {
          submitButton.classList.remove('disabled');
          submitButton.classList.add('enabled');
          submitButton.disabled = false;
          submitButton.style.cursor = 'pointer';
      }, 2000);
    });
}

async function loadGame() {
    let isClickable = true;

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

    if (!includeComparison) {
      document.getElementById("comparer-score-container").classList.remove("score-container");
      document.getElementById("comparer-score-container").classList.add("gone");
    }

    let score = 0, previousScore = 0, comparersScore = 0;

    let decision = Array(numberOfMoves), rewardReceived = Array(numberOfMoves), comparison = Array(numberOfMoves), timeStamps = Array(numberOfMoves);
    setupGrid();

    initialise();

    function initialise() {
        document.getElementById("trialOver").classList.add("gone");
        document.getElementById("trialOverBut").classList.add("gone");
        scoreText.innerHTML = 'Score: ' + score;
        movesText.innerHTML = 'Trials left: ' + movesRemaining;
        const url = new URL(window.location.href);
        url.searchParams.set('round', round);
        history.replaceState(null, '', url);
    }

    function gameLogic(square) {
        if (movesRemaining < 1) {
            return;
        }
        movesRemaining--;
        var additionalScore = revealSquare(square);
        score += additionalScore;

        movesSinceLastComparison++;
        scoreSinceLastComparison += additionalScore;

        var comparersAdditionalScore = getComparersAdditional(additionalScore);
        comparersScore += comparersAdditionalScore;

        var idx = numberOfMoves - movesRemaining - 1; // rewrite this out to SOS
        decision[idx] = square;
        rewardReceived[idx] = additionalScore;
        comparison[idx] = comparersAdditionalScore;
        timeStamps[idx] = new Date().toISOString().split('T')[1];

        scoreText.innerHTML = 'Score: ' + score;
        movesText.innerHTML = 'Trials left: ' + movesRemaining;
        updateTextColor(scoreText, score, previousScore);

        previousScore = score;

        if (!comparisonOnNewPage && movesSinceLastComparison == comparisonFrequency) {
          setTimeout(() => {
            blockScreenForComparison();
          }, 400);
        }

        if (movesRemaining < 1) {
          endTrialLogic(scoresSoFar, comparersScoreSoFar);
        }
    }
    
    function blockScreenForComparison() {
      document.getElementById('no-comparison-trials').innerHTML = comparisonFrequency > 1 ? comparisonFrequency + ' trials,' : 'trial,';
      document.getElementById("player-score-since-last-comparison").innerHTML = scoreSinceLastComparison;
      document.getElementById("comparison-score-since-last-comparison").innerHTML = comparersScore;
      if (includeComparison && round % comparisonFrequencyRounds == 0) { // if it's not comparison round, then don't show anything
        document.getElementById("comparer-score-container").classList.add("score-container");
        document.getElementById("comparer-score-container").classList.remove("gone");
      } else { // else it's a comparison round
        document.getElementById("comparer-score-container").classList.remove("score-container");
        document.getElementById("comparer-score-container").classList.add("gone");
      }
      document.getElementById("comparison-information").classList.remove("gone");
      document.body.style.cursor = 'none !important';
      document.getElementById("overlay").style.display = 'block';

      setTimeout(() => {
        document.getElementById("read-comparison").style.visibility = 'visible';
        document.getElementById("comparison-information").addEventListener('click', function() {
          overlay.style.display = 'none';
          document.getElementById("comparison-information").classList.add('gone');
          document.body.style.cursor = 'default';
        });
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

      // Remove any existing event listeners
      let trialOverBut = document.getElementById('trialOverBut');
      let newElement = trialOverBut.cloneNode(true);
      trialOverBut.parentNode.replaceChild(newElement, trialOverBut);
      newElement.addEventListener('click', handleButtonClick);
      return;
    }

    function handleButtonClick() {
      if (includeComparison && comparisonOnNewPage && (round % comparisonFrequencyRounds == 0)) {
        showPage('STANDINGS');
      } else {
        showPage('INTERMEDIARY');
      }
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
      const flattenedCombinedArray = [ ...chanceToWin[currentMove].flat(2) ];
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
          if (isClickable) {
              isClickable = false;
              gameLogic(square);
              setTimeout(() => {
                  isClickable = true;
              }, 500); // 500 ms debounce time TIME BETWEEN CLICKS
          }
      });

      return square;
    }

    function convertXY2Square(x, y) {
      return y * cols + x;
    }

    function convertXY2Square(x, y) {
      return gridSize * y + x;
    }

    function constructURLWithScores(scoresSoFar, comparersScoreSoFar) {
      let baseURL = new URL(window.location.href.split('?')[0]);
      baseURL += '?round=' + round;
      scoresSoFar.forEach((score, index) => {
          baseURL += '&score' + (index + 1) + '=' + score;
      });
      comparersScoreSoFar.forEach((score, index) => {
          baseURL += '&n3ssiori' + (index + 1) + '=' + score;
      });
      history.replaceState(null, '', baseURL);
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
}

function loadIntermediary() {
    round++;
    const urlParams = new URLSearchParams(window.location.search);
    const finalRound = settings.numberOfRounds;
    urlParams.set('round', round); // Update the 'round' parameter with the new value
    const latestScore = scoresSoFar.at(-1);
    const scoreDiv = document.getElementById('scorer');
    if (scoreDiv) {
        scoreDiv.innerHTML = "You scored: " + latestScore;
    }
    if (round <= finalRound) {
        document.getElementById('rounder').innerHTML = "Next Round? Round " + round + " of " + finalRound;
        buttonToNewPage('rounder', 'GAME');
    } else {
        document.getElementById('rounder').innerHTML = "Complete participation";
        buttonToNewPage('rounder', 'THANKS');
    }
}


function loadStandings() {
    round++;
    const urlParams = new URLSearchParams(window.location.search);
    const finalRound = settings.numberOfRounds;
    urlParams.set('round', round); // Update the 'round' parameter with the new value

    const scoresSum = scoresSoFar.reduce((total, score) => total + score, 0);
    const socialScoresSum = comparersScoreSoFar.reduce((total, comparersScoreSoFar) => total + comparersScoreSoFar, 0);
    /*const avgScore = (scoresSum / scoresSoFar.length).toFixed(1);*/
    const avgScore = Math.max(...scoresSoFar);
    const avgSocialScore = Math.max(...comparersScoreSoFar);

    const data = [
        { name: "n3ssiori", score: 0 },
        { name: "You", score: 0 } // init for animation
    ];

    // Create SVG container
    const svg = d3.select("#barChart");

    // Set margins and dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(data.map(d => d.name));

    const ymax = socialScoresSum;
    let ymin = 0;
    if (avgScore < 0) {
      ymin = avgScore;
    }
    const yScale = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([ymin, ymax]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);

    // Append axes
    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${yScale(0) + margin.top})`)
      .call(xAxis);

    var youTick = svg.selectAll(".tick text").filter(function() { return d3.select(this).text() === "You"; })
    youTick.attr("fill", "#1F449C");
    if (avgScore < 0) {
      youTick.attr("dy", "-1em");
    }

    // Create initial bars
    const bars = svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name) + margin.left)
      .attr("y", d => yScale(d.score) + margin.top)
      .attr("width", xScale.bandwidth())
      .attr("height", d => 0);

    // Add text labels
    svg.selectAll(".bar-label")
      .data(data)
      .enter().append("text")
      .attr("class", "bar-label")
      .attr("x", d => xScale(d.name) + margin.left + xScale.bandwidth() / 2)
      .attr("y", d => yScale(0) - margin.top + 50)
      .attr("text-anchor", "middle")
      .attr("fill", "transparent")
      .text(d => Math.round(d.score));

    function updateSocialBar(player1Score) {
      data[0].score = player1Score;

      // Update scales
      const maxScore = Math.max(avgSocialScore, avgScore);
      const minScore = Math.min(0, avgScore);
      yScale.domain([minScore, maxScore]);

      // Update "Player 1" score with animation
      bars.filter(d => d.name === "n3ssiori")
        .transition()
        .duration(2000)
        .attr("y", d => yScale(Math.max(0, d.score)) + margin.top)
        .attr("height", d => Math.abs(yScale(0) - yScale(d.score)));

      // Update text labels
      svg.selectAll(".bar-label")
        .data(data)
        .filter(d => d.name === "n3ssiori")
        .text(d => Math.round(d.score)) // Update text content with score
        .transition()
        .duration(2000)
        .attr("fill", "white")
        .attr("y", d => yScale(Math.max(0, d.score)) + margin.top + 20);
    }

    function updatePlayerBar(avgScore) {
      data[1].score = avgScore;

      // Update scales
      const maxScore = Math.max(avgSocialScore, avgScore);
      const minScore = Math.min(0, avgScore);
      yScale.domain([minScore, maxScore]);

      // Update "You" score with animation
      bars.filter(d => d.name === "You")
          .transition()
          .duration(2000)
          .attr("y", d => yScale(Math.max(0, d.score)) + margin.top)
          .attr("height", d => Math.abs(yScale(0) - yScale(d.score)));

      svg.selectAll(".bar-label")
        .data(data)
        .filter(d => d.name === "You")
        .text(d => Math.round(d.score)) // Update text content with score
        .transition()
        .duration(2000)
        .attr("fill", d => Math.abs(yScale(0) - yScale(d.score)) < 50 ? "black" : "white") // Conditionally change text color
        .attr("y", d => {
          const barHeight = Math.abs(yScale(0) - yScale(d.score));
          if (barHeight < 50) {
            if (avgScore < 0) {
              return yScale(Math.max(0, d.score)) + margin.top + 20;// Move text below bar
            } else {
              return yScale(Math.max(0, d.score)) + margin.top - 5;// Move text above bar
            } 
          } else {
            return yScale(Math.max(0, d.score)) + margin.top + 20; // Default position
          }
        });
    }

    // Update scores with some delay to see the animation
    setTimeout(() => {
        updateSocialBar(avgSocialScore);
    }, 500); // Delay
    
    setTimeout(() => {
        updatePlayerBar(avgScore);
    }, 2500); // Delay

    const standingsButt = document.getElementById('next-round-button');

    standingsButt.disabled = true;
    standingsButt.style.cursor = 'not-allowed'; // Change cursor to not-allowed

    if (round <= finalRound) {
        standingsButt.innerHTML = "Next Round? Round " + round + " of " + finalRound;
        buttonToNewPage('next-round-button', 'GAME');
    } else {
        standingsButt.innerHTML = "Complete participation";
        buttonToNewPage('next-round-button', 'THANKS');
    }

    setTimeout(() => {
        standingsButt.disabled = false;
        standingsButt.classList.add('enabled');
        standingsButt.style.cursor = 'pointer';
    }, 6000);
}


function loadThanks() {
    const round = getUrlParameter('round');
    const finalRound = getUrlParameter('rounds');

    /*const avgScore = (scoresSum / scoresSoFar.length).toFixed(1);*/
    const maxScore = Math.max(...scoresSoFar);
    var playerRowMax = document.getElementById('player-score-max');
    if (playerRowMax) {
      playerRowMax.innerHTML = maxScore;
    }

    const scoresSum = scoresSoFar.reduce((total, score) => total + score, 0);
    var playerRowSum = document.getElementById('player-score-sum');
    if (playerRowSum) {
      playerRowSum.innerHTML = scoresSum;
    }

    let maximumPossible = sumHighestValues(settings.chanceToWin) * 100;
    const MAX_BONUS = 2;
    let bonus = MAX_BONUS * (scoresSum / maximumPossible);
    document.getElementById('bonus-calculation').innerHTML = '£' + bonus.toFixed(2);

    var genderSelect = document.getElementById('gender');
    var ageSelect = document.getElementById('age');
    var option = document.createElement('option');
    option.value = "prefer-not-to-say";
    option.text = 'Prefer not to say';
    ageSelect.appendChild(option);
    for (var i = 18; i <= 99; i++) {
      var option = document.createElement('option');
      option.value = i;
      option.text = i;
      ageSelect.appendChild(option);
    }
    document.getElementById('final-payment').addEventListener('click', function() {
      var storedData = sessionStorage.getItem('playerData');
      var existingData = storedData ? JSON.parse(storedData) : {};
      var additionalUserData = {
          "player": {
              "gender": genderSelect.value,
              "age": ageSelect.value,
              "bonus": bonus.toFixed(2)
          }
      };

      // Merge additional user data with existing user data
      existingData.player = Object.assign({}, existingData.player, additionalUserData.player);
      const comment = document.getElementById('comments').value;
      existingData.comment = comment;
      var mergedDataString = JSON.stringify(existingData);

      sessionStorage.setItem('playerData', mergedDataString);

      showPage('FINAL');
    });

    function sumHighestValues(chanceToWin) {
      let sum = 0;
      for (let i = 0; i < chanceToWin.length; i++) {
          for (let j = 0; j < chanceToWin[i].length; j++) {
              let highestValue = Math.max(...chanceToWin[i][j]);
              sum += highestValue;
          }
      }
      return sum;
    };
}


function loadRescinded() {
    
}

function loadBefore() {
    
}

function loadNoPid() {
    
}


function loadFinal() {
    const prolificID = JSON.parse(sessionStorage.getItem('playerData')).player.prolificID;
    var data = {};
    Object.keys(sessionStorage).forEach(function(key) {
      data[key] = JSON.parse(sessionStorage.getItem(key));
    });
    send_complete(prolificID, JSON.stringify(data, null, 2));
    setTimeout(() => {
        window.location = "https://app.prolific.com/submissions/complete?cc=C10ZGJNX";
    }, 6000);
}



function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || '';
}

function getScoresSoFar() {
  const urlParams = new URLSearchParams(window.location.search);
  const scores = [];
  urlParams.forEach((value, key) => {
      if (key.startsWith('score')) {
          scores.push(parseFloat(value));
      }
  });
  return scores;
}

function getComparersScoresSoFar() {
  const urlParams = new URLSearchParams(window.location.search);
  const scores = [];
  urlParams.forEach((value, key) => {
      if (key.startsWith('n3ssiori')) {
          scores.push(parseFloat(value));
      }
  });
  return scores;
}

function getGameSettings() {
    const settings = sessionStorage.getItem('gameSettings');
    return settings ? JSON.parse(settings) : {};
}

function buttonToNewPage(buttonId, newPageID) {
  document.getElementById(buttonId).addEventListener('click', function() {
    addToInstructionTimings(buttonId, new Date().toISOString().split('T')[1]);
    showPage(newPageID);
  });
}

function addToInstructionTimings(buttonId, timestamp) {
  let instructionTimings = JSON.parse(sessionStorage.getItem('instructionTimings'));

  if (!instructionTimings) {
    instructionTimings = {
      instruction: {}
    };
  }

  instructionTimings.instruction[buttonId] = {
    time: timestamp
  };

  sessionStorage.setItem('instructionTimings', JSON.stringify(instructionTimings));
}

function initializeFocusTracker() {
  // Initialize focus object in sessionStorage if not already exists
  if (!sessionStorage.getItem('focus')) {
    const initialFocus = {};
    sessionStorage.setItem('focus', JSON.stringify(initialFocus));
  }

  // Function to update focus data in sessionStorage
  function updateFocusData(focusType) {
    const focusData = JSON.parse(sessionStorage.getItem('focus')) || {};
    const currentTime = new Date().toISOString().split('T')[1];
    if (!focusData[currentPage]) {
      focusData[currentPage] = {
        'in-focus': [],
        'out-focus': []
      };
    }
    focusData[currentPage][focusType].push(currentTime);
    sessionStorage.setItem('focus', JSON.stringify(focusData));
  }

  // Event listener for visibility change
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
      updateFocusData('in-focus');
    } else {
      updateFocusData('out-focus');
    }
  });
}

function checkRefresh() {
  const hasConsentRescinded = JSON.parse(sessionStorage.getItem('focus')).hasOwnProperty('consent-rescinded');
  const pageAccessedByReload = (
    (window.performance.navigation && window.performance.navigation.type === 1) ||
      window.performance
        .getEntriesByType('navigation')
        .map((nav) => nav.type)
        .includes('reload')
  );
  if (pageAccessedByReload || hasConsentRescinded) {
    showPage('BEFORE');
  }
}


// The backend URL is composed of a hostname (localhost for testing, kyblab2.etc
// for running) and a port (which is specific to a particular experiment)
// These should be set for each experiment
const BACKEND_HOST = "http://kyblab2.tuebingen.mpg.de";
const BACKEND_PORT = "8005";
const BACKEND_URL = `${BACKEND_HOST}:${BACKEND_PORT}`;

// These are the routes the backend understands. They allow creation of a new
// participant, saving of complete or incomplete data, and finalisation of the
// experiment
const CREATE_PATH = "create";
const COMPLETE_SAVE_PATH = "complete";
const INCOMPLETE_SAVE_PATH = "incomplete";
const COMPLETE_SUCCESS_PATH = "complete_success";
const COMPLETE_FAILURE_PATH = "complete_failure";

/**
 * Notify the server that there is a new participant. This will generate and
 * return a new internal ID for that participant. The ID will be null in the
 * case that the prolific id has been seen before
 * 
 * @param pid The prolific id of the new participant 
 * @returns A promise of json with the value "id": "SOMERANDOMSTRING" for the
 * new participant, or "id": null if the pid is not unique
 */
async function create_participant(prolificID) {
  const response = await fetch(`${BACKEND_URL}/${CREATE_PATH}/${prolificID}`, {
    keepalive: true,
    method: 'POST',
  });
  if (!response.ok) {
    showPage('NOPID');
  }

  const data = await response.json();
  return data.id;
}

/**
 * Sends incomplete data (e.g. after each trial) to the backend to be saved. The
 * backend will save it in a directory of incomplete data.
 *
 * @param id The internal id of the participant 
 * @param data The data to be saved
 */
function send_incomplete(id, data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `${BACKEND_URL}/${INCOMPLETE_SAVE_PATH}/${id}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}

/**
 * Sends completed data to the backend to be saved. The
 * backend will remove any incomplete data, and write the completed data to the
 * completed data directory
 *
 * @param id The internal id of the participant 
 * @param data The data to be saved
 */
function send_complete(id, data) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `${BACKEND_URL}/${COMPLETE_SAVE_PATH}/${id}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
}

/**
 * Notifies the backend of the success or failure of the experiment. This will
 * cause the backend to move any saved data to either the completed or the
 * invalid data directories
 *
 * @param id The internal id of the participant 
 * @param data Whether or not the participant completed the experiment
 * succesfully
 */
function complete(id, success = true) {
  var xhr = new XMLHttpRequest();
  var path = COMPLETE_SUCCESS_PATH;
  if (!success) {
    path = COMPLETE_FAILURE_PATH;
  }
  xhr.open('POST', `${BACKEND_URL}/${path}/${id}`);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(null);
}

/**
 * Parse the prolific user id out of the url.
 * The id is a String variable with identifier "PROLIFIC_PID" that is automatically set when a 
 * participant was redirected to the website by prolific.
 * 
 * @returns Prolific user id (String) or None if no user id was found 
 */
function get_prolific_id() {
  // parse our prolific user id from URL parameters
  const TARGET = "PROLIFIC_PID";
  let params = new URLSearchParams(window.location.search);
  if (params.has(TARGET)) {
    return params.get(TARGET);
  } else {
    showPage('NOPID');
  }
}