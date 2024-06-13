import { getUrlParameter, getScoresSoFar, nextRound } from './shared.js';

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
      var mergedDataString = JSON.stringify(existingData);
      sessionStorage.setItem('playerData', mergedDataString);
      window.location.href = 'final';
    });
});
