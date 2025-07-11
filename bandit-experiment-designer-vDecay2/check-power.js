
function runSimulations(settings,numSimulations) {
//chanceToWin[currentMove][squareY][squareX]
//settings.probUpwardComparison + gaussianRandom(0, 0.02);
  /*
  For each simulation
    Add to array:
      (1) whether it is a perseveration;
      (2) whether the reward was above 30, 40, 50, 60, 70;
      (3) upward vs. downward comparison;
      (4) difference between reward and comparison
    Run a regression predicting perseveration from:
      (1) reward;
      (2) reward above some threshold;
      (3) value of comparison;
      (4) upward comparison;
      (5) diff between reward and comparison

  Run model analysis to see if the model with social observation better predicts results than model without
  */

  const chanceToWin = settings.chanceToWin;
  const algorithm = Random();
  const numTrials = settings.moves * settings.numberOfRounds;

  const allResults = new Array();
  for (let simIdx = 0; simIdx < numSimulations; simIdx++) {
    let probUpwardComparison = settings.probUpwardComparison + gaussianRandom(0, 0.02);
    let simResult = new Array();
    for (let trial = 0; trial < numTrials; trial++) {
      let decision = algorithm.nextDecision();
      let reward = chanceToWin[trial][0][decision];

      let comparison = NaN; // Default
      let trialSinceComparison++;
      if (Math.ceil(trial/settings.moves) == settings.comparisonRounds && movesSinceLastComparison == settings.comparisonFrequency) {
        comparison = getComparison(trial,decision,reward,probUpwardComparison,settings);
        trialSinceComparison = 0;
      }

      let perseveration = (previousDecision === decision) ? 1 : 0;
      previousDecision = decision;
      let rewardAbove30 = (reward > 30) ? 1 : 0;
      let rewardAbove40 = (reward > 40) ? 1 : 0;
      let rewardAbove50 = (reward > 50) ? 1 : 0;
      let rewardAbove60 = (reward > 60) ? 1 : 0;
      let rewardAbove70 = (reward > 70) ? 1 : 0;
      let upwardComparison = (!isNaN(comparison) && comparison > reward) ? 1 : 0;
      let diffRewardComparison = !isNaN(comparison) ? (comparison - reward) : NaN;

      simResult.push({
        trial: trial,
        decision: decision,
        reward: reward,
        comparison: comparison,
        perseveration: perseveration,
        rewardAbove30: rewardAbove30,
        rewardAbove40: rewardAbove40,
        rewardAbove50: rewardAbove50,
        rewardAbove60: rewardAbove60,
        rewardAbove70: rewardAbove70,
        upwardComparison: upwardComparison,
        diffRewardComparison: diffRewardComparison
      });
    }
    allResults.push({
      simulationResults: simResults
    });
}

function Random() {
  this.nextDecision = function() {
    return Math.floor(Math.random() * 4) + 1;
  };
}


function getComparison(trial,decision,reward,probUpwardComparison,settings) {
  const randomVal = Math.random();
  if (Math.random() < probUpwardComparison) {// upward comparison
    if (settings.binary) { 
      return settings.greenSquareScore;
    }
    if (!settings.comparerUsesAvailableCards) {
      throw "Not implemented test for comparison with random addition";
    }
    const available = settings.chanceToWin[currentMove].flat(2);
    if (settings.optimalValueComparison) {
      return Math.max(...available);
    } else {
      shuffleArray(available);
      for (let val of available) { // first value greater than player's
          if (val > reward) {
              return val;
          }
      }
      return reward;
    }
  }

  if (settings.binary) {// downward comparison
    return 0;
  }
  if (settings.comparerUsesAvailableCards) {
      const available = settings.chanceToWin[currentMove].flat(2);
      shuffleArray(available);
      for (let val of available) {
        if (val <= playersAdditionalScore) {// first value less than playersAdditionalScore
          return val;
        }
      }
      return reward;
  }
  throw "Not implemented test for comparison with random addition";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}
