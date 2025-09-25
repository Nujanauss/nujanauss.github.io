const ordinals = [
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
  'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth',
  'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third',
  'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh', 'twenty-eighth',
  'twenty-ninth', 'thirtieth', 'thirty-first', 'thirty-second', 'thirty-third', 'thirty-fourth',
  'thirty-fifth', 'thirty-sixth', 'thirty-seventh', 'thirty-eighth', 'thirty-ninth', 'fortieth',
  'forty-first', 'forty-second', 'forty-third', 'forty-fourth', 'forty-fifth', 'forty-sixth',
  'forty-seventh', 'forty-eighth', 'forty-ninth', 'fiftieth', 'fifty-first', 'fifty-second',
  'fifty-third', 'fifty-fourth', 'fifty-fifth', 'fifty-sixth', 'fifty-seventh', 'fifty-eighth',
  'fifty-ninth', 'sixtieth', 'sixty-first', 'sixty-second', 'sixty-third', 'sixty-fourth',
  'sixty-fifth', 'sixty-sixth', 'sixty-seventh', 'sixty-eighth', 'sixty-ninth', 'seventieth',
  'seventy-first', 'seventy-second', 'seventy-third', 'seventy-fourth', 'seventy-fifth',
  'seventy-sixth', 'seventy-seventh', 'seventy-eighth', 'seventy-ninth', 'eightieth',
  'eighty-first', 'eighty-second', 'eighty-third', 'eighty-fourth', 'eighty-fifth', 'eighty-sixth',
  'eighty-seventh', 'eighty-eighth', 'eighty-ninth', 'ninetieth', 'ninety-first', 'ninety-second',
  'ninety-third', 'ninety-fourth', 'ninety-fifth', 'ninety-sixth', 'ninety-seventh',
  'ninety-eighth', 'ninety-ninth', 'one hundredth'
];

let currentPage;
var phase1Round = 1;
var phase2Round = 1;
var phase3Round = 1;
var phase4Round = 1;
var check1Entered = 0;
var check3Entered = 0;
var check4Entered = 0;
let scoresSoFar = [];
let scoresSoFar_P2 = [];
let scoresSoFar_P3 = [];
let scoresSoFar_P4 = [];
let selfRating = 0;
let settings;
let preferenceAgent;
let currentPlayer = 1;
let players = [];
let randomAgent;
let training1Over = false;
let training2Over = false;
let training3Over = false;
let trainingP21Over = false;

let targetTable;
var targetName = 'Player A';
const characteristics = [
    'Selects cards randomly',
    'Mostly selects the left-most card',
    'Selects cards most likely to score highly'
];


// Function to switch between pages and run specific scripts
function showPage(pageId) {
    currentPage = pageId;
    const pages = document.querySelectorAll('.w');
    pages.forEach(page => page.style.display = 'none');
    requestAnimationFrame(() => {
        const page = document.getElementById(pageId);
        page.style.display = 'block';
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
            case 'INSTRUCTIONS5_P2':
                loadInstructions5_P2();
                break;
            case 'INSTRUCTIONS6_P2':
                loadInstructions6_P2();
                break;
            case 'INSTRUCTIONS7_P2':
                loadInstructions7_P2();
                break;
            case 'INSTRUCTIONS8_P2':
                loadInstructions8_P2();
                break;
            case 'INSTRUCTIONS9_P2':
                loadInstructions9_P2();
                break;
            case 'INSTRUCTIONS10_P2':
                loadInstructions10_P2();
                break;
            case 'INSTRUCTIONS1_P3':
              loadInstructions1_P3();
              break;
            case 'INSTRUCTIONS2_P3':
              loadInstructions2_P3();
              break;
            case 'INSTRUCTIONS3_P3':
              loadInstructions3_P3();
              break;
            case 'INSTRUCTIONS2_P3_REPEAT':
              loadInstructions2_P3_REPEAT();
              break;
            case 'INSTRUCTIONS3_P3_REPEAT':
              loadInstructions3_P3_REPEAT();
              break;
            case 'INSTRUCTIONS4_P3':
              loadInstructions4_P3();
              break;
            case 'INSTRUCTIONS5_P3':
              loadInstructions5_P3();
              break;
            case 'INSTRUCTIONS6_P3':
              loadInstructions6_P3();
              break;
            case 'INSTRUCTIONS7_P3':
              loadInstructions7_P3();
              break;
            case 'INSTRUCTIONS8_P3':
              loadInstructions8_P3();
              break;
            case 'INSTRUCTIONS9_P3':
              loadInstructions9_P3();
              break;
            case 'INSTRUCTIONS10_P3':
              loadInstructions10_P3();
              break;
            case 'INSTRUCTIONS11_P3':
              loadInstructions11_P3();
              break;
            case 'INSTRUCTIONS1_P4':
              loadInstructions1_P4();
              break;
            case 'INSTRUCTIONS2_P4':
              loadInstructions2_P4();
              break;
            case 'INSTRUCTIONS3_P4':
              loadInstructions3_P4();
              break;
            case 'INSTRUCTIONS3_P4_REPEAT':
              loadInstructions3_P4_REPEAT();
              break;
            case 'INSTRUCTIONS4_P4':
              loadInstructions4_P4();
              break;
            case 'INSTRUCTIONS5_P4':
              loadInstructions5_P4();
              break;
            case 'INSTRUCTIONS6_P4':
              loadInstructions6_P4();
              break;
            case 'INSTRUCTIONS7_P4':
              loadInstructions7_P4();
              break;
            case 'INSTRUCTIONS8_P4':
              loadInstructions8_P4();
              break;
            case 'TRAIN':
                loadPhase1(
                  1,
                  1,
                  0,
                  settings.comparisonFrequency,
                  true,
                  false,
                  {
                    topInstruction:   'top-instruction-t1',
                    buttn:             'nextButton-t1',
                    nextPage:          'INSTRUCTIONS4',
                    rowWrapper:        'rowWrapper-t1',
                    historyRowWrapper: 'historyRowWrapper-t1',
                    scoreInfoBox:      'infoBox-t1',
                    scoreText:         'score-t1'
                  }
                );
                break;
            case 'TRAIN2':
                loadPhase1(
                  3,
                  1,
                  10,
                  settings.comparisonFrequency,
                  true,
                  true,
                  {
                    topInstruction:   'top-instruction-t2',
                    buttn:             'nextButton-t2',
                    nextPage:          'INSTRUCTIONS6',
                    rowWrapper:        'rowWrapper-t2',
                    historyRowWrapper: 'historyRowWrapper-t2',
                    scoreInfoBox:      'infoBox-t2',
                    scoreText:         'score-t2'
                  }
                );
                break;
            case 'TRAIN3':
                loadPhase1(
                  5,
                  1,
                  10,
                  settings.comparisonFrequency,
                  true,
                  true,
                  {
                    topInstruction:   'top-instruction-t3',
                    buttn:             'nextButton-t3',
                    nextPage:          'INSTRUCTIONS8',
                    rowWrapper:        'rowWrapper-t3',
                    historyRowWrapper: 'historyRowWrapper-t3',
                    scoreInfoBox:      'infoBox-t3',
                    scoreText:         'score-t3',
                    overlay:           'overlay-t3',
                    compareInfoBox:    'soo-information-t3',
                    lastXTrials:       'comparisonFreq-t3',
                    svgChart:          'score-chart-t3',
                    scoreInfoBox:      'infoBox-t3',
                    scoreText:         'score-t3',
                    readTxt:           'read-comparison-t3'
                  }
                );
                break;
            case 'CHECK':
                loadCheck();
                break;
            case 'CHECK_P2':
                loadCheck_P2();
                break;
            case 'CHECK_P3':
                loadCheck_P3();
                break;
            case 'CHECK_P4':
                loadCheck_P4();
                break;
            case 'GAME1':
                loadPhase1(
                  6,//settings.moves,
                  2,//Math.floor(settings.numberOfRounds / 4),
                  10,
                  settings.comparisonFrequency,
                  false,
                  true,
                  {                    
                    buttn:             'roundOverButton',
                    nextPage:          'INSTRUCTIONS1_P2',
                    rowWrapper:        'rowWrapper',
                    historyRowWrapper: 'historyRowWrapper',
                    scoreInfoBox:      'infoBox',
                    scoreText:         'score',
                    overlay:           'overlay',
                    compareInfoBox:    'soo-information',
                    lastXTrials:       'comparisonFreq',
                    svgChart:          'score-chart',
                    scoreInfoBox:      'infoBox',
                    scoreText:         'score',
                    readTxt:           'read-comparison'
                  }
                );
                break;
            case 'SELECT_PARTNER':
                loadSelectObservationTarget();
                break;
            case 'GAME2':
                loadPhase2(
                  4,
                  1,
                  10,
                  false,
                  {
                    topInstruction:   'top-instruction_P2',
                    buttn:            'roundOverButton_P2',
                    nextPage:         (currentPlayer > 1) ? 'INSTRUCTIONS2_P3_REPEAT' : 'INSTRUCTIONS2_P3',
                    rowWrapper:       'rowWrapper_P2',
                    historyRowWrapper: 'historyRowWrapper_P2',
                    stop:             'stop_P2',
                    comparisonTarget: 'comparison-target-image_P2'
                  }
                );
                break;
            case 'TRAIN_P3':
                loadPhase3(
                  2,
                  1,
                  settings.comparisonFrequency,
                  true,
                  {
                    topInstruction:      'top-instruction_P3-t1',
                    buttn:               'roundOverButton_P3-t1',
                    submitBttn:          'submitButton_P3-t1',
                    submitBttnWrap:      'submitButtonWrap_P3-t1',
                    nextPage:            'INSTRUCTIONS7_P3',
                    rowWrapper:          'rowWrapper_P3-t1',
                    historyRowWrapper:   'historyRowWrapper_P3-t1',
                    pickUpWrapper:       'pick-up-agents_P3-t1',
                    pickUpRowWrapper:    'pickUp-rowWrapper_P3-t1',
                    overlay:             'overlay_P3-t1',
                    compareInfoBox:      'soo-information_P3-t1',
                    lastXTrials:         'comparisonFreq_P3-t1',
                    scorePlayer:         'player-score_P3-t1',
                    otherName:           'target-name_P3-t1',
                    otherName2:           'target-name_P3_2-t1',
                    scoreOther:          'soo-score_P3-t1',
                    moreOrLessTxt:       'more-or-less_P3-t1',
                    svgChart:            'score-chart_P3-t1',
                    comparisonTarget:    'comparison-target-image_P3-t1'
                  }
                );
            break;
            case 'GAME3':
                loadPhase3(
                  6,//settings.moves,
                  2,//Math.floor(settings.numberOfRounds / 4),
                  settings.comparisonFrequency,
                  false,
                  {
                    buttn:               'roundOverButton_P3',
                    submitBttn:          'submitButton_P3',
                    submitBttnWrap:      'submitButtonWrap_P3',
                    nextPage:            'INSTRUCTIONS1_P4',
                    rowWrapper:          'rowWrapper_P3',
                    historyRowWrapper:   'historyRowWrapper_P3',
                    pickUpWrapper:       'pick-up-agents_P3',
                    pickUpRowWrapper:    'pickUp-rowWrapper_P3',
                    overlay:             'overlay_P3',
                    compareInfoBox:      'soo-information_P3',
                    lastXTrials:         'comparisonFreq_P3',
                    scorePlayer:         'player-score_P3',
                    otherName:           'target-name_P3',
                    otherName2:           'target-name_P3_2',
                    scoreOther:          'soo-score_P3',
                    moreOrLessTxt:       'more-or-less_P3',
                    svgChart:            'score-chart_P3',
                    comparisonTarget:    'comparison-target-image_P3'
                  }
                );
            break;
            case 'TRAIN_P4':
                loadPhase4(
                  3,
                  1,
                  settings.comparisonFrequency,
                  true,
                  {
                    buttn:               'roundOverButton_P4-t1',
                    nextPage:            'INSTRUCTIONS5_P4',
                    rowWrapper:          'rowWrapper_P4-t1',
                    historyRowWrapper:   'historyRowWrapper_P4-t1',
                    overlay:             'overlay_P4-t1',
                    compareInfoBox:      'soo-information_P4-t1',
                    lastXTrials:         'comparisonFreq_P4-t1',
                    scorePlayer:         'player-score_P4-t1',
                    otherName:           'target-name_P4-t1',
                    scoreOther:          'soo-score_P4-t1',
                    moreOrLessTxt:       'more-or-less_P4-t1',
                    svgChart:            'score-chart_P4-t1',
                    scoreInfoBox:        'infoBox_P4-t1',
                    scoreText:           'score_P4-t1',
                    readTxt:             'read-comparison_P4-t1',
                    comparisonTarget:    'comparison-target-image_P4-t1'
                  }
                );
            break;
            case 'GAME4':
                loadPhase4(
                  6,//settings.moves,
                  2,//Math.floor(settings.numberOfRounds / 4),
                  settings.comparisonFrequency,
                  false,
                  {
                    buttn:               'roundOverButton_P4',
                    nextPage:            (currentPlayer == 3) ? 'THANKS' : 'TRY_ANOTHER',
                    rowWrapper:          'rowWrapper_P4',
                    historyRowWrapper:   'historyRowWrapper_P4',
                    overlay:             'overlay_P4',
                    compareInfoBox:      'soo-information_P4',
                    lastXTrials:         'comparisonFreq_P4',
                    scorePlayer:         'player-score_P4',
                    otherName:           'target-name_P4',
                    scoreOther:          'soo-score_P4',
                    moreOrLessTxt:       'more-or-less_P4',
                    svgChart:            'score-chart_P4',
                    scoreInfoBox:        'infoBox_P4',
                    scoreText:           'score_P4',
                    readTxt:             'read-comparison_P4',
                    comparisonTarget:    'comparison-target-image_P4'
                  }
                );
            break;
            case 'INTERMEDIARY':
                loadIntermediary();
                break;
            case 'DISP':
                loadScoreDisplay();
                break;
            case 'DISP_P2':
                loadScoreDisplay_P2();
                break;
            case 'DISP_P3':
                loadScoreDisplay_P3();
                break;
            case 'DISP_P3_WRONG':
                loadScoreDisplay_P3_WRONG();
                break;
            case 'DISP_P4':
                loadScoreDisplay_P4();
                break;
            case 'INTERMEDIARYCOMP':
                loadIntermediaryComp();
            case 'RATESELF':
                loadRate(false,
                  {
                  buttn:        'nextButtonRateSelf',
                  nextPage:     'INSTRUCTIONS2_P2',
                  movableThumb: 'thumb-you',
                  slider:       'track-self',
                  rateLabel:    'rate-label-self'
                  }
                );
                break;
            case 'RATEOTHER':
                loadRate(true,
                  {
                  buttn:        'nextButtonRateOther',
                  nextPage:     'INSTRUCTIONS2_P4',
                  movableThumb: 'thumb-other',
                  slider:       'track-other',
                  rateLabel:    'rate-label-other'
                  }
                );
                break;
            case 'THANKS':
                loadThanks();
                break;
            case 'TRY_ANOTHER':
                loadTryAnother();
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
    });
}

// Initialize the first page
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.display = 'block';
    showPage('INDEX');
});

async function loadIndex() {
    initializeFocusTracker();
    checkRefresh();

    const response = await fetch('settings.csv'); // Fetch CSV containing the list of filenames
    const csvText = await response.text();
    const files = csvText.split(',').map(file => file.trim());

    const settingsJSON = await loadGameSettings(files);
    sessionStorage.setItem('gameSettings', JSON.stringify(settingsJSON));

    const rationalJSON = await loadAgent(files, 'rational');
    sessionStorage.setItem('rationalAgent', JSON.stringify(rationalJSON));
    const randomJSON = await loadAgent(files, 'random');
    sessionStorage.setItem('randomAgent', JSON.stringify(randomJSON));
    const leftyJSON = await loadAgent(files, 'lefty');
    sessionStorage.setItem('leftyAgent', JSON.stringify(leftyJSON));

    async function loadGameSettings(files) {
      const settingsFiles = files.filter(file => file.startsWith('settings_') && file.endsWith('.json'));

      if (settingsFiles.length === 0) {
        throw new Error('No JSON settings files found');
      }

      while (settingsFiles.length > 0) { // Try to find file randomly or run out of options
        const randomIndex = Math.floor(Math.random() * settingsFiles.length);
        const selectedFile = settingsFiles[randomIndex];
        
        try {
          const settingsResponse = await fetch(selectedFile);
          if (settingsResponse.ok) {
            const settingsData = await settingsResponse.json();
            settingsData.vars.id = selectedFile;
            return settingsData;
          } else {
            settingsFiles.splice(randomIndex, 1); // If file doesn't exist, remove it
          }
        } catch (error) {
          settingsFiles.splice(randomIndex, 1);
        }
      }
      throw new Error('No valid JSON settings files found');
    }

    async function loadAgent(files, type) {
      const prefix = `${type}SimulationResults_`;
      const agentFiles = files.filter(file => file.startsWith(prefix) && file.endsWith('.json'));

      if (agentFiles.length === 0) {
        throw new Error('No JSON agent decision files found');
      }

      while (agentFiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * agentFiles.length);
        const selectedFile = agentFiles[randomIndex];

        try {
          const response = await fetch(selectedFile);
          if (response.ok) {
            const rawData = await response.json();

            // Flatten array of { round_X: [...] } into a single object
            const rounds = Object.assign({}, ...rawData);

            return rounds; // Now an object like { round_0: [...], round_1: [...], ... }
          } else {
            agentFiles.splice(randomIndex, 1);
          }
        } catch (error) {
          agentFiles.splice(randomIndex, 1);
        }
      }

      throw new Error('No valid JSON agent decision files found');
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
    disableButton(submitButton);
    const checkboxes = document.querySelectorAll('.consent-checkboxes input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.style.cursor = 'pointer';
        checkbox.addEventListener('change', () => {
            if (Array.from(checkboxes).every(cb => cb.checked)) {
                enableButton(submitButton);
            } else {
                disableButton(submitButton);
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

    settings = getGameSettings().vars;
    rationalAgent = getAgent('rationalAgent');
    randomAgent = getAgent('randomAgent');
    leftyAgent = getAgent('leftyAgent');

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
    buttonToNewPage('nextButton2', 'INSTRUCTIONS3');//buttonToNewPage('nextButton2', 'TRAIN_P3');//
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
    document.getElementById('comparisonFreqINSTR6').innerHTML = settings.comparisonFrequency;
    document.getElementById('comparisonFreqINSTR6_2').innerHTML = settings.comparisonFrequency;
    buttonToNewPage('nextButton6', 'INSTRUCTIONS7');
}

function loadInstructions7() {
    document.getElementById('comparisonFreqINSTR7').innerHTML = settings.comparisonFrequency;
    buttonToNewPage('backButton7', 'INSTRUCTIONS6');
    buttonToNewPage('trainingButton3', 'TRAIN3');
}

function loadInstructions8() {
    buttonToNewPage('nextButton8', 'INSTRUCTIONS9');
}

function loadInstructions9() {
    document.getElementById('numberTurnsINSTR9').innerHTML = settings.moves;
    document.getElementById('numberRoundsINSTR9').innerHTML = Math.floor(settings.numberOfRounds / 4);
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
    buttonToNewPage('nextButton21', 'RATESELF');
}

function loadInstructions2_P2() {
    buttonToNewPage('nextButton22', 'INSTRUCTIONS9_P2');
}

function loadInstructions3_P2() {
    document.getElementById('target3_P2').innerHTML = targetName;
    document.getElementById('target3_P2_2').innerHTML = targetName;
    buttonToNewPage('nextButton23', 'INSTRUCTIONS4_P2');
}

function loadInstructions4_P2() {
    document.getElementById('target4_P2').innerHTML = targetName;
    character = targetName.includes('A') ? characteristics[0] : targetName.includes('B') ? characteristics[1] : characteristics[2];
    document.getElementById('player_description').innerHTML = character;
    buttonToNewPage('backButton24', 'INSTRUCTIONS3_P2');
    buttonToNewPage('nextButton24', 'GAME2');
}

function loadInstructions9_P2() {
    let backButton = document.getElementById('backButton29');
    let introTxt = document.getElementById('do-this-again');
    let playerChoice = document.getElementById('player-choice');
    if (currentPlayer == 1) {
      playerChoice.innerHTML = 'first (top)';
    } else if  (currentPlayer == 2) {
      introTxt.innerHTML = 'As before, we'
      playerChoice.innerHTML = 'second (middle)';
      backButton.classList.add('gone');
    } else {
      introTxt.innerHTML = 'Finally, again, we'
      playerChoice.innerHTML = 'third (bottom)';
      backButton.classList.add('gone');
    }
    buttonToNewPage('backButton29', 'INSTRUCTIONS2_P2');
    buttonToNewPage('nextButton29', 'SELECT_PARTNER');
}


function loadInstructions2_P3() {
    buttonToNewPage('nextButton32','INSTRUCTIONS3_P3');
}

function loadInstructions2_P3_REPEAT() {
    buttonToNewPage('nextButton32R','INSTRUCTIONS3_P3_REPEAT');
}

function loadInstructions3_P3() {
    document.getElementById('target3_P3').innerHTML = targetName;
    document.getElementById('comparisonFreqINSTR3_P3').innerHTML = settings.comparisonFrequency;
    document.getElementById('target3_P3_2').innerHTML = targetName;
    buttonToNewPage('backButton33','INSTRUCTIONS2_P3');
    buttonToNewPage('nextButton33','INSTRUCTIONS4_P3');
}

function loadInstructions3_P3_REPEAT() {
    document.getElementById('target3_P3_repeat').innerHTML = targetName;
    document.getElementById('target3_P3_repeat2').innerHTML = targetName;
    buttonToNewPage('backButton33R','INSTRUCTIONS2_P3_REPEAT');
    buttonToNewPage('nextButton33R','INSTRUCTIONS11_P3');
}

function loadInstructions4_P3() {
    document.getElementById('target4_P3').innerHTML = targetName;
    document.getElementById('comparisonFreqINSTR4_P3').innerHTML = settings.comparisonFrequency;
    buttonToNewPage('backButton34','INSTRUCTIONS3_P3');
    buttonToNewPage('nextButton34','INSTRUCTIONS5_P3');
}

function loadInstructions5_P3() {
    buttonToNewPage('backButton35','INSTRUCTIONS4_P3');
    buttonToNewPage('nextButton35','INSTRUCTIONS6_P3');
}

function loadInstructions6_P3() {
    document.getElementById('comparisonFreqINSTR6_P3').innerHTML = settings.comparisonFrequency;
    document.getElementById('comparisonFreqINSTR6_P3_2').innerHTML = settings.comparisonFrequency;
    buttonToNewPage('backButton36','INSTRUCTIONS5_P3');
    buttonToNewPage('nextButton36','TRAIN_P3');
}

function loadInstructions7_P3() {
    document.getElementById('target7_P3').innerHTML = targetName;
    buttonToNewPage('nextButton37','INSTRUCTIONS8_P3');
}

function loadInstructions8_P3() {
    buttonToNewPage('backButton38','INSTRUCTIONS7_P3');
    buttonToNewPage('nextButton38','INSTRUCTIONS9_P3');
}

function loadInstructions9_P3() {
    document.getElementById('target9_P3').innerHTML = targetName;
    buttonToNewPage('backButton39','INSTRUCTIONS8_P3');
    buttonToNewPage('nextButton39','INSTRUCTIONS10_P3');
}

function loadInstructions10_P3() {
    buttonToNewPage('backButton310','INSTRUCTIONS2_P3');
    buttonToNewPage('nextButton310','CHECK_P3');
}

function loadInstructions11_P3() {
    buttonToNewPage('nextButton311','GAME3');
}



function loadInstructions1_P4() {
    document.getElementById('target1_P4').innerHTML = targetName;
    buttonToNewPage('nextButton41', 'RATEOTHER');
}

function loadInstructions2_P4() {
    if (currentPlayer == 1) {
      buttonToNewPage('nextButton42','INSTRUCTIONS3_P4');
    } else {
      buttonToNewPage('nextButton42','INSTRUCTIONS3_P4_REPEAT');
    }
}

function loadInstructions3_P4() {
    document.getElementById('target3_P4').innerHTML = targetName;
    document.getElementById('comparisonFreqINSTR3_P4').innerHTML = settings.comparisonFrequency;
    document.getElementById('target3_P4_2').innerHTML = targetName;
    buttonToNewPage('backButton43','INSTRUCTIONS2_P4');
    buttonToNewPage('nextButton43','INSTRUCTIONS4_P4');
}

function loadInstructions3_P4_REPEAT() {
    document.getElementById('target3_REPEAT_P4').innerHTML = targetName;
    document.getElementById('comparisonFreqINSTR3_REPEAT_P4').innerHTML = settings.comparisonFrequency;
    document.getElementById('target3_REPEAT_P4_2').innerHTML = targetName;
    buttonToNewPage('backButton43R','INSTRUCTIONS2_P4');
    buttonToNewPage('nextButton43R','INSTRUCTIONS6_P4');
}

function loadInstructions4_P4() {
    document.getElementById('comparisonFreqINSTR4_P4').innerHTML = settings.comparisonFrequency;
    buttonToNewPage('backButton44','INSTRUCTIONS3_P4');
    buttonToNewPage('nextButton44','TRAIN_P4');
}

function loadInstructions5_P4() {
    document.getElementById('target5_P4').innerHTML = targetName;
    buttonToNewPage('nextButton45','INSTRUCTIONS6_P4');
}

function loadInstructions6_P4() {
    if (currentPlayer > 1) {
      buttonToNewPage('backButton46','INSTRUCTIONS3_P4_REPEAT');
      buttonToNewPage('nextButton46','INSTRUCTIONS8_P4');
    } else {
      buttonToNewPage('backButton46','INSTRUCTIONS5_P4');
      buttonToNewPage('nextButton46','INSTRUCTIONS7_P4');
    }
}

function loadInstructions7_P4() {
    buttonToNewPage('backButton46','INSTRUCTIONS6_P4');
    buttonToNewPage('nextButton47','CHECK_P4');
}

function loadInstructions8_P4() {
    buttonToNewPage('nextButton48','GAME4');
}


function loadTryAnother() {
    currentPlayer++;
    phase1Round++;
    phase2Round++;
    phase3Round++;
    phase4Round++;
    buttonToNewPage('nextButton_Try_Another','INSTRUCTIONS9_P2');
}



async function loadPhase1(numberOfMoves, numberOfRounds, historyRowNum, comparisonFrequency, training, rewarding, ids) {
      // — Get DOM ids —
    const {
      topInstruction:     topInstructionId,
      buttn:              buttonId,
      nextPage:           nextPageId,
      rowWrapper:         rowWrapperId,
      historyRowWrapper:  historyRowWrapperId,
      overlay:            overlayId,
      compareInfoBox:     compareInfoBoxId,
      lastXTrials:        lastXTrialsId,
      svgChart:           svgChartId,
      scoreInfoBox:       scoreInfoBoxId,
      scoreText:          scoreTextId,
      readTxt:            readTxtId,
    } = ids;

    // — DOM refs —
    const topInstruction     = topInstructionId ? document.getElementById(topInstructionId) : null;
    const nextBtn            = document.getElementById(buttonId);
    const rowWrapper         = document.getElementById(rowWrapperId);
    const historyRowWrapper  = document.getElementById(historyRowWrapperId);
    const overlay            = overlayId        ? document.getElementById(overlayId)        : null;
    const compareInfoBox     = compareInfoBoxId ? document.getElementById(compareInfoBoxId) : null;
    const lastXTrials        = lastXTrialsId    ? document.getElementById(lastXTrialsId)    : null;
    const svgChart           = svgChartId       ? d3.select('#' + svgChartId)               : null;
    const scoreInfoBox       = document.getElementById(scoreInfoBoxId);
    const scoreText          = document.getElementById(scoreTextId);
    const readTxt            = readTxtId        ? document.getElementById(readTxtId)        : null;

    // — Settings & state —
    const cols               = settings.cols;
    let   currentTrial       = 0;
    let   score              = 0;
    let   scoreSinceLastComp = 0;
    const historyRows        = historyRowNum;
    let   decision           = Array(numberOfMoves);
    let   rewardReceived     = Array(numberOfMoves);
    let   timeStamps         = Array(numberOfMoves);
    const maxAbsScore        = 200;

    let   newX = 0, newY = 0, startX = 0, startY = 0, dropCounter = 0;
    let   historyData        = [];

    let fillBar, label, x;
    let width = 0;
    let height = 0;
    if (svgChart) {
      width = svgChart.node().clientWidth;
      height = svgChart.node().clientHeight;
      if (!svgChart.node().chartInitialized) {
        svgChart.node().xScale = d3.scaleLinear()
          .domain([0, maxAbsScore])
          .range([0, width]);
        x = svgChart.node().xScale;
        svgChart.append("rect")
          .attr("class", "bar-bg")
          .attr("x", 0)
          .attr("y", height / 4)
          .attr("width", width)
          .attr("height", height / 2);  // Background bar
        svgChart.append("line")
          .attr("class", "zero-line")
          .attr("x1", x(0))
          .attr("x2", x(0))
          .attr("y1", 0)
          .attr("y2", height);          // Zero line
        svgChart.append("text")
          .attr("x", x(0))
          .attr("y", height + 15)
          .attr("text-anchor", "middle")
          .attr("font-size", "14px")
          .text("0");                   // Zero label
        svgChart.node().fillBar = svgChart.append("rect")
          .attr("class", "bar-fill")
          .attr("x", x(0))
          .attr("y", height / 4)
          .attr("width", 0)
          .attr("height", height / 2);  // Fill bar
        svgChart.node().label = svgChart.append("text")
          .attr("class", "bar-label")
          .attr("y", height / 2)
          .attr("x", x(0))
          .attr("dy", "0.35em")
          .attr("font-size", "14px")
          .text("You");                 // Bar label ("You")
        svgChart.append("text")
          .attr("x", x(maxAbsScore))
          .attr("y", height + 15)
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
          .text(maxAbsScore);            // Max label
        svgChart.append("text")
          .attr("x", x(maxAbsScore / 2))
          .attr("y", height + 15)
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
          .text(maxAbsScore / 2);        // Midpoint label
        svgChart.node().chartInitialized = true;
      }
      x = svgChart.node().xScale;
      fillBar = svgChart.node().fillBar;
      label = svgChart.node().label;
    }
    // — Compute sizes —
    const size   = Math.min(computeSmallSize(1, rowWrapper), 150);
    const smallSize = Math.min(computeSmallSize(historyRows, historyRowWrapper), 150);
    const margin = { left: 0, right: 0 };

    if (compareInfoBox) {
      compareInfoBox.classList.add("gone");
      compareInfoBox.style.cursor = 'pointer';
      compareInfoBox.style.pointerEvents = '';
      lastXTrials.innerHTML = (comparisonFrequency > 1) ? `${comparisonFrequency} trials` : `${comparisonFrequency} trial`;
      readTxt.classList.remove('gone');
      readTxt.classList.add('hidden');
    }

    if (!rewarding) {
      scoreInfoBox.classList.add("gone");
    }

    // Create one tile (adapted from your createSquare + click-handler)
    function createSquare(x) {
      const square = document.createElement('div');
      square.dataset.x = x;
      square.classList.add('square-finder', 'reward', 'hover-enabled', `reward${x}`);
      square.style.width  = square.style.height = `${size}px`;

      // add reward-score pseudo
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      const score = makeScore(square);
      score.setAttribute('data-type', 'score');
      score.classList.add('gone');
      pseudo.appendChild(score);
      square.appendChild(pseudo);

      // click → handleClick
      square.addEventListener('click', () => handleClick(square));
      return square;
    }

    function createSquareWithSize(x, y, size) {
      const square = document.createElement('div');
      square.dataset.x = 'h' + x;
      square.dataset.y = 'h' + y;
      square.classList.add('square-finder', 'reward', `reward${x}`);
      square.style.width  = square.style.height = `${size}px`;
      square.style.pointerEvents = 'none';
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      const score = makeScore(square);
      score.setAttribute('data-type', 'score');
      score.classList.add('gone');
      pseudo.appendChild(score);
      square.appendChild(pseudo);
      return square;
    }

    // Build the three zones
    function setupGrid() {
      // clear old
      nextBtn.classList.add('gone');
      rowWrapper.innerHTML = '';
      score = 0;
      scoreText.textContent = 'Score: 0';

      // rows as subrows
      const sub = document.createElement('div');
      sub.classList.add('subrow');
      for (let x = 0; x < cols; x++) {
        const sq = createSquare(x);
        sub.appendChild(sq);
        if (training && x !== 1) {
          sq.classList.add('grey','disabled');
        }
      }
      rowWrapper.appendChild(sub);
    }

    function setupHistoryGrid() {
      // clear old
      historyRowWrapper.innerHTML = '';
      currentRow = 0;

      // rows as subrows of two
      let sub = document.createElement('div');
      sub.classList.add('clipped-row-squares')
      for (let y = historyRows - 1; y >= 0; y--) {
        sub.dataset.row = historyRows - y - 1;
        sub.classList.add('history-subrow', 'gap-30', 'hidden');
        for (let x = 0; x < cols; x++) {
          const sq = createSquareWithSize(x, y, smallSize);
          sq.classList.add('grey','disabled');
          sq.style.pointerEvents = 'none';
          sub.appendChild(sq);
        }
        historyRowWrapper.appendChild(sub);
        sub = document.createElement('div');
      }
    }

    function updateHistory(x, reward) {
      // shift old data down
      historyData.unshift(Array(cols).fill({ grey: true, reward: null }));
      historyData[0][x] = { grey: false, reward: reward };
      // trim to historyRows
      if (historyData.length > historyRows) {
          historyData.pop();
      }
      renderHistory();
    }

    function renderHistory() {
      historyRowWrapper.innerHTML = '';
      for (let y = historyRows - 1; y >= 0; y--) {
          const sub = document.createElement('div');
          sub.dataset.row = historyRows - y - 1;
          sub.classList.add('history-subrow', 'gap-30');
          if (!historyData[y]) {
              sub.classList.add('hidden');
          }

          for (let x = 0; x < cols; x++) {
              const sq = createSquareWithSize(x, y, smallSize);
              if (!historyData[y] || historyData[y][x].grey) {
                  sq.classList.add('grey', 'disabled');
              } else {
                  sq.classList.remove('grey');
                  sq.classList.add(`reward${x}-clicked`);
                  const pseudo = sq.firstElementChild;
                  const scoreDisp = pseudo.querySelector('[data-type="score"]');
                  scoreDisp.classList.remove('gone');
                  scoreDisp.innerHTML = historyData[y][x].reward;
              }
              sub.appendChild(sq);
          }
          historyRowWrapper.appendChild(sub);
      }
    }

    function blockScreenForComparison(trial) {
      // Block every comparisonFrequency trials
      if (!compareInfoBox || trial == 0 || trial % comparisonFrequency !== 0) return; // Only run on trials 1, 3, 5, ...

      compareInfoBox.classList.remove("gone");
      updateDifferenceBar(scoreSinceLastComp);

      overlay.classList.remove("gone");
      document.body.style.cursor = 'none !important';
      overlay.style.display = 'block';

      // Disable clicks initially
      compareInfoBox.style.pointerEvents = "none";
      setTimeout(() => {
        readTxt.classList.remove('hidden');
        compareInfoBox.style.pointerEvents = "auto";
        // Remove previous listeners to avoid stacking
        compareInfoBox.onclick = function() {
          compareInfoBox.classList.add("gone");
          overlay.classList.add('gone');
        };
      }, 1000);
      scoreSinceLastComp = 0;
    }

    // Handle click on any focus-row tile
    function handleClick(square) {
      if (square.style.pointerEvents === 'none') return;

      const x = +square.dataset.x;
      decision[currentTrial] = x;
      timeStamps[currentTrial] = new Date().toISOString();

      const pseudo = square.firstElementChild;
      const scoreDisp = pseudo.querySelector('[data-type="score"]');

      let reward = 0;
      const shouldReward = !(training && !rewarding);

      if (shouldReward) {
        square.classList.remove(`reward${x}`);
        square.classList.add(`reward${x}-clicked`);
        if (training) {
          reward = (numberOfMoves - currentTrial) * 10;
          if (compareInfoBox && numberOfMoves - currentTrial == 1) {
            reward = numberOfMoves * 10;
          }
        } else {
          reward = Math.round(settings.chanceToWin[((phase1Round - 1) * numberOfMoves + currentTrial)][0][x] * 100);
        }
        scoreDisp.classList.remove('gone');
        scoreDisp.classList.remove('animate');
        void scoreDisp.offsetWidth; // force reflow
        scoreDisp.classList.add('animate');
        scoreDisp.innerHTML = reward;
        score += reward;
        scoreSinceLastComp += reward;
        scoreText.textContent = `Score: ${score}`;
      } else {
        square.classList.add('white');
        scoreDisp.classList.add('gone');
      }
      rewardReceived[currentTrial] = reward;

      updateHistory(x, reward);
      // Disable all tiles immediately to prevent further clicks
      Array.from(rowWrapper.querySelector(`.subrow`).children)
        .forEach(sq => {
        sq.style.pointerEvents = 'none';
      });

      // Wait 700ms before animating
      setTimeout(() => {
        square.classList.add(`reward${x}`);
        square.classList.remove(`reward${x}-clicked`);
        square.classList.remove('white');
        if (currentTrial >= numberOfMoves - 1) {
          if (!training) {
            scoresSoFar.push(score);
          }
          nextBtn.classList.remove('gone');
          nextBtn.classList.remove('hidden');
          if(topInstruction) {
            topInstruction.innerHTML = 'Click Next to continue'
          }
          saveData(decision, rewardReceived, timeStamps);
          Array.from(rowWrapper.querySelector(`.subrow`).children).forEach(sq => {sq.classList.add('grey');});
          if (phase1Round == numberOfRounds) {
            buttonToNewPage(buttonId, nextPageId);
          } else {
            buttonToNewPage(buttonId, 'DISP');
          }
        } else {
          currentTrial++;
          blockScreenForComparison(currentTrial);
          Array.from(rowWrapper.querySelector(`.subrow`).children)
            .forEach(sq => {
              sq.style.pointerEvents = 'auto';
          });
        }
      }, 900);
    }

    function updateDifferenceBar(value) {
      // compute new bar position & width
      const newX = value >= 0 ? x(0) : x(value);
      const newW = Math.abs(x(value) - x(0));

      fillBar.transition()
        .duration(1000)
        .attr("x", newX)
        .attr("width", newW);

      const lblWidth = label.node().getBBox().width;

      let lx, anchor, color;

      if (value >= 0) {
        if (newW >= lblWidth + 10) {
          // inside the bar, right-aligned, white text
          lx     = x(0) + newW - 5;
          anchor = "end";
          color  = "white";
        } else {
          // outside to the right, black text
          lx     = x(value) + 5;
          anchor = "start";
          color  = "black";
        }
      } else {
        if (newW >= lblWidth + 10) {
          // inside the bar, left-aligned, white text
          lx     = x(0) - newW + 5;
          anchor = "start";
          color  = "white";
        } else {
          // outside to the left, black text
          lx     = x(value) - 5;
          anchor = "end";
          color  = "black";
        }
      }

      label.transition()
        .duration(1000)
        .attr("x", lx)
        .attr("text-anchor", anchor)
        .attr("fill", color);
    }

    function saveData(decisionArr, rewardArr, timeArr) {
      const data = {};
      decisionArr.forEach((sq, idx) => {
        data[idx] = {
          trial:     idx,
          decision:  sq,
          reward:    rewardArr[idx],
          timestamp: timeArr[idx]
        };
      });
      sessionStorage.setItem("Stage1Round" + phase1Round, JSON.stringify(data));
    }

    renderHistory();
    setupGrid();
}

async function loadPhase2(numberOfMoves, numberOfRounds, historyRowNum, training, ids) {
      // — Get DOM ids —
    const {
      topInstruction:     topInstructionId,
      buttn:              buttonId,
      nextPage:           nextPageId,
      rowWrapper:         rowWrapperId,
      historyRowWrapper:  historyRowWrapperId,
      stop:               stopId,
      comparisonTarget:   comparisonTargetImId
    } = ids;

    // — DOM refs —
    const topInstruction      = topInstructionId ? document.getElementById(topInstructionId) : null;
    const rowWrapper          = document.getElementById(rowWrapperId);
    const historyRowWrapper  = document.getElementById(historyRowWrapperId);
    const stopIcon            = document.getElementById(stopId);
    const comparisonTargetIm  = document.getElementById(comparisonTargetImId);
    let   nextBtn             = document.getElementById(buttonId);

    // — Settings & state —
    const bigSizeScale    = 1.2;
    const cols            = settings.cols;
    const historyRows     = 10;
    let   score           = 0;
    let   decision        = Array(numberOfMoves);
    let   timeStamps      = Array(numberOfMoves);
    let   autoMode        = true;
    let   movesMade       = 0;
    let   historyData     = [];
    let rewards_prepped = [43, 44, 83].map(n => n + (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 4));

    const agent = targetName.includes('A') ? randomAgent : targetName.includes('B') ? leftyAgent : targetName.includes('C') ? rationalAgent : undefined;

    // — Compute sizes —
    const size = Math.min(computeSmallSize(1, rowWrapper), 150);
    const smallSize = Math.min(computeSmallSize(historyRows, historyRowWrapper), 150);
    const bigSize   = bigSizeScale * smallSize;
    stopIcon.classList.remove('hidden');
    if (!training) {
      var imFileName = targetName.replace(/\s+/g, '-');
      comparisonTargetIm.src = `./static/${imFileName}-desc.png`;
    }
    if(topInstruction) {
      topInstruction.innerHTML = "Watch each card being selected";
    }
    comparisonTargetIm.classList.remove('gone');
    nextBtn.classList.add('gone');

    function makeDecisions() {
      const interval = setInterval(() => {
        const squares = rowWrapper.querySelector(`.subrow`).querySelectorAll('.square-finder');
        let idx;
        if (training) {
          idx = 1;
        } else {
          idx = movesMade;
        }
        handleClick(squares[idx]);
        movesMade++;

        if (movesMade >= numberOfMoves - 1) {
          clearInterval(interval);
          setInterval(() => {
            autoMode = false;
          }, 700);
        }
      }, 1100);
    }

    function createSquare(x, y) {
      const square = document.createElement('div');
      square.dataset.x = x;
      square.dataset.y = y;
      square.classList.add('square-finder', 'reward', `reward${x}`, 'grey');
      square.style.width  = square.style.height = `${size}px`;

      // add reward-score pseudo
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      
      const score = makeScore(square);
      score.setAttribute('data-type', 'score');
      score.classList.add('gone','animate');
      
      const tick = makeTick();
      tick.setAttribute('data-type', 'tick');
      tick.classList.add('gone','animate');

      const cross = makeCross();
      cross.setAttribute('data-type', 'cross');
      cross.classList.add('gone','animate');
      
      pseudo.appendChild(score);
      pseudo.appendChild(tick);
      pseudo.appendChild(cross);
      square.appendChild(pseudo);

      square.addEventListener('click', e => handleClick(square, e));
      square.style.pointerEvents = 'none';
      return square;
    }

    function createSquareWithSize(x, y, size) {
      const square = document.createElement('div');
      square.dataset.x = 'h' + x;
      square.dataset.y = 'h' + y;
      square.classList.add('square-finder', 'reward', `reward${x}`);
      square.style.width  = square.style.height = `${smallSize}px`;
      square.style.pointerEvents = 'none';
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      const score = makeScore(square);
      score.setAttribute('data-type', 'score');
      score.classList.add('gone');
      pseudo.appendChild(score);
      square.appendChild(pseudo);
      return square;
    }

    // Build the three zones
    function setupGrid() {
      // clear old
      nextBtn.classList.add('gone');
      rowWrapper.innerHTML = '';

      // rows as subrows
      const sub = document.createElement('div');
      sub.classList.add('subrow','disabled');
      for (let x = 0; x < cols; x++) {
        const sq = createSquare(x);
        sub.appendChild(sq);
      }
      rowWrapper.appendChild(sub);
    }

    function setupHistoryGrid() {
      // clear old
      historyRowWrapper.innerHTML = '';

      // rows as subrows of two
      let sub = document.createElement('div');
      sub.classList.add('clipped-row-squares')
      for (let y = historyRows - 1; y >= 0; y--) {
        sub.dataset.row = historyRows - y - 1;
        sub.classList.add('history-subrow_P2', 'gap-30', 'hidden');
        for (let x = 0; x < cols; x++) {
          const sq = createSquareWithSize(x, y, smallSize);
          sq.classList.add('grey','disabled');
          sq.style.pointerEvents = 'none';
          sub.appendChild(sq);
        }
        historyRowWrapper.appendChild(sub);
        sub = document.createElement('div');
      }
    }

    function updateHistory(x, reward) {
      // shift old data down
      historyData.unshift(Array(cols).fill({ grey: true, reward: null }));
      historyData[0][x] = { grey: false, reward: reward };
      // trim to historyRows
      if (historyData.length > historyRows) {
          historyData.pop();
      }
      renderHistory();
    }

    function renderHistory() {
      historyRowWrapper.innerHTML = '';
      for (let y = historyRows - 1; y >= 0; y--) {
          const sub = document.createElement('div');
          sub.dataset.row = historyRows - y - 1;
          sub.classList.add('history-subrow', 'gap-30');
          if (!historyData[y]) {
              sub.classList.add('hidden');
          }

          for (let x = 0; x < cols; x++) {
              const sq = createSquareWithSize(x, y, smallSize);
              if (!historyData[y] || historyData[y][x].grey) {
                  sq.classList.add('grey', 'disabled');
              } else {
                  sq.classList.remove('grey');
                  sq.classList.add(`reward${x}-clicked`);
                  const pseudo = sq.firstElementChild;
                  const scoreDisp = pseudo.querySelector('[data-type="score"]');
                  scoreDisp.classList.remove('gone');
                  scoreDisp.innerHTML = historyData[y][x].reward;
              }
              sub.appendChild(sq);
          }
          historyRowWrapper.appendChild(sub);
      }
    }

    // Handle click on any focus-row tile
    function handleClick(square, event) {
      let isLast = movesMade === numberOfMoves - 1;
      let isPenultimate = movesMade === numberOfMoves - 2;

      if (autoMode && !isLast && event?.isTrusted) {
        return;
      }

      const x = +square.dataset.x;
      decision[movesMade] = x;
      timeStamps[movesMade] = new Date().toISOString();

      const pseudo = square.firstElementChild;
      const scoreDisp = pseudo.querySelector('[data-type="score"]');
      const tick = pseudo.querySelector('[data-type="tick"]');
      const cross = pseudo.querySelector('[data-type="cross"]');

      requestAnimationFrame(() => {
        square.classList.remove(`reward${x}`, 'grey');
        square.classList.add(`reward${x}-clicked`);
      });

      let reward = rewards_prepped[movesMade];
      if (training) {
        reward = 50;
      }
      if (!isLast) {
        updateHistory(x, reward);
      }

      const squares = rowWrapper.querySelector(`.subrow`).querySelectorAll('.square-finder')
      let correct = true;

      // Wait 700ms before animating
      setTimeout(() => {
        square.classList.add(`reward${x}`,'grey');
        square.classList.remove(`reward${x}-clicked`);
        // Hide the stop icon as soon as the penultimate row moves into focus
        if (isPenultimate) {
          rowWrapper.querySelector(`.subrow`).classList.remove('disabled');
          stopIcon.classList.add('hidden');
          if(topInstruction) {
            topInstruction.innerHTML = "Predict which card " + targetName + " selected next";
            if (targetName.includes('A')) {
              topInstruction.innerHTML = "Predict which card " + targetName + " selected next.<br>Any card will do, because this Player selects cards randomly.";
            }
          }
          squares.forEach(sq => {
            sq.classList.remove('grey');
            sq.classList.add('hover-enabled')
            sq.style.pointerEvents = 'auto';
          });
        }
        // If final click, allow click
        if (isLast) {
          nextBtn.classList.remove('gone');
          squares.forEach((sq) => {
            sq.classList.add('disabled');
            sq.style.pointerEvents = 'none';
          });
          if(topInstruction) {
            topInstruction.innerHTML = 'Click Next to continue'
          }
          saveData(decision, timeStamps);

          const targetPage = correct
            ? nextPageId
            : 'DISP_P2';
          return buttonToNewPage(buttonId, targetPage);
        }
      }, 900);

      if (isLast) {
        if (!training) {
          actuallyChosen = targetName.includes('A') ? x : targetName.includes('B') ? 0 : 2;
          correct = (x == actuallyChosen);
          previousRoundCorrect_P2 = correct;
        }
        if (!training) {
          scoresSoFar_P2.push(correct);
        }
        if (correct) {
          square.classList.add('greenish');
          tick.classList.remove('gone');
          squares.forEach((sq) => {
            const id = +sq.dataset.x; // coerce to number
            if (training) {
              if (id !== x) {
                sq.classList.add('grey');
              }
            } else {
              if (id !== actuallyChosen) {
                sq.classList.add('grey');
              }
            }
          });
        } else {
          square.classList.add('white');
          cross.classList.remove('gone');

          // reveal true selection
          setTimeout(() => {
            squares.forEach((sq) => {
              if(topInstruction) {
                topInstruction.innerHTML = 'Click Next to continue'
              }
              const id = +sq.dataset.x; // coerce to number
              if (id === actuallyChosen) {
                const actualTick = sq.firstElementChild.querySelector('[data-type="tick"]');
                sq.classList.add('greenish');
                actualTick.classList.remove('gone');
              } else {
                sq.classList.add('grey');
              }
            });
          }, 500);
        }
      } else {
        // Reset animation and show new score
        scoreDisp.classList.add('gone');
        scoreDisp.classList.remove('animate');
        void scoreDisp.offsetWidth; // trigger reflow
        scoreDisp.innerHTML = reward;
        scoreDisp.classList.remove('gone');
        scoreDisp.classList.add('animate');
      }
    }

    function saveData(decisionArr, timeArr) {
      const data = {};
      decisionArr.forEach((sq, idx) => {
        data[idx] = {
          player:   targetName,
          decision: sq,
          timestamp: timeArr[idx]
        };
      });
      sessionStorage.setItem("Stage2Round" + phase2Round, JSON.stringify(data));
    }

    // Initialise and draw
    setupGrid();
    setTimeout(() => { makeDecisions(); }, 2000);
}

function loadPhase3(numberOfMoves, numberOfRounds, comparisonFrequency, training, ids) {
    // — Get DOM ids —
    const {
      topInstruction:     topInstructionId,
      buttn:              buttonId,
      submitBttn:         submitButtonId,
      submitBttnWrap:     submitButtonWrapId,
      nextPage:           nextPageId,
      rowWrapper:         rowWrapperId,
      historyRowWrapper:  historyRowWrapperId,
      pickUpWrapper:      pickUpWrapperId,
      pickUpRowWrapper:   pickUpRowWrapperId,
      overlay:            overlayId,
      compareInfoBox:     compareInfoBoxId,
      lastXTrials:        lastXTrialsId,
      scorePlayer:        scorePlayerId,
      otherName:          otherNameId,
      otherName2:         otherName2Id,
      scoreOther:         scoreOtherId,
      moreOrLessTxt:      moreOrLessTxtId,
      svgChart:           svgChartId,
      comparisonTarget:   comparisonTargetImId
    } = ids;

    // — DOM refs —
    const topInstruction     = topInstructionId ? document.getElementById(topInstructionId) : null;
    const nextBtn            = document.getElementById(buttonId);
    const submitBtn          = document.getElementById(submitButtonId);
    const submitBttnWrap     = document.getElementById(submitButtonWrapId);
    const rowWrapper         = document.getElementById(rowWrapperId);
    const historyRowWrapper  = document.getElementById(historyRowWrapperId);
    const pickUpWrapper      = document.getElementById(pickUpWrapperId);
    const pickUpRowWrapper   = document.getElementById(pickUpRowWrapperId);
    const overlay            = document.getElementById(overlayId);
    const compareInfoBox     = document.getElementById(compareInfoBoxId);
    const lastXTrials        = document.getElementById(lastXTrialsId);
    const scorePlayer        = document.getElementById(scorePlayerId);
    const otherName          = document.getElementById(otherNameId);
    const otherName2         = document.getElementById(otherName2Id);
    const scoreOther         = document.getElementById(scoreOtherId);
    const moreOrLessTxt      = document.getElementById(moreOrLessTxtId);
    const svgChart           = d3.select('#' + svgChartId);
    const comparisonTargetIm = document.getElementById(comparisonTargetImId);

    // — Settings & state —
    const bigSizeScale       = 1.2;
    const historyRows        = 10;
    const cols               = settings.cols;
    let   currentTrial       = 0;
    let   score              = 0;
    let   scoreSinceLastComp = 0;
    let   correctCount       = 0;
    let   trialCardsPlayer   = Array(comparisonFrequency);
    let   belowSubrows       = [];
    let   usedIndices        = new Set();

    let   cardSelected       = Array(numberOfMoves);
    let   rewardReceived     = Array(numberOfMoves);
    let   iconDropped        = Array(numberOfMoves);
    let   timeStampsSelected = Array(numberOfMoves);
    let   timeStampsDropped  = Array(numberOfMoves);

    const agent = targetName.includes('A') ? randomAgent : targetName.includes('B') ? leftyAgent : targetName.includes('C') ? rationalAgent : undefined;

    let newX = 0, newY = 0, startX = 0, startY = 0, dropCounter = 0;
    let historyData        = [];

    if (!training) {
      var imFileName = targetName.replace(/\s+/g, '-');
      comparisonTargetIm.src = `./static/${imFileName}-desc.png`;
    }
    comparisonTargetIm.classList.remove('gone');

    // — initialize the chart —
    otherName.innerHTML = training ? "Player X" : targetName;
    otherName2.innerHTML = training ? "Player X" : targetName;
    const otherNameLabel = training ? "Player X" : targetName;
    const width = svgChart.node().clientWidth;
    const height = svgChart.node().clientHeight;
    const margin = { left: 0, right: 0 };
    const maxAbsScore = 150;            // start small, will expand if needed
    var imFileName = training ? "player-X" : targetName.replace(/\s+/g, '-');
    pickUpWrapper.querySelectorAll('img').forEach(i => {i.src = `./static/${imFileName}.png`});

    let fillBar, label, x;
    if (!svgChart.node().chartInitialized) {
        svgChart.node().xScale = d3.scaleLinear()
           .domain([-maxAbsScore, maxAbsScore])
           .range([0, width]);
        x = svgChart.node().xScale;
        svgChart.append("rect")                  // draw a light background bar (full width)
          .attr("class", "bar-bg")
          .attr("x", 0)
          .attr("y", height/4)
          .attr("width", width)
          .attr("height", height/2);
        svgChart.append("line")                  // draw a zero line
          .attr("class", "zero-line")
          .attr("x1", x(0))
          .attr("x2", x(0))
          .attr("y1", 0)
          .attr("y2", height);
        svgChart.node().fillBar = svgChart.append("rect")  // the actual fill bar (initially zero length)
          .attr("class", "bar-fill")
          .attr("x", x(0))
          .attr("y", height/4)
          .attr("width", 0)
          .attr("height", height/2);
        svgChart.append("text")                  // You label (center side)
          .attr("x", x(0))
          .attr("y", height + 15)
          .attr("text-anchor", "middle")
          .attr("fill", "black")
          .attr("font-size", "14px")
          .text("You");
        svgChart.node().label = svgChart.append("text")    // bar label
          .attr("class", "bar-label")
          .attr("y", height / 2)
          .attr("x", x(0))
          .attr("dy", "0.35em")
          .attr("font-size", "14px")
          .text(otherNameLabel);
        svgChart.append("text")                  // Max label (right side)
          .attr("x", x(maxAbsScore))
          .attr("y", height + 15)
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
          .text(maxAbsScore);
        svgChart.append("text")                  // Min label (left side)
          .attr("x", x(-maxAbsScore))
          .attr("y", height + 15) // Below the bar
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
          .text("-" + maxAbsScore);
        svgChart.append("text")
          .attr("x", x(-maxAbsScore/2))
          .attr("y", height + 15)
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")        // Mid label (left side)
          .text(-maxAbsScore/2);
        svgChart.append("text")
          .attr("x", x(maxAbsScore/2))
          .attr("y", height + 15)
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")        // Mid label (right side)
          .text(maxAbsScore/2);
        svgChart.node().chartInitialized = true;
    }
    x = svgChart.node().xScale;
    fillBar = svgChart.node().fillBar;
    label = svgChart.node().label;

    // — Compute sizes and reset —
    const size   = Math.min(computeSmallSize(1, rowWrapper), 150);
    const smallSize = Math.min(computeSmallSize(historyRows, historyRowWrapper), 150);
    const bigSize   = bigSizeScale * smallSize;
    const originalImageStyles = new Map();

    compareInfoBox.classList.add('gone');
    lastXTrials.innerHTML = (comparisonFrequency > 1) ? `${comparisonFrequency} trials` : `${comparisonFrequency} trial`;
    pickUpRowWrapper.classList.add('gone');
    submitBtn.replaceWith(submitBtn.cloneNode(true));
    const newSubmitBtn = document.getElementById(submitButtonId);
    newSubmitBtn.addEventListener('click', () => submitGuess());

    function createSquare(x) {
      const square = document.createElement('div');
      square.dataset.x = x;
      square.classList.add('square-finder', 'reward', 'hover-enabled', `reward${x}`);
      square.style.width  = square.style.height = `${size}px`;

      // add reward-star pseudo
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      const score = makeScore(square);
      score.setAttribute('data-type', 'score');
      score.classList.add('gone', 'animate');
      pseudo.appendChild(score);
      square.appendChild(pseudo);

      // click → handleClick
      square.addEventListener('click', () => handleClick(square));
      return square;
    }

    function createSquareWithSize(x, y, size) {
      const square = document.createElement('div');
      square.dataset.x = 'h' + x;
      square.dataset.y = 'h' + y;
      square.classList.add('square-finder', 'reward', `reward${x}`);
      square.style.width  = square.style.height = `${size}px`;
      square.style.pointerEvents = 'none';
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      const score = makeScore(square);
      score.setAttribute('data-type', 'score');
      score.classList.add('gone');
      pseudo.appendChild(score);
      square.appendChild(pseudo);
      return square;
    }
    
    function createDragDropSquare(x) {
      const square = document.createElement('div');
      square.dataset.x = x;
      square.classList.add('square-finder', 'reward', 'normal-cursor', `reward${x}`);
      const smallerSize = 0.6 * size;
      square.style.width  = square.style.height = `${smallerSize}px`;
      return square;
    }

    // Build the three zones
    function setupGrid() { // clear old
      nextBtn.classList.add('gone');
      rowWrapper.innerHTML = '';
      score = 0;

      // rows as subrows
      const sub = document.createElement('div');
      sub.classList.add('subrow');
      for (let x = 0; x < cols; x++) {
        const sq = createSquare(x);
        sub.appendChild(sq);
      }
      rowWrapper.appendChild(sub);

      pickUpRowWrapper.innerHTML = '';
      const pickUpSub = document.createElement('div');
      pickUpSub.classList.add('subrow');
      for (let x = 0; x < cols; x++) {
        const sq = createDragDropSquare(x);
        sq.classList.add('pick-up-square');
        pickUpSub.appendChild(sq);
      }

      pickUpRowWrapper.appendChild(pickUpSub);
    }

    function setupHistoryGrid() {
      // clear old
      historyRowWrapper.innerHTML = '';
      currentRow = 0;

      // rows as subrows of two
      let sub = document.createElement('div');
      sub.classList.add('clipped-row-squares')
      for (let y = historyRows - 1; y >= 0; y--) {
        sub.dataset.row = historyRows - y - 1;
        sub.classList.add('history-subrow_P3', 'gap-30', 'hidden');
        for (let x = 0; x < cols; x++) {
          const sq = createSquareWithSize(x, y, smallSize);
          sq.classList.add('grey','disabled');
          sq.style.pointerEvents = 'none';
          sub.appendChild(sq);
        }
        historyRowWrapper.appendChild(sub);
        sub = document.createElement('div');
      }
    }

    function updateHistory(x, reward) {
      // shift old data down
      historyData.unshift(Array(cols).fill({ grey: true, reward: null }));
      historyData[0][x] = { grey: false, reward: reward };

      // trim to historyRows
      if (historyData.length > historyRows) {
          historyData.pop();
      }

      renderHistory();
    }

    function renderHistory() {
      historyRowWrapper.innerHTML = '';
      for (let y = historyRows - 1; y >= 0; y--) {
          const sub = document.createElement('div');
          sub.dataset.row = historyRows - y - 1;
          sub.classList.add('history-subrow_P3', 'gap-30');
          if (!historyData[y]) {
              sub.classList.add('hidden');
          }

          for (let x = 0; x < cols; x++) {
              const sq = createSquareWithSize(x, y, smallSize);
              if (!historyData[y] || historyData[y][x].grey) {
                  sq.classList.add('grey', 'disabled');
              } else {
                  sq.classList.remove('grey');
                  sq.classList.add(`reward${x}-clicked`);
                  const pseudo = sq.firstElementChild;
                  const scoreDisp = pseudo.querySelector('[data-type="score"]');
                  scoreDisp.classList.remove('gone');
                  scoreDisp.innerHTML = historyData[y][x].reward;
              }
              sub.appendChild(sq);
          }
          historyRowWrapper.appendChild(sub);
      }
    }

    function blockScreenForComparison(trial) {
      dropCounter = 0;
      compareInfoBox.classList.remove('gone');
      let otherScoreSinceLastComp = 0;

      const round = phase1Round + phase2Round + phase3Round;
      for (let i = 0; i < comparisonFrequency; i++) {
        const t = trial - i;
        let reward = agent[`round_${round}`]?.[t]?.reward || 0;
        trialCardsPlayer[i] = agent[`round_${round}`]?.[t]?.decision;
        otherScoreSinceLastComp += reward;
      }

      // If in training, override rewardSum with training logic
      if (training) {
        otherScoreSinceLastComp = scoreSinceLastComp;
      }
      diff = otherScoreSinceLastComp - scoreSinceLastComp;
      moreOrLessTxt.innerHTML = (diff > 0) ? 'this much more than' : ((diff == 0) ? 'the same as' : 'this much less than');
      updateDifferenceBar(diff);

      overlay.classList.remove('gone');
      pickUpWrapper.classList.remove('gone');
      const pickUpSquares = pickUpRowWrapper.querySelectorAll('.pick-up-square');
      pickUpWrapper.querySelectorAll('img').forEach(i => {
          i.className= "";
          i.classList.add('drag-drop-im');
          i.onmousedown = e => mouseDownDrag(e, i, pickUpSquares);
          if (!originalImageStyles.has(i)) {
            originalImageStyles.set(i, {
              top: i.style.top,
              left: i.style.left,
              parent: i.parentNode,
              index: Array.from(i.parentNode.children).indexOf(i)
            });
          } else {
            const orig = originalImageStyles.get(i);
            i.style.top = orig.top;
            i.style.left = orig.left;
          }
      });
      document.body.style.cursor = 'none !important';
      overlay.style.display = 'block';
      scoreSinceLastComp = 0;
    }

    function mouseDownDrag(e, img, pickUpSquares) {
      img.classList.remove('drag-drop-im');
      img.classList.add('drag-drop-im-grabbed');
      e.preventDefault(); // Prevent text/image selection during drag

      const rect = img.getBoundingClientRect();
      const centerOffsetX = rect.width / 2;
      const centerOffsetY = rect.height / 2;

      const placeholder = document.createElement('div');
      placeholder.classList.add('drag-drop-im');
      placeholder.style.visibility = 'hidden';
      img.parentNode.insertBefore(placeholder, img);

      function mouseMoveHandler(e) {
        img.style.top = (e.clientY - centerOffsetY) + 'px';
        img.style.left = (e.clientX - centerOffsetX) + 'px';

        // Highlight drop targets
        pickUpSquares.forEach(square => {
          const box = square.getBoundingClientRect();
          const inside =
            e.clientX >= box.left &&
            e.clientX <= box.right &&
            e.clientY >= box.top &&
            e.clientY <= box.bottom;
          square.classList.toggle('glow', inside);
        });
      }

      function mouseUpHandler(upEvent) {
        let dropped = false;

        pickUpSquares.forEach(square => {
          const box = square.getBoundingClientRect();
          const inside =
            upEvent.clientX >= box.left &&
            upEvent.clientX <= box.right &&
            upEvent.clientY >= box.top &&
            upEvent.clientY <= box.bottom;

          if (inside && !dropped) {
            const x = +square.dataset.x;
            if (checkCorrect(x)) {
              correctCount++;
            }
            iconDropped[currentTrial-comparisonFrequency+dropCounter] = x;
            timeStampsDropped[currentTrial-comparisonFrequency+dropCounter] = new Date().toISOString();
            dropCounter++;
            // Shrink the image and place it in the square
            img.classList.remove('drag-drop-im-grabbed');
            img.classList.add('drag-drop-im-dropped');

            // Count existing images in this square
            const existingImgs = square.querySelectorAll('img').length;
            let offsetX = 0;
            if (existingImgs > 0) { 
              offsetX = 45; // spacing between small images
            }
            img.style.top = '0px';
            img.style.left = offsetX + 'px';

            square.appendChild(img);
            dropped = true;

            if (dropCounter == 2) {
              submitBttnWrap.classList.remove('gone');
            }
          }
        });

        // If not dropped inside any square, revert position
        if (!dropped) {
          placeholder.replaceWith(img); // put image back if needed
          img.classList.remove('drag-drop-im-grabbed');
          img.classList.add('drag-drop-im');

          const orig = originalImageStyles.get(img);
          img.style.top = orig.top;
          img.style.left = orig.left;
        }

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        pickUpSquares.forEach(square => square.classList.remove('glow'));
      }

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);

      img.style.top = (e.clientY - centerOffsetY) + 'px';
      img.style.left = (e.clientX - centerOffsetX) + 'px';
    }

    function checkCorrect(x) {
      let correct = false;

      // Look back up to comparisonFrequency trials
      for (let i = 0; i < comparisonFrequency; i++) {
        let idx = currentTrial - i;

        // Skip if we've already used this index
        if (usedIndices.has(idx)) continue;

        // Choose the array depending on training
        let arr = training ? cardSelected : trialCardsPlayer;

        if (arr[idx] === x) {
          correct = true;
          correctCount++;
          usedIndices.add(idx);  // Mark this index as "consumed"
          break;                 // Stop after first valid match
        }
      }

      return correct;
    }

    function handleClick(square) {
      if (square.style.pointerEvents === 'none') return;

      const x = +square.dataset.x;
      cardSelected[currentTrial] = x;
      timeStampsSelected[currentTrial] = new Date().toISOString();

      const pseudo = square.firstElementChild;
      const scoreDisp = pseudo.querySelector('[data-type="score"]');

      square.classList.remove(`reward${x}`);
      square.classList.add(`reward${x}-clicked`);
      reward = Math.round(settings.chanceToWin[((phase1Round + phase2Round + phase3Round -1) * numberOfMoves + currentTrial)][0][x] * 100);
      if (training) {
        reward = (numberOfMoves - currentTrial) * 10;
      }
      scoreDisp.classList.remove('gone');
      scoreDisp.classList.remove('animate');
      void scoreDisp.offsetWidth; // force reflow
      scoreDisp.classList.add('animate');
      scoreDisp.innerHTML = reward;
      score += reward;
      scoreSinceLastComp += reward;
      rewardReceived[currentTrial] = reward;

      updateHistory(x, reward);
      // Disable all tiles immediately to prevent further clicks
      Array.from(rowWrapper.querySelector(`.subrow`).children)
        .forEach(sq => {
        sq.style.pointerEvents = 'none';
      });

      // Wait 700ms before animating
      setTimeout(() => {
        square.classList.add(`reward${x}`);
        square.classList.remove(`reward${x}-clicked`);
        square.classList.remove('white');

        if ((currentTrial+1) % comparisonFrequency == 0) {
          pickUpRowWrapper.classList.remove('gone');
          const pickUpSquares = pickUpRowWrapper.querySelectorAll('.pick-up-square');
          blockScreenForComparison(currentTrial);
        }
        currentTrial++;
        Array.from(rowWrapper.querySelector(`.subrow`).children)
          .forEach(sq => {
            sq.style.pointerEvents = 'auto';
        });
      }, 900);
    }

    function updateDifferenceBar(value) {
      // compute new bar position & width
      const newX = value >= 0 ? x(0) : x(value);
      const newW = Math.abs(x(value) - x(0));

      fillBar.transition()
        .duration(1000)
        .attr("x", newX)
        .attr("width", newW);

      const lblWidth = label.node().getBBox().width;

      let lx, anchor, color;

      if (value >= 0) {
        if (newW >= lblWidth + 10) {
          // inside the bar, right-aligned, white text
          lx     = x(0) + newW - 5;
          anchor = "end";
          color  = "white";
        } else {
          // outside to the right, black text
          lx     = x(value) + 5;
          anchor = "start";
          color  = "black";
        }
      } else {
        if (newW >= lblWidth + 10) {
          // inside the bar, left-aligned, white text
          lx     = x(0) - newW + 5;
          anchor = "start";
          color  = "white";
        } else {
          // outside to the left, black text
          lx     = x(value) - 5;
          anchor = "end";
          color  = "black";
        }
      }

      label.transition()
        .duration(1000)
        .attr("x", lx)
        .attr("text-anchor", anchor)
        .attr("fill", color);
    }

    function submitGuess() {
      document.querySelectorAll('.drag-drop-im[style*="visibility: hidden"]').forEach(p => p.remove());
      const pickUpSquares = pickUpRowWrapper.querySelectorAll('.pick-up-square');
      pickUpSquares.forEach(sq => {
        sq.querySelectorAll('img').forEach(img => img.remove());
      });
      originalImageStyles.forEach((data, img) => {
          if (img.parentNode !== data.parent) {
              if (data.index >= data.parent.children.length) {
                  data.parent.appendChild(img);
              } else {
                  data.parent.insertBefore(img, data.parent.children[data.index]);
              }
          }
          img.style.top = data.top;
          img.style.left = data.left;
          img.classList.remove('drag-drop-im-dropped');
          img.classList.add('drag-drop-im');
      });
      compareInfoBox.classList.add('gone');
      overlay.classList.add('gone');
      pickUpWrapper.classList.add('gone');
      submitBttnWrap.classList.add('gone');
      if (currentTrial >= numberOfMoves - 1) {
        Array.from(rowWrapper.querySelector(`.subrow`).children)
          .forEach(sq => {
            sq.style.pointerEvents = 'none';
        });
        if (!training) {
          scoresSoFar_P3.push(score);
        }
        nextBtn.classList.remove('gone');
        nextBtn.classList.remove('hidden');
        if(topInstruction) {
          topInstruction.innerHTML = 'Click Next to continue'
        }
        saveData(cardSelected, rewardReceived, iconDropped, timeStampsSelected, timeStampsDropped);
        Array.from(rowWrapper.querySelector(`.subrow`).children).forEach(sq => {sq.classList.add('grey');});
        let targetPage = 'DISP_P3';
        if ((phase3Round % numberOfRounds) === 0) {
          targetPage = (training && correctCount < 2)
            ? 'DISP_P3_WRONG'
            : nextPageId;
        }
        buttonToNewPage(buttonId, targetPage);
      }
    }

    function saveData(cardSelectedArr, rewardReceivedArr, iconDroppedArr, timeStampsSelectedArr, timeStampsDroppedArr) {
      const data = {};
      cardSelectedArr.forEach((sq, idx) => {
        data[idx] = {
          decision: sq,
          reward: rewardReceivedArr[idx],
          timeCard: timeStampsSelectedArr[idx],
          iconDecision: iconDroppedArr[idx],
          timeIcon: timeStampsDroppedArr[idx],
        };
      });
      sessionStorage.setItem("Stage3Round" + phase3Round, JSON.stringify(data));
    }

    renderHistory();
    setupGrid();
}

function loadPhase4(numberOfMoves, numberOfRounds, comparisonFrequency, training, ids) {
    // — Get DOM ids —
    const {
      buttn:              buttonId,
      nextPage:           nextPageId,
      rowWrapper:         rowWrapperId,
      historyRowWrapper:  historyRowWrapperId,
      overlay:            overlayId,
      compareInfoBox:     compareInfoBoxId,
      lastXTrials:        lastXTrialsId,
      scorePlayer:        scorePlayerId,
      otherName:          otherNameId,
      scoreOther:         scoreOtherId,
      moreOrLessTxt:      moreOrLessTxtId,
      svgChart:           svgChartId,
      comparisonTarget:   comparisonTargetImId,
      readTxt:            readTxtId,
      scoreInfoBox:       scoreInfoBoxId,
      scoreText:          scoreTextId
    } = ids;

    // — DOM refs —
    const nextBtn            = document.getElementById(buttonId);
    const rowWrapper         = document.getElementById(rowWrapperId);
    const historyRowWrapper  = document.getElementById(historyRowWrapperId);
    const overlay            = document.getElementById(overlayId);
    const compareInfoBox     = document.getElementById(compareInfoBoxId);
    const lastXTrials        = document.getElementById(lastXTrialsId);
    const scorePlayer        = document.getElementById(scorePlayerId);
    const otherName          = document.getElementById(otherNameId);
    const scoreOther         = document.getElementById(scoreOtherId);
    const moreOrLessTxt      = document.getElementById(moreOrLessTxtId);
    const svgChart           = d3.select('#' + svgChartId);
    const readTxt            = document.getElementById(readTxtId);
    const scoreInfoBox       = document.getElementById(scoreInfoBoxId);
    const scoreText          = document.getElementById(scoreTextId);
    const comparisonTargetIm  = document.getElementById(comparisonTargetImId);

    // — Settings & state —
    const cols               = settings.cols;
    const historyRows        = 10;
    let   currentTrial       = 0;
    let   score              = 0;
    let   scoreSinceLastComp = 0;
    let   belowSubrows       = [];
    let   decision           = Array(numberOfMoves).fill(-1);
    let   previousDecision   = Array(numberOfMoves).fill(-1);
    let   comparisonValue    = Array(numberOfMoves).fill(-1);
    let   rewardReceived     = Array(numberOfMoves);
    let   timeStamps         = Array(numberOfMoves);

    const agent = targetName.includes('A') ? randomAgent : targetName.includes('B') ? leftyAgent : targetName.includes('C') ? rationalAgent : undefined;

    let newX = 0, newY = 0, startX = 0, startY = 0, dropCounter = 0;
    let historyData          = [];

    // — Compute sizes and reset —
    const size   = Math.min(computeSmallSize(1, rowWrapper), 150);
    const smallSize = Math.min(computeSmallSize(historyRows, historyRowWrapper), 150);
    if (!training) {
      var imFileName = targetName.replace(/\s+/g, '-');
      comparisonTargetIm.src = `./static/${imFileName}-desc.png`;
      comparisonTargetIm.classList.remove('gone');
    }

    // — initialize the chart —
    otherName.innerHTML = training ? "Player X" : targetName;
    const otherNameLabel = training ? "Player X" : targetName;
    const width = svgChart.node().clientWidth;
    const height = svgChart.node().clientHeight;
    const margin = { left: 0, right: 0 };
    const maxAbsScore = 150;            // start small, will expand if needed
    var imFileName = training ? "Player-X" : targetName.replace(/\s+/g, '-');

    let fillBar, label, x;
    if (!svgChart.node().chartInitialized) {
        svgChart.node().xScale = d3.scaleLinear()
           .domain([-maxAbsScore, maxAbsScore])
           .range([0, width]);
        x = svgChart.node().xScale;
        svgChart.append("rect")                  // draw a light background bar (full width)
          .attr("class", "bar-bg")
          .attr("x", 0)
          .attr("y", height/4)
          .attr("width", width)
          .attr("height", height/2);
        svgChart.append("line")                  // draw a zero line
          .attr("class", "zero-line")
          .attr("x1", x(0))
          .attr("x2", x(0))
          .attr("y1", 0)
          .attr("y2", height);
        svgChart.node().fillBar = svgChart.append("rect")  // the actual fill bar (initially zero length)
          .attr("class", "bar-fill")
          .attr("x", x(0))
          .attr("y", height/4)
          .attr("width", 0)
          .attr("height", height/2);
        svgChart.append("text")                  // You label (center side)
          .attr("x", x(0))
          .attr("y", height + 15)
          .attr("text-anchor", "middle")
          .attr("fill", "black")
          .attr("font-size", "14px")
          .text("You");
        svgChart.node().label = svgChart.append("text")    // bar label
          .attr("class", "bar-label")
          .attr("y", height / 2)
          .attr("x", x(0))
          .attr("dy", "0.35em")
          .attr("font-size", "14px")
          .text(otherNameLabel);
        svgChart.append("text")                  // Max label (right side)
          .attr("x", x(maxAbsScore))
          .attr("y", height + 15)
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
          .text(maxAbsScore);
        svgChart.append("text")                  // Min label (left side)
          .attr("x", x(-maxAbsScore))
          .attr("y", height + 15) // Below the bar
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")
          .text("-" + maxAbsScore);
        svgChart.append("text")
          .attr("x", x(-maxAbsScore/2))
          .attr("y", height + 15)
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")        // Mid label (left side)
          .text(-maxAbsScore/2);
        svgChart.append("text")
          .attr("x", x(maxAbsScore/2))
          .attr("y", height + 15)
          .attr("font-size", "14px")
          .attr("text-anchor", "middle")        // Mid label (right side)
          .text(maxAbsScore/2);
        svgChart.node().chartInitialized = true;
    }
    x = svgChart.node().xScale;
    fillBar = svgChart.node().fillBar;
    label = svgChart.node().label;

    compareInfoBox.classList.add("gone");
    compareInfoBox.style.cursor = 'pointer';
    compareInfoBox.style.pointerEvents = '';
    lastXTrials.innerHTML = (comparisonFrequency > 1) ? `${comparisonFrequency} trials` : `${comparisonFrequency} trial`;
    readTxt.classList.remove('gone');
    readTxt.classList.add('hidden');

    function createSquare(x) {
      const square = document.createElement('div');
      square.dataset.x = x;
      square.classList.add('square-finder', 'reward', 'hover-enabled', `reward${x}`);
      square.style.width  = square.style.height = `${size}px`;

      // add reward-score pseudo
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      const score = makeScore(square);
      score.setAttribute('data-type', 'score');
      score.classList.add('gone');
      pseudo.appendChild(score);
      square.appendChild(pseudo);

      // click → handleClick
      square.addEventListener('click', () => handleClick(square));
      return square;
    }

    function createSquareWithSize(x, y, size) {
      const square = document.createElement('div');
      square.dataset.x = 'h' + x;
      square.dataset.y = 'h' + y;
      square.classList.add('square-finder', 'reward', `reward${x}`);
      square.style.width  = square.style.height = `${size}px`;
      square.style.pointerEvents = 'none';
      const pseudo = document.createElement('div');
      pseudo.classList.add('square-pseudo');
      const score = makeScore(square);
      score.setAttribute('data-type', 'score');
      score.classList.add('gone');
      pseudo.appendChild(score);
      square.appendChild(pseudo);
      return square;
    }

    // Build the three zones
    function setupGrid() {
      // clear old
      nextBtn.classList.add('gone');
      rowWrapper.innerHTML = '';
      score = 0;
      scoreText.textContent = 'Score: 0';

      // rows as subrows
      const sub = document.createElement('div');
      sub.classList.add('subrow');
      for (let x = 0; x < cols; x++) {
        const sq = createSquare(x);
        sub.appendChild(sq);
      }
      rowWrapper.appendChild(sub);
    }

    function setupHistoryGrid() {
      // clear old
      historyRowWrapper.innerHTML = '';
      currentRow = 0;

      // rows as subrows of two
      let sub = document.createElement('div');
      sub.classList.add('clipped-row-squares')
      for (let y = historyRows - 1; y >= 0; y--) {
        sub.dataset.row = historyRows - y - 1;
        sub.classList.add('history-subrow_P4', 'gap-30', 'hidden');
        for (let x = 0; x < cols; x++) {
          const sq = createSquareWithSize(x, y, smallSize);
          sq.classList.add('grey','disabled');
          sq.style.pointerEvents = 'none';
          sub.appendChild(sq);
        }
        historyRowWrapper.appendChild(sub);
        sub = document.createElement('div');
      }
    }

    function updateHistory(x, reward) {
      // shift old data down
      historyData.unshift(Array(cols).fill({ grey: true, reward: null }));
      historyData[0][x] = { grey: false, reward: reward };

      // trim to historyRows
      if (historyData.length > historyRows) {
          historyData.pop();
      }

      renderHistory();
    }

    function renderHistory() {
      historyRowWrapper.innerHTML = '';
      for (let y = historyRows - 1; y >= 0; y--) {
          const sub = document.createElement('div');
          sub.dataset.row = historyRows - y - 1;
          sub.classList.add('history-subrow_P4', 'gap-30');
          if (!historyData[y]) {
              sub.classList.add('hidden');
          }

          for (let x = 0; x < cols; x++) {
              const sq = createSquareWithSize(x, y, smallSize);
              if (!historyData[y] || historyData[y][x].grey) {
                  sq.classList.add('grey', 'disabled');
              } else {
                  sq.classList.remove('grey');
                  sq.classList.add(`reward${x}-clicked`);
                  const pseudo = sq.firstElementChild;
                  const scoreDisp = pseudo.querySelector('[data-type="score"]');
                  scoreDisp.classList.remove('gone');
                  scoreDisp.innerHTML = historyData[y][x].reward;
              }
              sub.appendChild(sq);
          }
          historyRowWrapper.appendChild(sub);
      }
    }

    function blockScreenForComparison(trial) {
      // Block every comparisonFrequency trials
      if (trial == 0 || trial % comparisonFrequency !== 0) return; // Only run on trials 2, 4, 6, ...

      compareInfoBox.classList.remove("gone");
      let otherScoreSinceLastComp = 0;

      const round = phase1Round + phase2Round + phase3Round + phase4Round;
      for (let i = 0; i < comparisonFrequency; i++) {
        const t = trial - i - 1;
        let reward = agent[`round_${round}`]?.[t]?.reward || 0;
        otherScoreSinceLastComp += reward;
      }

      // If in training, override rewardSum with training logic
      if (training) {
        otherScoreSinceLastComp = scoreSinceLastComp + 100;
      }
      diff = otherScoreSinceLastComp - scoreSinceLastComp;
      moreOrLessTxt.innerHTML = (diff > 0) ? 'this much more than' : ((diff == 0) ? 'the same as' : 'this much less than');
      comparisonValue[trial] = diff;
      updateDifferenceBar(diff);

      overlay.classList.remove("gone");
      document.body.style.cursor = 'none !important';
      overlay.style.display = 'block';

      setTimeout(() => {
        readTxt.classList.remove('hidden');
        compareInfoBox.addEventListener('click', function() {
          compareInfoBox.classList.add("gone");
          overlay.classList.add('gone');
        });
      }, 1000);
      scoreSinceLastComp = 0;
    }

    function handleClick(square) {
      if (square.style.pointerEvents === 'none') return;

      const x = +square.dataset.x;
      decision[currentTrial] = x;
      timeStamps[currentTrial] = new Date().toISOString();

      const pseudo = square.firstElementChild;
      const scoreDisp = pseudo.querySelector('[data-type="score"]');

      let reward = 0;

      square.classList.remove(`reward${x}`);
      square.classList.add(`reward${x}-clicked`);
      reward = Math.round(settings.chanceToWin[((phase1Round + phase2Round + phase3Round + phase4Round - 1) * numberOfMoves + currentTrial)][0][x] * 100);
      if (training) {
        movesLeft = numberOfMoves - currentTrial;
        reward = movesLeft !== 1 ? movesLeft * 10 : (previousDecision.every(item => item.x !== x) ? 90 : 10);
        previousDecision[currentTrial] = decision[currentTrial];
      }
      scoreDisp.classList.remove('gone');
      scoreDisp.classList.remove('animate');
      void scoreDisp.offsetWidth; // force reflow
      scoreDisp.classList.add('animate');
      scoreDisp.innerHTML = reward;
      score += reward;
      scoreSinceLastComp += reward;
      scoreText.textContent = `Score: ${score}`;
      rewardReceived[currentTrial] = reward;

      updateHistory(x, reward);
      // Disable all tiles immediately to prevent further clicks
      Array.from(rowWrapper.querySelector(`.subrow`).children)
        .forEach(sq => {
        sq.style.pointerEvents = 'none';
      });

      // Wait 700ms before animating
      setTimeout(() => {
        square.classList.add(`reward${x}`);
        square.classList.remove(`reward${x}-clicked`);
        square.classList.remove('white');

        if (currentTrial >= numberOfMoves - 1) {
          if (!training) {
            scoresSoFar_P4.push(score);
          }
          nextBtn.classList.remove('gone');
          nextBtn.classList.remove('hidden');
          saveData(decision, rewardReceived, comparisonValue, timeStamps);
          Array.from(rowWrapper.querySelector(`.subrow`).children).forEach(sq => {sq.classList.add('grey');});
          if ((phase4Round % numberOfRounds) === 0) {
            buttonToNewPage(buttonId, nextPageId);
          } else {
            buttonToNewPage(buttonId, 'DISP_P4');
          }
        } else {
          currentTrial++;
          blockScreenForComparison(currentTrial);
          Array.from(rowWrapper.querySelector(`.subrow`).children)
            .forEach(sq => {
              sq.style.pointerEvents = 'auto';
          });
        }
      }, 900);
    }

    function updateDifferenceBar(value) {
      // compute new bar position & width
      const newX = value >= 0 ? x(0) : x(value);
      const newW = Math.abs(x(value) - x(0));

      fillBar.transition()
        .duration(1000)
        .attr("x", newX)
        .attr("width", newW);

      const lblWidth = label.node().getBBox().width;

      let lx, anchor, color;

      if (value >= 0) {
        if (newW >= lblWidth + 10) {
          // inside the bar, right-aligned, white text
          lx     = x(0) + newW - 5;
          anchor = "end";
          color  = "white";
        } else {
          // outside to the right, black text
          lx     = x(value) + 5;
          anchor = "start";
          color  = "black";
        }
      } else {
        if (newW >= lblWidth + 10) {
          // inside the bar, left-aligned, white text
          lx     = x(0) - newW + 5;
          anchor = "start";
          color  = "white";
        } else {
          // outside to the left, black text
          lx     = x(value) - 5;
          anchor = "end";
          color  = "black";
        }
      }

      label.transition()
        .duration(1000)
        .attr("x", lx)
        .attr("text-anchor", anchor)
        .attr("fill", color);
    }

    function saveData(decisionArr, rewardArr, comparisonValue, timeArr) {
      const data = {};
      decisionArr.forEach((sq, idx) => {
        data[idx] = {
          trial:      idx,
          decision:   sq,
          reward:     rewardArr[idx],
          comparison: comparisonValue[idx],
          timestamp:  timeArr[idx]
        };
      });
      sessionStorage.setItem("Stage4Round" + phase4Round, JSON.stringify(data));
    }

    renderHistory();
    setupGrid();
}


function loadCheck() {
    check1Entered++;
    wrongCount = 0;

    let questions = document.querySelectorAll('.check');
    questions.forEach(question => {
      question.querySelectorAll('input[type="radio"]').forEach(answer => answer.checked = false)
    });
    const submitButton = document.getElementById('check-next');
    if (submitButton._clickHandler) {
      submitButton.removeEventListener('click', submitButton._clickHandler);
    }

    document.getElementById('correct').classList.add('gone');
    document.getElementById('error-msg').classList.add('gone');
    document.getElementById('error-msg2').classList.add('gone');
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.checked = false;
      radio.defaultChecked = false;
    });

    submitButton.classList.add('disabled');
    submitButton.classList.remove('enabled');
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';
    submitButton.innerHTML = 'Check';

    questions.forEach(question => {
      question.querySelector('.question').style.color = '#333';
    });

    document.getElementById('checkTurns').innerHTML = settings.moves;
    let correctAnswers = [
        { question: "1", answer: true },
        { question: "2", answer: false },
        { question: "3", answer: true },
        { question: "4", answer: false },
        { question: "5", answer: true }
    ];

    let answers = [];
    let checkedAnswerLog = [];
    questions.forEach(question => {
        let qID = question.querySelector('.question').id;
        question.querySelectorAll('input[type="radio"]').forEach(answer => {
          answer.onchange = null; // remove any old listener
          answer.onchange = () => {
            document.getElementById('error-msg').classList.add('gone');
            question.querySelector('.question').style.color = '#333';
            if (answer.checked) {
              answers.push({
                question: qID,
                answer: answer.value === 'true',
                timestamp: new Date().toISOString().split('T')[1]
              });
            }
            if (new Set(answers.map(item => item.question)).size > correctAnswers.length - 1) {
                submitButton.classList.remove('disabled');
                submitButton.classList.add('enabled');
                submitButton.disabled = false;
                submitButton.style.cursor = 'pointer';
            }
          };
        });
    });

    submitButton.onclick = () => {
      submitButton.classList.add('disabled');
      submitButton.classList.remove('enabled');
      submitButton.disabled = true;
      submitButton.style.cursor = 'not-allowed';

      wrongCount = 0;
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
          wrongCount++;
          let questionElement = document.getElementById(userAnswer.question);
          questionElement.style.color = '#b50000';
        }
      }

      setTimeout(() => {
        if (wrongCount === 0) {
          submitButton.innerHTML = 'Next';
          submitButton.classList.remove('disabled');
          submitButton.disabled = false;
          submitButton.style.cursor = 'pointer';
          buttonToNewPage('check-next', 'INSTRUCTIONS11');
        } else if (wrongCount > 1) {
          submitButton.innerHTML = 'Back';
          submitButton.classList.remove('disabled');
          submitButton.disabled = false;
          submitButton.style.cursor = 'pointer';
          if (check1Entered < 2) {
            buttonToNewPage('check-next', 'INSTRUCTIONS2');
          } else {
            buttonToNewPage('check-next', 'RESCINDED');
          }
        }
      }, 400);

      document.getElementById('5').style.marginBottom = '0px';
      if (wrongCount === 0) {
        document.getElementById('correct').classList.remove('gone');
      } else if (wrongCount == 1) {
        document.getElementById('error-msg').classList.remove('gone');
      } else {
        questions.forEach(question => question.querySelector('.question').style.color = '#333');
        document.getElementById('error-msg').classList.add('gone');
        document.getElementById('error-msg2').classList.remove('gone');
      }

      let checkQuestions = {
        answers: answers,
        checkedAnswerLog: checkedAnswerLog
      };
      sessionStorage.setItem('checkQuestions', JSON.stringify(checkQuestions));
    };
}

function loadCheck_P3() {
    check3Entered++;
    wrongCount_P3 = 0;

    let questions = document.querySelectorAll('.check');
    questions.forEach(question => {
      question.querySelectorAll('input[type="radio"]').forEach(answer => answer.checked = false)
    });
    const submitButton = document.getElementById('checkNext_P3');
    if (submitButton._clickHandler) {
      submitButton.removeEventListener('click', submitButton._clickHandler);
    }

    document.getElementById('correct_P3').classList.add('gone');
    document.getElementById('error-msg_P3').classList.add('gone');
    document.getElementById('error-msg2_P3').classList.add('gone');
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.checked = false;
      radio.defaultChecked = false;
    });

    submitButton.classList.add('disabled');
    submitButton.classList.remove('enabled');
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';
    submitButton.innerHTML = 'Check';

    questions.forEach(question => {
      question.querySelector('.question').style.color = '#333';
    });

    let correctAnswers = [
        { question: "1_P3", answer: false },
        { question: "2_P3", answer: false },
        { question: "3_P3", answer: false },
        { question: "4_P3", answer: true },
        { question: "5_P3", answer: false }
    ];

    let answers = [];
    let checkedAnswerLog = [];
    questions.forEach(question => {
        let qID = question.querySelector('.question').id;
        question.querySelectorAll('input[type="radio"]').forEach(answer => {
          answer.onchange = null; // remove any old listener
          answer.onchange = () => {
            document.getElementById('error-msg_P3').classList.add('gone');
            question.querySelector('.question').style.color = '#333';
            if (answer.checked) {
              answers.push({
                question: qID,
                answer: answer.value === 'true',
                timestamp: new Date().toISOString().split('T')[1]
              });
            }
            if (new Set(answers.map(item => item.question)).size > correctAnswers.length - 1) {
                submitButton.classList.remove('disabled');
                submitButton.classList.add('enabled');
                submitButton.disabled = false;
                submitButton.style.cursor = 'pointer';
            }
          };
        });
    });

    submitButton.onclick = () => {
      submitButton.classList.add('disabled');
      submitButton.classList.remove('enabled');
      submitButton.disabled = true;
      submitButton.style.cursor = 'not-allowed';

      wrongCount_P3 = 0;
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
          wrongCount_P3++;
          let questionElement = document.getElementById(userAnswer.question);
          questionElement.style.color = '#b50000';
        }
      }

      setTimeout(() => {
        if (wrongCount_P3 === 0) {
          submitButton.innerHTML = 'Next';
          submitButton.classList.remove('disabled');
          submitButton.disabled = false;
          submitButton.style.cursor = 'pointer';
          buttonToNewPage('checkNext_P3', 'INSTRUCTIONS11_P3');
        } else if (wrongCount_P3 > 1) {
          submitButton.innerHTML = 'Back';
          submitButton.classList.remove('disabled');
          submitButton.disabled = false;
          submitButton.style.cursor = 'pointer';
          if (check3Entered < 2) {
            buttonToNewPage('checkNext_P3', 'INSTRUCTIONS3_P3');
          } else {
            buttonToNewPage('check-next', 'RESCINDED');
          }
        }
      }, 400);

      document.getElementById('5_P3').style.marginBottom = '0px';
      if (wrongCount_P3 === 0) {
        document.getElementById('correct_P3').classList.remove('gone');
      } else if (wrongCount_P3 == 1) {
        document.getElementById('error-msg_P3').classList.remove('gone');
      } else {
        questions.forEach(question => question.querySelector('.question').style.color = '#333');
        document.getElementById('error-msg_P3').classList.add('gone');
        document.getElementById('error-msg2_P3').classList.remove('gone');
      }

      let checkQuestions = {
        answers: answers,
        checkedAnswerLog: checkedAnswerLog
      };
      sessionStorage.setItem('checkQuestions', JSON.stringify(checkQuestions));
    };
}

function loadCheck_P4() {
    check4Entered++;
    wrongCount_P4 = 0;

    let questions = document.querySelectorAll('.check');
    questions.forEach(question => {
      question.querySelectorAll('input[type="radio"]').forEach(answer => answer.checked = false)
    });
    const submitButton = document.getElementById('checkNext_P4');
    if (submitButton._clickHandler) {
      submitButton.removeEventListener('click', submitButton._clickHandler);
    }

    document.getElementById('correct_P4').classList.add('gone');
    document.getElementById('error-msg_P4').classList.add('gone');
    document.getElementById('error-msg2_P4').classList.add('gone');
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.checked = false;
      radio.defaultChecked = false;
    });

    submitButton.classList.add('disabled');
    submitButton.classList.remove('enabled');
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';
    submitButton.innerHTML = 'Check';

    questions.forEach(question => {
      question.querySelector('.question').style.color = '#333';
    });

    let correctAnswers = [
        { question: "1_P4", answer: true },
        { question: "2_P4", answer: false },
        { question: "3_P4", answer: true },
        { question: "4_P4", answer: false },
        { question: "5_P4", answer: true }
    ];

    let answers = [];
    let checkedAnswerLog = [];
    questions.forEach(question => {
        let qID = question.querySelector('.question').id;
        question.querySelectorAll('input[type="radio"]').forEach(answer => {
          answer.onchange = null; // remove any old listener
          answer.onchange = () => {
            document.getElementById('error-msg_P4').classList.add('gone');
            question.querySelector('.question').style.color = '#333';
            if (answer.checked) {
              answers.push({
                question: qID,
                answer: answer.value === 'true',
                timestamp: new Date().toISOString().split('T')[1]
              });
            }
            if (new Set(answers.map(item => item.question)).size > correctAnswers.length - 1) { // if we have enough answers, release Check button
                submitButton.classList.remove('disabled');
                submitButton.classList.add('enabled');
                submitButton.disabled = false;
                submitButton.style.cursor = 'pointer';
            }
          };
        });
    });

    submitButton.onclick = () => {
      submitButton.classList.add('disabled');
      submitButton.classList.remove('enabled');
      submitButton.disabled = true;
      submitButton.style.cursor = 'not-allowed';

      wrongCount_P4 = 0;
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
          wrongCount_P4++;
          let questionElement = document.getElementById(userAnswer.question);
          questionElement.style.color = '#b50000';
        }
      }

      setTimeout(() => {
        if (wrongCount_P4 === 0) {
          submitButton.innerHTML = 'Next';
          submitButton.classList.remove('disabled');
          submitButton.disabled = false;
          submitButton.style.cursor = 'pointer';
          buttonToNewPage('checkNext_P4', 'INSTRUCTIONS8_P4');
        } else if (wrongCount_P4 > 1) {
          submitButton.innerHTML = 'Back';
          submitButton.classList.remove('disabled');
          submitButton.disabled = false;
          submitButton.style.cursor = 'pointer';
          if (check4Entered < 2) {
            buttonToNewPage('checkNext_P4', 'INSTRUCTIONS2_P4');
          } else {
            buttonToNewPage('check-next', 'RESCINDED');
          }
        }
      }, 400);


      document.getElementById('5_P4').style.marginBottom = '0px';
      if (wrongCount_P4 === 0) {
        document.getElementById('correct_P4').classList.remove('gone');
      } else if (wrongCount_P4 == 1) {
        document.getElementById('error-msg_P4').classList.remove('gone');
      } else {
        questions.forEach(question => question.querySelector('.question').style.color = '#333');
        document.getElementById('error-msg_P4').classList.add('gone');
        document.getElementById('error-msg2_P4').classList.remove('gone');
      }

      let checkQuestions = {
        answers: answers,
        checkedAnswerLog: checkedAnswerLog
      };
      sessionStorage.setItem('checkQuestions', JSON.stringify(checkQuestions));
    };
}

function loadScoreDisplay() {
    document.getElementById('round-score').innerHTML = scoresSoFar.at(-1);
    document.getElementById('round-ordinal').innerHTML = ordinals[phase1Round-1];
    document.getElementById('round-next').innerHTML = (phase1Round+1);
    phase1Round++;
    buttonToNewPage('nextButtonDisp','GAME1');
}

function loadScoreDisplay_P2() {
    document.getElementById('target_disp_P2').innerHTML = targetName;
    buttonToNewPage('nextButtonDisp_P2','INSTRUCTIONS4_P2');
}

function loadScoreDisplay_P3() {
    document.getElementById('round-ordinal_P3').innerHTML = ordinals[phase3Round-1];
    document.getElementById('round-next_P3').innerHTML = (phase3Round+1);
    phase3Round++;
    buttonToNewPage('nextButtonDisp_P3','GAME3');
}

function loadScoreDisplay_P3_WRONG() {
    buttonToNewPage('nextButtonDisp_P3_WRONG','TRAIN_P3');
}

function loadScoreDisplay_P4() {
    document.getElementById('round-score_P4').innerHTML = scoresSoFar_P4.at(-1);
    document.getElementById('round-ordinal_P4').innerHTML = ordinals[phase4Round-1];
    document.getElementById('round-next_P4').innerHTML = (phase4Round+1);
    phase4Round++;
    buttonToNewPage('nextButtonDisp_P4','GAME4');
}

function loadSelectObservationTarget() {
    const nextButton = document.getElementById('selectTargetNextButton');
    nextButton.addEventListener('click', generateCopmarisonTarget);

    const table = document.getElementById('selectableTable');
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    if (currentPlayer == 1) {
      const numOtherPlayers = 3;
      for (let i = 0; i < numOtherPlayers; i++) {
          const playerName = String.fromCharCode(65 + i); // A, B, C
          players.push({
              name: `Player ${playerName}`,
              img: `./static/Player-${playerName}.png`,
              characteristic: characteristics[i % characteristics.length]
          });
      }
      shuffleArray(players);
      //players.reverse();
    }

    // Create rows — first row selectable, others greyed
    players.forEach((player, index) => {
        const row = document.createElement('tr');
        if (index != (currentPlayer - 1)) row.classList.add('disabled-row'); // Grey out non-first rows
        row.innerHTML = `
            <td class="center-td">
                <img src="${player.img}" alt="${player.name}" class="border-filter"; style="width: 100px; height: auto;">
            </td>
            <td class="center-td">${player.name}</td>
            <td>${player.characteristic}</td>
        `;
        tbody.appendChild(row);
    });

    let selectedRow = null;
    table.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        if (row && row.parentNode.tagName === 'TBODY' && !row.classList.contains('disabled-row')) {
            if (selectedRow) {
                selectedRow.classList.remove('selected');
            }
            row.classList.add('selected');
            selectedRow = row;
            enableButton(nextButton);

            targetName = selectedRow.cells[1].innerText.trim();
        }
    });

    disableButton(nextButton);
    table.style.display = 'block';

    function generateCopmarisonTarget() {
        if (nextButton.disabled) {
            return;
        }
        selectedRow.classList.remove('selected');
        selectedRow.classList.add('unavailable');
        targetTable = table;
        showPage('INSTRUCTIONS3_P2');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

function loadRate(otherRating, ids) {
    // — Get DOM ids —
    const {
      buttn:          buttonId,
      nextPage:       nextPageId,
      movableThumb:   movableThumbId,
      slider:         sliderId,
      rateLabel:      rateLabelId
    } = ids;

    // — DOM refs —
    const nextButton     = document.getElementById(buttonId);
    const movableThumb   = document.getElementById(movableThumbId);
    const slider         = document.getElementById(sliderId);
    const movingLabel    = document.getElementById(rateLabelId);

    // Button
    disableButton(nextButton);
    nextButton.addEventListener('click', (e) => {
      if (buttonId.includes('Self')) {
        selfRating = val;
      }
      addToInstructionTimings(buttonId, new Date().toISOString().split('T')[1]);
      showPage(nextPageId);
    });

    // Thumb
    let isDragging = false;
    let val;
    movableThumb.addEventListener('mousedown', () => {
      isDragging = true;
      enableButton(nextButton);
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) {
        return;
      }
      val = getValueFromPosition(e.clientX);
      movableThumb.style.left = `${val}%`;
      movingLabel.style.left = `${val}%`;
    });
    document.addEventListener('mouseup', () => isDragging = false);

    // Slider
    slider.style.background = '#ddd';

    slider.addEventListener('mousedown', (e) => {
      movableThumb.classList.remove('hidden');
      movingLabel.classList.remove('hidden');
      val = getValueFromPosition(e.clientX);
      movableThumb.style.left = `${val}%`;
      movingLabel.style.left = `${val}%`;
      enableButton(nextButton);
      updateSliderBackground();
    });

    // Vertical Line
    if (otherRating) {
      const vertical   = document.getElementById('vertical-line');
      const fixedLabel = document.getElementById('rate-label-fixed');
      const participantLetter = document.getElementById('rate-participant-id');

      vertical.classList.remove('hidden');
      vertical.style.left     = `${selfRating}%`;
      movableThumb.style.left = `${selfRating}%`;
      fixedLabel.style.left   = `${selfRating}%`;
      movingLabel.style.left  = `${selfRating}%`;

      participantLetter.innerHTML = targetName;
      movingLabel.innerHTML       = targetName;

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        val = getValueFromPosition(e.clientX);
        movingLabel.style.left = `${val}%`;
        updateSliderBackground();
      });
    }

    function getValueFromPosition(clientX) {
      const min = 0;
      const max = 100;
      const step = 1;

      const rect = slider.getBoundingClientRect();
      let x = Math.min(Math.max(clientX - rect.left, 0), rect.width);

      // Map position to value based on min, max, and step
      const percentage = x / rect.width;
      const rawValue = min + percentage * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;

      // Move the thumb using percentage (instead of pixels)
      const newPercentage = ((steppedValue - min) / (max - min)) * 100;
      movableThumb.style.left = `${newPercentage}%`;  // Set the position in percentage

      return steppedValue;
    }

    function updateSliderBackground() {
      if (!otherRating) return;
      
      let background;
      if (val > selfRating) {
          background = `linear-gradient(to right, #ddd, #ddd ${selfRating}%, darkgray ${selfRating}%, darkgray ${val}%, #ddd ${val}%, #ddd)`;
      } else {
          background = `linear-gradient(to right, #ddd, #ddd ${val}%, darkgray ${val}%, darkgray ${selfRating}%, #ddd ${selfRating}%, #ddd)`;
      }
      slider.style.background = background;
    }
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
        let highestValue = Math.max(...chanceToWin[i]);
        sum += highestValue;
      }
      return sum;
    };
}

function loadRescinded() {}

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

function getAgent(type) {
    const agent = sessionStorage.getItem(type);
    return agent ? JSON.parse(agent) : {};
}

function computeSmallSize(rows, wrapper) {
  const wrapperStyles = getComputedStyle(wrapper);

  const paddingTop = parseFloat(wrapperStyles.paddingTop);
  const paddingBottom = parseFloat(wrapperStyles.paddingBottom);
  const borderTop = parseFloat(wrapperStyles.borderTopWidth);
  const borderBottom = parseFloat(wrapperStyles.borderBottomWidth);
  const totalWrapperExtras = paddingTop + paddingBottom + borderTop + borderBottom;

  const usableHeight = wrapper.clientHeight - totalWrapperExtras - 10 * rows; // margin is 10px per square
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

function makeScore(square) {
  const scoreTxt = document.createElement('div');
  scoreTxt.classList.add('square-score');
  scoreTxt.innerHTML = '0';
  scoreTxt.style.fontSize = 0.8 * square.style.width;
  return scoreTxt;
}

function makeTick() {
  path = "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z";
  color = "#37f92a";
  return makeSVG(path,color,"correct-tick");
}

function makeCross() {
  path = "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z";
  color = "red";
  return makeSVG(path,color,"incorrect-cross");
}

function makeRewardStar() {
  path = "M852-212 732-332l56-56 120 120-56 56ZM708-692l-56-56 120-120 56 56-120 120Zm-456 0L132-812l56-56 120 120-56 56ZM108-212l-56-56 120-120 56 56-120 120Zm246-75 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-361Z";
  color = "gold";
  return makeSVG(path,color,"reward-star");
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

function setOutOfFocus(subrow, smallSize) {
  const squares = subrow.querySelectorAll('.square-finder');
  squares.forEach(sq => {
    sq.classList.add('grey');
    const innerScore = sq.firstElementChild?.querySelector('[data-type="score"]');
    if (innerScore) innerScore.classList.remove('animate');
    sq.style.width  = sq.style.height = `${smallSize}px`;
  });
}

function setInFocus(subrow, bigSize, fixed = false, fixedSquare = null) {
  const squares = subrow.querySelectorAll('.square-finder');

  squares.forEach(sq => {
    const isTarget = !fixed || sq.dataset.x == fixedSquare;

    if (isTarget) {
      sq.classList.remove('grey');
      sq.style.pointerEvents = 'auto';
    }

    sq.style.width = sq.style.height = `${bigSize}px`;
  });
}

function buttonToNewPage(buttonId, newPageID) {
    const btn = document.getElementById(buttonId);

    // If a previous handler exists, remove it
    if (btn._clickHandler) {
      btn.removeEventListener('click', btn._clickHandler);
    }

    // Define a new handler
    const handler = function() {
      addToInstructionTimings(buttonId, new Date().toISOString().split('T')[1]);
      showPage(newPageID);
    };

    // Store the new handler on the button and add it
    btn._clickHandler = handler;
    btn.addEventListener('click', handler);
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

function generateBinaryVectors(length) {
  const total = 2 ** length;
  const vectors = [];
  for (let i = 0; i < total; i++) {
    const bin = i.toString(2).padStart(length, '0').split('').map(Number);
    vectors.push(bin);
  }
  return vectors;
};

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

function disableButton(btn) {
  btn.disabled = true;
  btn.classList.remove('enabled');
  btn.style.cursor = 'not-allowed';
  btn.style.color = 'grey';
}

function enableButton(btn) {
  btn.disabled = false;
  btn.classList.add('enabled');
  btn.style.cursor = 'pointer';
  btn.style.color = 'black';
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