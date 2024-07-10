import { checkRefresh, getUrlParameter, getScoresSoFar, nextRound, initializeFocusTracker } from './shared.js';

checkRefresh();
initializeFocusTracker();

document.addEventListener('DOMContentLoaded', function() {
    const round = getUrlParameter('round');
    const finalRound = getUrlParameter('rounds');
    const scores = getScoresSoFar();

    const scoresSum = scores.reduce((total, score) => total + score, 0);
    /*const avgScore = (scoresSum / scores.length).toFixed(1);*/
    const maxScore = Math.max(...scores);
    var playerRowSum = document.getElementById('player-score-sum');
    if (playerRowSum) {
      playerRowSum.innerHTML = scoresSum;
    }
    var playerRowMax = document.getElementById('player-score-max');
    if (playerRowMax) {
      playerRowMax.innerHTML = maxScore;
    }

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
              "age": ageSelect.value
          }
      };

      // Merge additional user data with existing user data
      existingData.player = Object.assign({}, existingData.player, additionalUserData.player);
      const comment = document.getElementById('comments').value;
      existingData.comment = comment;
      var mergedDataString = JSON.stringify(existingData);

      sessionStorage.setItem('playerData', mergedDataString);

      //sessionStorage.setItem('comment', document.getElementById('comments').value);
      window.location.href = 'final';
    });
});
