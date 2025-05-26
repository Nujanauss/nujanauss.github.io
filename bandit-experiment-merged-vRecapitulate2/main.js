const ordinals = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];

let currentPage;
var phase1Round = 1;
let scoresSoFar = [];
let settings;
let training1Over = false;
let training2Over = false;
let training3Over = false;
let trainingP21Over = false;

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
        case 'INSTRUCTIONS5':
            loadInstructions5();
            break;
        case 'INSTRUCTIONS6':
            loadInstructions6();
            break;
        case 'INSTRUCTIONS7':
            loadInstructions7();
            break;
        case 'INSTRUCTIONS8':
            loadInstructions8();
            break;
        case 'INSTRUCTIONS9':
            loadInstructions9();
            break;
        case 'INSTRUCTIONS10':
            loadInstructions10();
            break;
        case 'INSTRUCTIONS11':
            loadInstructions11();
            break;
        case 'INSTRUCTIONS1_P2':
            loadInstructions1_P2();
            break;
        case 'INSTRUCTIONS2_P2':
            loadInstructions2_P2();
            break;
        case 'INSTRUCTIONS3_P2':
            loadInstructions3_P2();
            break;
        case 'INSTRUCTIONS4_P2':
            loadInstructions4_P2();
            break;
        case 'TRAIN':
            loadPhase1(
              2,
              1,
              true,
              false,
              {
                buttn:     'nextButton-t1',
                nextPage:  'INSTRUCTIONS4',
                doneRow:   'doneRowContainer-t1',
                focusRow:  'focusRowContainer-t1',
                outFocus:  'outOfFocusWrapper-t1',
                infoBox:   'infoBox-t1',
                scoreText: 'score-t1'
              }
            );
            break;
        case 'TRAIN2':
            loadPhase1(
              2,
              1,
              true,
              true,
              {
                buttn:     'nextButton-t2',
                nextPage:  'INSTRUCTIONS6',
                doneRow:   'doneRowContainer-t2',
                focusRow:  'focusRowContainer-t2',
                outFocus:  'outOfFocusWrapper-t2',
                infoBox:   'infoBox-t2',
                scoreText: 'score-t2'
              }
            );
            break;
        case 'TRAIN3':
            loadPhase1(
              settings.moves,
              1,
              true,
              true,
              {
                buttn:     'nextButton-t3',
                nextPage:  'INSTRUCTIONS8',
                doneRow:   'doneRowContainer-t3',
                focusRow:  'focusRowContainer-t3',
                outFocus:  'outOfFocusWrapper-t3',
                infoBox:   'infoBox-t3',
                scoreText: 'score-t3'
              }
            );
            break;
        case 'CHECK':
            loadCheck();
            break;
        case 'CHECK2':
            loadCheck2();
            break;
        case 'GAME1':
            loadPhase1(
              settings.moves,
              settings.numberOfRounds,
              false,
              true,
              {
                buttn:     'roundOverButton',
                nextPage:  'INSTRUCTIONS1_P2',
                doneRow:   'doneRowContainer',
                focusRow:  'focusRowContainer',
                outFocus:  'outOfFocusWrapper',
                infoBox:   'infoBox',
                scoreText: 'score'
              }
            );
            break;
        case 'TRAIN_P2':
            loadPhase2(
              2,
              1,
              true,
              {
                buttn:     'roundOverButton_P2-t1',
                nextPage:  'PHASE2INSTR1',
                doneRow:   'doneRowContainer_P2-t1',
                focusRow:  'focusRowContainer_P2-t1',
                outFocus:  'outOfFocusWrapper_P2-t1',
                stop:      'stop_P2-t1'
              }
            );
        break;
        case 'GAME2':
            loadPhase2(
              settings.moves,
              settings.numberOfRounds,
              false,
              {
                buttn:     'roundOverButton_P2',
                nextPage:  'PHASE2INSTR1',
                doneRow:   'doneRowContainer_P2',
                focusRow:  'focusRowContainer_P2',
                outFocus:  'outOfFocusWrapper_P2',
                stop:      'stop_P2'
              }
            );
            break;
        case 'INTERMEDIARY':
            loadIntermediary();
            break;
        case 'DISP':
            loadScoreDisplay();
            break;
        case 'PHASE2INSTR1':
          loadPhase2Instr1();
          break;
        case 'PHASE2INSTR2':
          loadPhase2Instr2();
          break;
        case 'PHASE2INSTR3':
          loadPhase2Instr3();
          break;
        case 'PHASE2INSTR4':
          loadPhase2Instr4();
          break;
        case 'PHASE2INSTR5':
          loadPhase2Instr5();
          break;
        case 'PHASE2INSTR6':
          loadPhase2Instr6();
          break;
        case 'PHASE2INSTR7':
          loadPhase2Instr7();
          break;
        case 'PHASE2INSTR8':
          loadPhase2Instr8();
          break;
        case 'PHASE2INSTR9':
          loadPhase2Instr9();
          break;
        case 'PHASE2INSTR10':
          loadPhase2Instr10();
          break;
        case 'PHASE2TRAIN1':
            loadPhase2Training1();
            break;
        case 'COMPARISON2':
            loadComparison2();
            break;
        case 'COMPARISON3':
            loadComparison3();
            break;
        case 'COMPARISON4':
            loadComparison4();
            break;
        case 'INTERMEDIARYCOMP':
            loadIntermediaryComp();
        case 'RATE':
            loadRate();
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
        try {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) { // Safari, older Chrome, Opera
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
          } else {
            console.log('Fullscreen API is not supported.');
          }
        } catch (err) {
          console.error(`Fullscreen request failed: ${err}`);
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
    //if (prolificID === 0) {
    //  return;
    //}
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //create_participant(prolificID).then(id => {
    //  if (!id || typeof id !== 'string' || id.trim() === '') {
    //    showPage('BEFORE');
    //    return;
    //  }
    //  var playerData = {
    //    "player": {
    //        "prolificID": id,
    //    }
    //  };
    //  sessionStorage.setItem('playerData', JSON.stringify(playerData));
    //}).catch(error => {
    //  showPage('NOPID');
    //});

    settings = getGameSettings();

    buttonToNewPage('nextButton1', 'INSTRUCTIONS2');
    
    // DELETE BELOW
    var playerData = {
      "player": {
          "prolificID": prolificID,
      }
    };
    sessionStorage.setItem('playerData', JSON.stringify(playerData));
    // DELETE ABOVE
}

function loadInstructions2() {
    buttonToNewPage('backButton2', 'INSTRUCTIONS1');
    buttonToNewPage('nextButton2', 'TRAIN_P2');//buttonToNewPage('nextButton2', 'INSTRUCTIONS3');//
}

function loadInstructions3() {
    buttonToNewPage('backButton3', 'INSTRUCTIONS2');
    buttonToNewPage('trainingButton', 'TRAIN');
}

function loadInstructions4() {
    buttonToNewPage('nextButton4', 'INSTRUCTIONS5');
}

function loadInstructions5() {
    buttonToNewPage('backButton5', 'INSTRUCTIONS4');
    buttonToNewPage('trainingButton2', 'TRAIN2');
}

function loadInstructions6() {
    document.getElementById('numberTurnsINSTR6').innerHTML = settings.moves;
    buttonToNewPage('nextButton6', 'INSTRUCTIONS7');
}

function loadInstructions7() {
    buttonToNewPage('backButton7', 'INSTRUCTIONS6');
    buttonToNewPage('trainingButton3', 'TRAIN3');
}

function loadInstructions8() {
    buttonToNewPage('nextButton8', 'INSTRUCTIONS9');
}

function loadInstructions9() {
    document.getElementById('numberTurnsINSTR9').innerHTML = settings.moves;
    document.getElementById('numberRoundsINSTR9').innerHTML = settings.numberOfRounds;
    buttonToNewPage('backButton9', 'INSTRUCTIONS8');
    buttonToNewPage('nextButton9', 'INSTRUCTIONS10');
}

function loadInstructions10() {
    buttonToNewPage('backButton10', 'INSTRUCTIONS1');
    buttonToNewPage('nextButton10', 'CHECK');
}

function loadInstructions11() {
    buttonToNewPage('nextButton11', 'GAME1');
}

function loadInstructions1_P2() {
    document.getElementById('phase-1-final-round-score').innerHTML = scoresSoFar.at(-1);
    totalScore = 0;
    scoresSoFar.forEach( score => {
      totalScore += score;
    })
    document.getElementById('phase-1-score').innerHTML = totalScore;
    buttonToNewPage('nextButton21', 'INSTRUCTIONS2_P2');
}

function loadInstructions2_P2() {
    buttonToNewPage('backButton22', 'INSTRUCTIONS1_P2');
    buttonToNewPage('nextButton22', 'INSTRUCTIONS3_P2');
}

function loadInstructions3_P2() {
    buttonToNewPage('backButton23', 'INSTRUCTIONS2_P2');
    buttonToNewPage('nextButton23', 'INSTRUCTIONS4_P2');
}

function loadInstructions4_P2() {
    buttonToNewPage('backButton24', 'INSTRUCTIONS3_P2');
    buttonToNewPage('nextButton24', 'TRAIN_P2');
}


async function loadPhase1(numberOfMoves, numberOfRounds, training, rewarding, ids) {
      // — Get DOM ids —
    const {
      buttn:         buttonId,
      nextPage:      nextPageId,
      doneRow:       doneRowId,
      focusRow:      focusRowId,
      outFocus:      outFocusId,
      infoBox:       infoBoxId,
      scoreText:     scoreTextId
    } = ids;

    // — DOM refs —
    const infoBox       = document.getElementById(infoBoxId);
    const scoreText     = document.getElementById(scoreTextId);
    const doneRow       = document.getElementById(doneRowId);
    const focusRow      = document.getElementById(focusRowId);
    const outFocusWrap  = document.getElementById(outFocusId);
    const nextBtn       = document.getElementById(buttonId);

    // — Settings & state —
    const smallSizeScale = 0.5;
    const rows            = numberOfMoves;
    const cols            = settings.cols;
    const chanceToWin     = settings.chanceToWin;
    let   currentRow      = 0;
    let   score           = 0;
    let   belowSubrows    = [];
    let   decision        = Array(numberOfMoves);
    let   rewardReceived  = Array(numberOfMoves);
    let   timeStamps      = Array(numberOfMoves);

    // — Compute sizes —
    const bigSize   = 0.65 * focusRow.clientHeight;
    const smallSize = computeSmallSize(rows, outFocusWrap);

    // Create one tile (adapted from your createSquare + click-handler)
    function createSquare(x, y, size) {
      const square = document.createElement('div');
      square.dataset.x = x;
      square.dataset.y = y;
      square.classList.add('square-finder', 'reward', 'hover-enabled', `reward${x}`);
      square.style.width  = square.style.height = `${size}px`;

      // add reward-star pseudo
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      const star = makeRewardStar();
      star.setAttribute('data-type', 'star');
      star.classList.add('gone');
      star.classList.add('animate');
      pseudo.appendChild(star);
      square.appendChild(pseudo);

      // click → handleClick
      square.addEventListener('click', () => handleClick(square));
      return square;
    }

    // Build the three zones
    function setupGrid() {
      // clear old
      doneRow.innerHTML      = '';
      focusRow.innerHTML     = '';
      outFocusWrap.innerHTML = '';
      belowSubrows = [];
      currentRow = 0;
      score = 0;
      scoreText.textContent = 'Score: 0';
      nextBtn.classList.add('hidden');

      if (!rewarding) {
        infoBox.classList.add('hidden');
      }

      // focus row (row 0): exactly two tiles
      for (let x = 0; x < cols; x++) {
        const sq = createSquare(x, 0, bigSize);
        focusRow.appendChild(sq);
      }

      // out-of-focus rows (1..rows-1) as subrows of two
      for (let y = 1; y < rows; y++) {
        const sub = document.createElement('div');
        sub.classList.add('subrow');
        sub.dataset.row = y;
        for (let x = 0; x < cols; x++) {
          const sq = createSquare(x, y, smallSize);
          sq.classList.add('grey');
          sq.style.pointerEvents = 'none';
          sub.appendChild(sq);
        }
        outFocusWrap.appendChild(sub);
        belowSubrows.push(sub);
      }
    }

    // Handle click on any focus-row tile
    function handleClick(square) {
      if (square.style.pointerEvents === 'none') return;

      const x = +square.dataset.x;
      const y = +square.dataset.y;
      decision[currentRow] = { x, y };
      timeStamps[currentRow] = new Date().toISOString();

      const pseudo = square.firstElementChild;
      const star = pseudo.querySelector('[data-type="star"]');

      let reward = 0;
      if (Math.random() < 1 && rewarding) {
        square.classList.add('goldish');
        square.classList.remove(`reward${x}`);
        star.classList.remove('gone');
        reward = 1;
        score++;
        scoreText.textContent = 'Score: ' + score;
      } else {
        square.classList.add('white');
      }
      rewardReceived[currentRow] = reward;

      // Disable all tiles immediately to prevent further clicks
      Array.from(focusRow.children).forEach(sq => {
        sq.style.pointerEvents = 'none';
      });

      // Wait 700ms before animating
      setTimeout(() => {
        const focusTiles = Array.from(focusRow.children);
        const doneSub = document.createElement('div');
        doneSub.classList.add('subrow');
        doneRow.appendChild(doneSub);

        focusTiles.forEach(sq => {
          sq.classList.add('grey');
          const innerStar = sq.firstElementChild?.querySelector('[data-type="star"]');
          if (innerStar) innerStar.classList.remove('animate');
          animateReparent(sq, doneSub, smallSize);
        });

        if (currentRow < rows - 1) {
          const nextSub = belowSubrows[currentRow];
          outFocusWrap.removeChild(nextSub);
          Array.from(nextSub.children).forEach(sq => {
            sq.classList.remove('grey');
            sq.style.pointerEvents = '';
            animateReparent(sq, focusRow, bigSize);
          });
        } else {
          if (!training) {
            scoresSoFar.push(score);
          }
          nextBtn.classList.remove('hidden');
          saveData(decision, rewardReceived, timeStamps);
          if (phase1Round == numberOfRounds) {
            buttonToNewPage(buttonId, nextPageId);
          } else {
            buttonToNewPage(buttonId, 'DISP');
          }
        }

        currentRow++;
      }, 700);
    }

    function saveData(decisionArr, rewardArr, timeArr) {
      const data = { move: {} };
      decisionArr.forEach((sq, idx) => {
        data.move[idx] = {
          decisionX: sq.x,
          decisionY: sq.y,
          reward:    rewardArr[idx],
          timestamp: timeArr[idx]
        };
      });
      sessionStorage.setItem(phase1Round, JSON.stringify(data));
    }

    // Initialise and draw
    setupGrid();
}

async function loadPhase2(numberOfMoves, numberOfRounds, training, ids) {
      // — Get DOM ids —
    const {
      buttn:         buttonId,
      nextPage:      nextPageId,
      doneRow:       doneRowId,
      focusRow:      focusRowId,
      outFocus:      outFocusId,
      stop:          stopId
    } = ids;

    // — DOM refs —
    const doneRow       = document.getElementById(doneRowId);
    const focusRow      = document.getElementById(focusRowId);
    const outFocusWrap  = document.getElementById(outFocusId);
    const nextBtn       = document.getElementById(buttonId);
    const stopIcon      = document.getElementById(stopId);

    // — Settings & state —
    const smallSizeScale = 0.5;
    const rows            = numberOfMoves;
    const cols            = settings.cols;
    let   currentRow      = 0;
    let   score           = 0;
    let   belowSubrows    = [];
    let   decision        = Array(numberOfMoves);
    let   timeStamps      = Array(numberOfMoves);
    let   autoMode = true;

    // — Compute sizes —
    const bigSize   = 0.65 * focusRow.clientHeight;
    const smallSize = computeSmallSize(rows, outFocusWrap);

    if (!training) {
      stopIcon.classList.add('hidden');
    }

    function makeDecisions() {
      let movesMade = 0;
      const interval = setInterval(() => {
        const squares = focusRow.children;
        const randomIndex = Math.floor(Math.random() * squares.length);
        handleClick(squares[randomIndex]);
        movesMade++;

        if (movesMade >= numberOfMoves - 1) {
          clearInterval(interval);
          autoMode = false;
        }
      }, 1000);
    }

    // Create one tile (adapted from your createSquare + click-handler)
    function createSquare(x, y, size) {
      const square = document.createElement('div');
      square.dataset.x = x;
      square.dataset.y = y;
      square.classList.add('square-finder', 'reward', `reward${x}`);
      square.style.width  = square.style.height = `${size}px`;
      square.addEventListener('click', e => handleClick(square, e));
      square.style.cursor = 'not-allowed';

      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      const tick = makeTick();
      tick.setAttribute('data-type', 'tick');
      tick.classList.add('gone','animate');
      pseudo.appendChild(tick);
      square.appendChild(pseudo);

      return square;
    }

    // Build the three zones
    function setupGrid() {
      // clear old
      doneRow.innerHTML      = '';
      focusRow.innerHTML     = '';
      outFocusWrap.innerHTML = '';
      belowSubrows = [];
      currentRow = 0;
      nextBtn.classList.add('hidden');

      // focus row (row 0): exactly two tiles
      for (let x = 0; x < cols; x++) {
        const sq = createSquare(x, 0, bigSize);
        focusRow.appendChild(sq);
      }

      // out-of-focus rows (1..rows-1) as subrows of two
      for (let y = 1; y < rows; y++) {
        const sub = document.createElement('div');
        sub.classList.add('subrow');
        sub.dataset.row = y;
        for (let x = 0; x < cols; x++) {
          const sq = createSquare(x, y, smallSize);
          sq.classList.add('grey');
          sq.classList.add('disabled');
          sub.appendChild(sq);
        }
        outFocusWrap.appendChild(sub);
        belowSubrows.push(sub);
      }
    }

    // Handle click on any focus-row tile
    function handleClick(square, event) {
      const isPenultimate = currentRow === rows - 2;
      const isLast        = currentRow === rows - 1;

      if (autoMode && !isLast && event?.isTrusted) {
        return;
      }

      const pseudo = square.firstElementChild;
      const tick = pseudo.querySelector('[data-type="tick"]');

      const x = +square.dataset.x;
      const y = +square.dataset.y;
      decision[currentRow] = { x, y };
      timeStamps[currentRow] = new Date().toISOString();

      let correct = false;
      square.classList.add('white');
      if (isLast && Math.random() < 1) {
          correct = true;
          tick.classList.remove('gone');
          square.classList.remove('white');
          square.classList.add('greenish');
          square.classList.remove(`reward${x}`);
      }


      // Disable all tiles immediately to prevent further clicks
      Array.from(focusRow.children).forEach(sq => {
        sq.classList.add('disabled');
      });

      // Wait 700ms before animating
      setTimeout(() => {
        // Hide the stop icon as soon as the penultimate row moves into focus
        if (isPenultimate) {
          stopIcon.classList.add('hidden');
        }

        // Prepare new “done” subrow
        const focusTiles = Array.from(focusRow.children);
        const doneSub    = document.createElement('div');
        doneSub.classList.add('subrow');
        doneRow.appendChild(doneSub);

        // If this isn’t the final click, pull in the next subrow
        if (!isLast) {
          const nextSub = belowSubrows[currentRow];
          outFocusWrap.removeChild(nextSub);

          Array.from(nextSub.children).forEach(sq => {
            sq.classList.remove('grey');
            sq.style.pointerEvents = '';
            animateReparent(sq, focusRow, bigSize);

            // once that new row is in focus, allow hover/click on it
            if (isPenultimate) {
              sq.classList.remove('disabled');
              sq.classList.add('hover-enabled');
              sq.style.cursor = 'pointer';
            }
          });
        }
        focusTiles.forEach(sq => {
            sq.classList.add('grey');
            animateReparent(sq, doneSub, smallSize);
            sq.style.pointerEvents = 'none';
        });
        square.classList.remove('white', 'grey');

        if (isLast) {
          tick.classList.remove('animate');
          document.querySelectorAll('.square-finder').forEach(sq => {
            sq.style.pointerEvents = 'none';
          });
          if (!correct) {
            focusTiles.forEach(sq => {
              sq.classList.remove('grey');
            });
            square.classList.add('white');
          }
          
          nextBtn.classList.remove('hidden');
          saveData(decision, timeStamps);

          const targetPage = (phase1Round === numberOfRounds)
            ? nextPageId
            : 'DISP';
          return buttonToNewPage(buttonId, targetPage);
        }
        currentRow++;
      }, 700);
    }

    function saveData(decisionArr, timeArr) {
      const data = { move: {} };
      decisionArr.forEach((sq, idx) => {
        data.move[idx] = {
          decisionX: sq.x,
          decisionY: sq.y,
          timestamp: timeArr[idx]
        };
      });
      sessionStorage.setItem(phase1Round, JSON.stringify(data));
    }

    // Initialise and draw
    setupGrid();
    makeDecisions();
}

function loadCheck() {
    const submitButton = document.getElementById('check-next');
    document.getElementById('checkTurns').innerHTML = settings.moves;
    document.getElementById('checkRounds').innerHTML = settings.numberOfRounds - 1;
    let correctAnswers = [
        { question: "1", answer: false },
        { question: "2", answer: false },
        { question: "3", answer: true },
        { question: "4", answer: false },
        { question: "5", answer: true },
        { question: "6", answer: false }
    ];

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
      document.getElementById('6').style.marginBottom = '0px';
      submitButton.innerHTML = 'Next';

      submitButton.classList.add('disabled');
      submitButton.disabled = true;
      submitButton.style.cursor = 'not-allowed';
      setTimeout(() => {
          submitButton.classList.remove('disabled');
          submitButton.classList.add('enabled');
          submitButton.disabled = false;
          submitButton.style.cursor = 'pointer';
          buttonToNewPage('check-next', 'INSTRUCTIONS11');
      }, 2000);
    });
}

function loadScoreDisplay() {
    document.getElementById('phase-1-round-score').innerHTML = scoresSoFar.at(-1);
    document.getElementById('round-ordinal').innerHTML = ordinals[phase1Round-1];
    document.getElementById('round-next').innerHTML = (phase1Round+1);
    phase1Round++;
    buttonToNewPage('nextButtonDisp','GAME1');
}




function loadPhase2Instr1() {
    document.getElementById('phase-1-final-round-score').innerHTML = scoresSoFar.at(-1);
    let totalScore = 0;
    scoresSoFar.forEach( num => {totalScore += num;})
    document.getElementById('phase-1-score').innerHTML = totalScore;
    buttonToNewPage('nextButton21','PHASE2INSTR2');
}

function loadPhase2Instr2() {
    buttonToNewPage('backButton22','PHASE2INSTR1');
    buttonToNewPage('nextButton22','PHASE2INSTR3');
}

function loadPhase2Instr3() {
    buttonToNewPage('backButton23','PHASE2INSTR2');
    buttonToNewPage('nextButton23','PHASE2INSTR4');
}

function loadPhase2Instr4() {
    buttonToNewPage('backButton24','PHASE2INSTR3');
    buttonToNewPage('nextButton24','PHASE2INSTR5');
}

function loadPhase2Instr5() {
    document.getElementById('numberTurnsP2T5').innerHTML = settings.moves;
    document.getElementById('learning-period-pulls').innerHTML = 4;
    buttonToNewPage('backButton25','PHASE2INSTR4');
    buttonToNewPage('nextButton25','PHASE2INSTR6');
}

function loadPhase2Instr6() {
    buttonToNewPage('backButton26','PHASE2INSTR5');
    buttonToNewPage('nextButton26','PHASE2INSTR7');
}


function loadPhase2Instr7() {
    buttonToNewPage('backButton27', 'PHASE2INSTR6');
    buttonToNewPage('trainingButton21', 'PHASE2TRAIN1');
}

function loadPhase2Training1() {
    document.body.classList.add('dotted-background');
    const gridContainer = document.getElementById('grid-container-p2-training1');

    let linkedSliders = [];
    var currentMove = 0;

    const rows = 1;
    const cols = 2;
    const squareCounters = {};
    const maxSquareCount = 4;
    const numberOfMoves = maxSquareCount * 2;

    let canClick = true;
    let slidersClicked = false;
    let trialEnded = false;

    let decision = Array(), timeStamps = Array();
    setupGrid();

    blockScreenForComparison();

    function gameLogic(square) {
        if (currentMove > numberOfMoves - 1) {
            return;
        }
        revealSquare(square);

        decision[currentMove] = square;
        timeStamps[currentMove] = new Date().toISOString().split('T')[1];

        currentMove = currentMove + 1;

        if (currentMove > numberOfMoves - 1) {
          endTrialLogic();
        }
    }

    function blockScreenForComparison() {
      document.getElementById('numberTurnsOther-training').innerHTML = 3;
      document.getElementById('soo-score-training').innerHTML = 3;

      document.getElementById("soo-information-training").classList.remove("gone");
      document.body.style.cursor = 'none !important';
      document.getElementById("overlay-training").style.display = 'block';

      setTimeout(() => {
        document.getElementById("read-comparison-p2-training").style.visibility = 'visible';
        document.getElementById("soo-information-training").addEventListener('click', function() {
          document.getElementById("overlay-training").style.display = 'none';
          document.body.style.cursor = 'default';
          document.getElementById("read-comparison-p2-training").style.display = 'none';
        });
      }, 1000);
    }

    function endTrialLogic() {
      document.body.classList.remove('dotted-background');
      document.getElementById("training-subheading-p2-1").innerHTML = 'Decision Period: Use the sliders to tell us how many times you think John Doe selected each card.';
      Array.from(document.getElementsByClassName("slider-container-training"))
        .forEach(sl => {
          sl.classList.remove('hidden');
      });

      trialEnded = true;

      saveTrainingData();

      greyAllBoxes();

      submitButton = document.getElementById('trainingOverBut21');
      submitButton.classList.add('disabled');
      submitButton.classList.remove('hidden');
      submitButton.disabled = true;
      submitButton.style.cursor = 'not-allowed';
      return;
    }

    function revealSquare(square) {
        const pseudo = square.firstElementChild;
        const star = pseudo.querySelector('[data-type="star"]');

        cnt = updateAndGetSquareCount(square);

        square.classList.remove('reward');
        square.classList.add('white');
        if (currentMove % 2 == 0) {
            star.classList.remove('gone');
            square.classList.add('goldish');
        }

        // Update progress bar class
        const squareId = square.id;
        squareCounters[squareId] = (squareCounters[squareId] || 0) + 1;
        const clickCount = squareCounters[squareId];

        const progressBar = square.parentElement.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.classList.remove('progress0','progress25','progress25-50','progress50-75','progress75-100');
            if (clickCount === 1) {
                progressBar.classList.add('progress25');
            } else if (clickCount === 2) {
                progressBar.classList.add('progress25-50');
            } else if (clickCount === 3) {
                progressBar.classList.add('progress50-75');
            } else if (clickCount === 4) {
                progressBar.classList.add('progress75-100');
            }
        }

        setTimeout(() => {
            square.classList.remove('white');
            square.classList.remove('goldish');
            star.classList.add('gone');
            if (cnt == maxSquareCount) {
              square.classList.add('grey');
              square.classList.remove('hover-enabled');
              square.removeEventListener('click', square._clickHandler);
            } else {
              square.classList.add('reward');
            }
        }, 700);
    }

    function updateAndGetSquareCount(square) {
        const squareId = square.id.split('-'); // ['t1', '5', '7']
        const squareX = parseFloat(squareId[1]);
        const squareY = parseFloat(squareId[2]);
        const key = `${squareX},${squareY}`;
        squareCounters[key] = (squareCounters[key] || 0) + 1;
        return squareCounters[key]
    }

    function makeRewardStar() {
      const svgNS = "http://www.w3.org/2000/svg";

      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("class", "reward-star");
      svg.setAttribute("xmlns", svgNS);
      svg.setAttribute("viewBox", "0 -960 960 960");
      svg.setAttribute("width", "75px");
      svg.setAttribute("height", "75px");
      svg.setAttribute("fill", "gold");

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", "M852-212 732-332l56-56 120 120-56 56ZM708-692l-56-56 120-120 56 56-120 120Zm-456 0L132-812l56-56 120 120-56 56ZM108-212l-56-56 120-120 56 56-120 120Zm246-75 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-361Z");
      path.setAttribute("stroke", "black");
      path.setAttribute("stroke-width", "10");

      svg.appendChild(path);
      return svg;
    }

    function setupGrid() {
      const padding = 10;
      const minDimension = Math.min(window.innerWidth, window.innerHeight - rows * padding);
      const squareSize = 0.55 * (minDimension / Math.max(rows, cols)) - padding;

      gridContainer.innerHTML = '';
      gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${squareSize + padding}px)`;
      gridContainer.style.gridTemplateRows = `repeat(${rows}, ${squareSize + padding}px)`;

      createGridSquares(rows, cols, squareSize, padding);
    }

    function createGridSquares(rows, cols, squareSize, padding) {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const squareWithSlider = createSquare(x, y, squareSize, padding);
          gridContainer.appendChild(squareWithSlider);
          const slider = squareWithSlider.querySelector('input[type="range"]');
          linkedSliders.push(slider);
        }
      }

      const maxValue = 3;

      function sync(indexChanged) {
        slidersClicked = true;
        const otherIndex = 1 - indexChanged;
        const changedSlider = linkedSliders[indexChanged];
        const otherSlider = linkedSliders[otherIndex];

        const newValue = parseInt(changedSlider.value, 10);
        otherSlider.value = (maxValue - newValue).toString();
      }

      linkedSliders.forEach((slider, i) => {
        slider.addEventListener('input', () => sync(i));
        slider.addEventListener('input', enableSubmitButtonOnce);
      });

      // Initialize the default sum
      linkedSliders[0].value = '0';
      linkedSliders[1].value = '0';
    }

    function enableSubmitButtonOnce() {
      submitButton = document.getElementById('trainingOverBut21');

      submitButton.classList.remove('disabled');
      submitButton.classList.add('enabled');
      submitButton.disabled = false;
      submitButton.style.cursor = 'pointer';

      buttonToNewPage('trainingOverBut21', 'PHASE2INSTR8');
    }

    function createSquare(x, y, squareSize, padding) {
      const square = document.createElement('div');
      square.id = `p2t3-${x}-${y}`;
      square.classList.add('square-finder', 'hover-enabled', 'reward', `reward${x}`);
      square.style.width = square.style.height = squareSize + 'px';
      square.style.borderRadius = '5px';
      square.style.margin = `${padding / 2}px`;

      // Pseudo element for inner content (star)
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');

      const star = makeRewardStar();
      star.setAttribute('data-type', 'star');
      star.classList.add('gone');
      pseudo.appendChild(star);
      square.appendChild(pseudo);

      // Create and add slider container
      const sliderContainer = document.createElement('div');
      sliderContainer.classList.add('slider-container-training');
      sliderContainer.style.width = squareSize + 'px';
      sliderContainer.classList.add('number-pulls-slider-container');
      sliderContainer.classList.add('hidden');

      // Create slider element
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '3';
      slider.step = '1';
      slider.value = '0';
      slider.style.cursor = 'pointer';
      slider.style.width = '100%';

      // Create tick labels
      const labels = document.createElement('div');
      labels.style.display = 'flex';
      labels.style.justifyContent = 'space-between';
      labels.style.width = '100%';
      labels.style.fontSize = '12px';
      labels.style.marginTop = '4px';

      for (let i = 0; i <= 3; i++) {
        const label = document.createElement('span');
        label.textContent = i.toString();
        labels.appendChild(label);
      }

      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(labels);

      // Progress
      const progressBarContainer = document.createElement('div');
      progressBarContainer.classList.add('progress-bar-container');
      progressBarContainer.style.marginBottom = '0';

      const progressBar = document.createElement('div');
      progressBar.classList.add('progress-bar','progress0',`progress-color${x}`);
      progressBarContainer.appendChild(progressBar);

      // Wrap square and slider in a container
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'center';
      wrapper.appendChild(progressBarContainer);
      wrapper.appendChild(square);
      wrapper.appendChild(sliderContainer);

      const handler = createRewardClickHandler(square);
      square._clickHandler = handler;
      square.addEventListener('click', square._clickHandler);

      return wrapper;
    }

    function createRewardClickHandler(square) {
      return async function handleRewardClick(event) {
        if (!canClick) return;
        canClick = false;
        disableAllSquares();
        try {
          await gameLogic(square);
        } finally {
          setTimeout(() => {
            canClick = true;
            enableAllSquares();
          }, 700);
        }
      };
    }

    function disableAllSquares() {
      const squares = document.querySelectorAll('.reward');
      squares.forEach(sq => sq.style.pointerEvents = 'none');
    }

    function enableAllSquares() {
      const squares = document.querySelectorAll('.reward');
      squares.forEach(sq => sq.style.pointerEvents = '');
    }

    function greyAllBoxes() {
      const squares = gridContainer.querySelectorAll('.square-finder');
        squares.forEach(s => {
          s.classList.remove('hover-enabled');
          s.classList.remove('reward');
          s.classList.add('grey');
          s.removeEventListener('click', s._clickHandler);
        });
    }

    function saveTrainingData() {
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
              timestamp: timeStamps[index]
          };
      });

      // Convert the data object to a JSON string
      const dataJSON = JSON.stringify(data);

      // Store the JSON string in sessionStorage
      sessionStorage.setItem("trainingData3", dataJSON);
    }
}

function loadPhase2Instr8() {
    buttonToNewPage('nextButton28', 'PHASE2INSTR9');
}


function loadPhase2Instr9() {
    document.getElementById('numberRound-Phase2').innerHTML = 3;
    document.getElementById('changeRoundCount-Phase2').innerHTML = 1;
    buttonToNewPage('backButton29', 'PHASE2INSTR8');
    buttonToNewPage('nextButton29', 'PHASE2INSTR10');
}

function loadPhase2Instr10() {
    buttonToNewPage('backButton210', 'PHASE2INSTR2');
    buttonToNewPage('nextButton210', 'CHECK2');
}

function loadCheck2() {
    const submitButton = document.getElementById('check-next2');
    let correctAnswers = [
        { question: "1", answer: false },
        { question: "2", answer: false },
        { question: "3", answer: true },
        { question: "4", answer: false },
        { question: "5", answer: true },
        { question: "6", answer: false }
    ];

    let answers = [];
    let checkedAnswerLog = [];
    let questions = document.querySelectorAll('.check2');
    questions.forEach(question => {
        let qID = question.querySelector('.question2').id;
        question.querySelectorAll('input[type="radio"]').forEach(answer => {
          answer.addEventListener('change', () => {
            document.getElementById('error-msg2').style.visibility = 'hidden';
            question.querySelector('.question2').style.color = '#333';
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
      document.getElementById('6').style.marginBottom = '0px';
      submitButton.innerHTML = 'Next';

      submitButton.classList.add('disabled');
      submitButton.disabled = true;
      submitButton.style.cursor = 'not-allowed';
      setTimeout(() => {
          submitButton.classList.remove('disabled');
          submitButton.classList.add('enabled');
          submitButton.disabled = false;
          submitButton.style.cursor = 'pointer';
          buttonToNewPage('check-next', 'INSTRUCTIONS11');
      }, 2000);
    });
}

function loadComparison2() {
    const prolificID = JSON.parse(sessionStorage.getItem('playerData')).player.prolificID;
    const nextButt = document.getElementById('nextButton8');
    document.getElementById('username-generation').innerHTML = prolificID;
    buttonToNewPage('backButtonCom2', 'DISP');
    buttonToNewPage('nextButtonCom2', 'COMPARISON3');

    nextButt.classList.add('disabled');
    nextButt.disabled = true;
    nextButt.style.cursor = 'not-allowed';
    setTimeout(() => {
        nextButt.classList.remove('disabled');
        nextButt.classList.add('enabled');
        nextButt.disabled = false;
        nextButt.style.cursor = 'pointer';
    }, 2000);
}

function loadComparison3() {
    buttonToNewPage('backButtonCom3', 'COMPARISON2');
    buttonToNewPage('nextButtonCom3', 'COMPARISON4');
}

function loadIntermediary() {
    if (phase1Round <= settings.numberOfRounds) {
        buttonToNewPage('rounder', 'GAME1');
    } else {
        document.getElementById('intermediary-text').innerHTML = "You have completed all the rounds. Thank you very much!";
        document.getElementById('rounder').innerHTML = "Complete participation";
        buttonToNewPage('rounder', 'THANKS');
    }
}

function loadRate() {
    const nextButtonRate = document.getElementById('nextButtonRate');
    const slider = document.getElementById('track');
    const thumb = document.getElementById('thumb');
    const vertical = document.getElementById('vertical-line');

    const rateWhat = document.getElementById('rate-what');

    const leftLabel = document.getElementById('left-label');
    const rightLabel = document.getElementById('right-label');

    const thumbLabel = document.getElementById('rate-label');
    const youThumbLabel = document.getElementById('rate-label-you');

    // Text
    const newRateWhat = rateWhat.cloneNode(true);
    rateWhat.parentNode.replaceChild(newRateWhat, rateWhat);
    const updatedRateWhat = document.getElementById('rate-what');
    updatedRateWhat.innerHTML = 'How do you rate the skill of <span id="rate-participant-id" class="font-30 blue-coloured">Player B</span>';

    const participantLetter = document.getElementById('rate-participant-id');
    const newParticipantLetter = participantLetter.cloneNode(true);
    participantLetter.parentNode.replaceChild(newParticipantLetter, participantLetter);
    const updatedParticipantLetter = document.getElementById('rate-participant-id');
    updatedParticipantLetter.innerHTML = comparisonTargetName;

    const newLeftLabel = leftLabel.cloneNode(true);
    leftLabel.parentNode.replaceChild(newLeftLabel, leftLabel);
    const updatedLeftLabel = document.getElementById('left-label');
    updatedLeftLabel.innerHTML = 'Every selection  <span class="blue-coloured">they</span> made was the worst possible';

    const newRightLabel = rightLabel.cloneNode(true);
    rightLabel.parentNode.replaceChild(newRightLabel, rightLabel);
    const updatedRightLabel = document.getElementById('right-label');
    updatedRightLabel.innerHTML = 'Every selection <span class="blue-coloured">they</span> made was the best possible';

    const newThumbLabel = thumbLabel.cloneNode(true);
    thumbLabel.parentNode.replaceChild(newThumbLabel, thumbLabel);
    const updatedThumbLabel = document.getElementById('rate-label');
    updatedThumbLabel.innerHTML = comparisonTargetName;
    updatedThumbLabel.classList.add("hidden");
    
    const newYouThumbLabel = youThumbLabel.cloneNode(true);
    youThumbLabel.parentNode.replaceChild(newYouThumbLabel, youThumbLabel);
    const updatedYouThumbLabel = document.getElementById('rate-label-you');
    updatedYouThumbLabel.classList.add("hidden");

    // Thumb
    const min = 0;
    const max = 100;
    const step = 1;
    let isDragging = false;

    const newThumb = thumb.cloneNode(true);
    thumb.parentNode.replaceChild(newThumb, thumb);
    const updatedThumb = document.getElementById('thumb');
    updatedThumb.classList.add("hidden");

    let val;
    updatedThumb.addEventListener('mousedown', () => {
      isDragging = true;
      updatedNextButtonRate.disabled = false;
      updatedNextButtonRate.classList.add('enabled');
      updatedNextButtonRate.style.color = 'black';
      updatedNextButtonRate.style.cursor = 'pointer';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) {
        return;
      }
      val = getValueFromPosition(e.clientX);
      updatedYouThumbLabel.style.left = `${val}%`;
    });
    document.addEventListener('mouseup', () => isDragging = false);

    // Slider
    const newRateSlider = slider.cloneNode(true);
    slider.parentNode.replaceChild(newRateSlider, slider);
    const updatedRateSlider = document.getElementById('track');
    updatedRateSlider.style.background = `#ddd`;
    updatedRateSlider.classList.add("track-clickable");
    let isSliderClickable = true;
    updatedRateSlider.addEventListener('click', (e) => {
      if (isSliderClickable) {
        updatedThumb.classList.remove("hidden");
        updatedRateSlider.classList.remove("track-clickable")
        val = getValueFromPosition(e.clientX);
        updatedYouThumbLabel.style.left = `${val}%`;
        isSliderClickable = false;
        updatedNextButtonRate.disabled = false;
        updatedNextButtonRate.classList.add('enabled');
        updatedNextButtonRate.style.color = 'black';
        updatedNextButtonRate.style.cursor = 'pointer';
      }
    });

    // Vertical Line
    const newVertical = vertical.cloneNode(true);
    vertical.parentNode.replaceChild(newVertical, vertical);
    const updatedVertical = document.getElementById('vertical-line');
    updatedVertical.classList.add("hidden");

    // Button
    const newNextButtonRate = nextButtonRate.cloneNode(true);
    nextButtonRate.parentNode.replaceChild(newNextButtonRate, nextButtonRate);
    const updatedNextButtonRate = document.getElementById('nextButtonRate');

    updatedNextButtonRate.disabled = true;
    updatedNextButtonRate.classList.remove('enabled');
    updatedNextButtonRate.style.color = '';
    updatedNextButtonRate.style.cursor = '';

    updatedNextButtonRate.addEventListener('click', function() {
        if (settings.includeComparison && settings.comparisonRounds.includes(phase1Round)) {
          buttonToNewPage('nextButtonRate', 'INTERMEDIARYCOMP');
        } else {
          buttonToNewPage('nextButtonRate', 'INTERMEDIARY');
        }
        updatedRateWhat.innerHTML = 'How do you rate your <span class="font-30 blue-coloured">own</span> skill';
        updatedLeftLabel.innerHTML = 'Every selection <span class="blue-coloured">I</span> made was the worst available';
        updatedRightLabel.innerHTML = 'Every selection <span class="blue-coloured">I</span> made was the best available';
        updatedThumbLabel.classList.remove("hidden");
        updatedYouThumbLabel.classList.remove("hidden");
        updatedVertical.classList.remove("hidden");
        addToInstructionTimings('nextButtonRate', new Date().toISOString().split('T')[1]);

        updatedNextButtonRate.disabled = true;
        updatedNextButtonRate.classList.remove('enabled');
        updatedNextButtonRate.style.color = '';
        updatedNextButtonRate.style.cursor = '';

        const otherRating = val;
        updatedThumbLabel.style.left = `${val}%`;
        updatedVertical.style.left = `${val}%`;
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) {
              return;
            }
            let background;
            if (val > otherRating) {
                background = `linear-gradient(to right, #ddd, #ddd ${otherRating}%, darkgray ${otherRating}%, darkgray ${val}%, #ddd ${val}%, #ddd)`;
            } else {
                background = `linear-gradient(to right, #ddd, #ddd ${val}%, darkgray ${val}%, darkgray ${otherRating}%, #ddd ${otherRating}%, #ddd)`;
            }
            updatedRateSlider.style.background = background;
        });
    });

    function getValueFromPosition(clientX) {
      const rect = updatedRateSlider.getBoundingClientRect();
      let x = Math.min(Math.max(clientX - rect.left, 0), rect.width);

      // Map position to value based on min, max, and step
      const percentage = x / rect.width;
      const rawValue = min + percentage * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;

      // Move the thumb using percentage (instead of pixels)
      const newPercentage = ((steppedValue - min) / (max - min)) * 100;
      updatedThumb.style.left = `${newPercentage}%`;  // Set the position in percentage

      return steppedValue;
    }

    /* SOME TABLE LOGIC */
    const unavailableRows = document.querySelectorAll('tr.unavailable');
    unavailableRows.forEach(row => {
      row.addEventListener('mouseover', (event) => {
        event.stopPropagation();
        row.style.cursor = 'not-allowed';
        row.style.background = '#f0f0f0';
      });

      row.addEventListener('click', (event) => {
        event.stopPropagation(); 
        row.style.cursor = 'not-allowed';
      });
    });
}

function loadThanks() {
    const phase1Round = getUrlParameter('round');
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
      if (key.startsWith('d5wgen40dm3m9k8vf0rzwcto')) {
          scores.push(parseFloat(value));
      }
  });
  return scores;
}

function getGameSettings() {
    const settings = sessionStorage.getItem('gameSettings');
    return settings ? JSON.parse(settings) : {};
}

function computeSmallSize(rows, outFocusWrap) {
  const wrapperStyles = getComputedStyle(outFocusWrap);

  const paddingTop = parseFloat(wrapperStyles.paddingTop);
  const paddingBottom = parseFloat(wrapperStyles.paddingBottom);
  const borderTop = parseFloat(wrapperStyles.borderTopWidth);
  const borderBottom = parseFloat(wrapperStyles.borderBottomWidth);
  const totalWrapperExtras = paddingTop + paddingBottom + borderTop + borderBottom;

  const totalSquareExtras = 6 * rows;

  const usableHeight = outFocusWrap.clientHeight - totalWrapperExtras - totalSquareExtras;
  return usableHeight / rows;
}

// FLIP animation helper
function animateReparent(el, newParent, finalSize) {
  const first = el.getBoundingClientRect();
  newParent.appendChild(el);
  const last  = el.getBoundingClientRect();
  const dx = first.left - last.left;
  const dy = first.top  - last.top;
  el.style.transform = `translate(${dx}px,${dy}px)`;
  el.getBoundingClientRect(); // force reflow
  el.style.transform = '';
  if (finalSize != null) {
    el.style.width  = finalSize + 'px';
    el.style.height = finalSize + 'px';
  }
}

function makeTick() {
  path = "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z";
  color = "#37f92a";
  return makeSVG(path,color,"correct-tick")
}

function makeCross() {
  path = "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z";
  color = "red";
  return makeSVG(path,color,"incorrect-cross")
}

function makeRewardStar() {
  path = "M852-212 732-332l56-56 120 120-56 56ZM708-692l-56-56 120-120 56 56-120 120Zm-456 0L132-812l56-56 120 120-56 56ZM108-212l-56-56 120-120 56 56-120 120Zm246-75 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-361Z";
  color = "gold";
  return makeSVG(path,color,"reward-star")
}

function makeSVG(pathString,color,extraClass) {
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", extraClass);
  svg.setAttribute("class", "svg-icon-in-square");
  svg.setAttribute("xmlns", svgNS);
  svg.setAttribute("viewBox", "0 -960 960 960");
  svg.setAttribute("width", "75px");
  svg.setAttribute("height", "75px");
  svg.setAttribute("fill", color);

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", pathString);
  path.setAttribute("stroke", "black");
  path.setAttribute("stroke-width", "5");

  svg.appendChild(path);
  return svg;
}

function buttonToNewPage(buttonId, newPageID) {
    const button = document.getElementById(buttonId);

    // If a previous handler exists, remove it
    if (button._clickHandler) {
      button.removeEventListener('click', button._clickHandler);
    }

    // Define a new handler
    const handler = function() {
      addToInstructionTimings(buttonId, new Date().toISOString().split('T')[1]);
      showPage(newPageID);
    };

    // Store the new handler on the button and add it
    button._clickHandler = handler;
    button.addEventListener('click', handler);
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

function generateCompareName() {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 24) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
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
    return 0;
  }
}