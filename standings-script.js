import { getUrlParameter, getScoresSoFar, nextRound } from './shared.js';

document.addEventListener('DOMContentLoaded', function() {
    const round = getUrlParameter('round');
    const finalRound = getUrlParameter('rounds');
    const scores = getScoresSoFar();

    // Update the score display
    const scoreDiv = document.getElementById('player-score');
    const scoresSum = scores.reduce((total, score) => total + score, 0);
    const avgScore = (scoresSum / scores.length).toFixed(1);
    if (scoreDiv) {
      scoreDiv.innerHTML = avgScore;
    }

    var socialScore;
    if (avgScore < 0) {
      socialScore = Math.random() * 200;
    }
    if (avgScore > 0 && avgScore < 1000) {
      socialScore = 1000 + Math.random() * 500;
    }
    if (avgScore > 999 && avgScore < 3000) {
      socialScore = Math.random() * 1000 + 1000;
    }
    if (avgScore > 2999) {
      socialScore = Math.random() * 3000 + 1000;
    }
    const socialScoreDiv = document.getElementById('social-score');
    if (socialScoreDiv) {
      socialScoreDiv.innerHTML = socialScore.toFixed(1);
    }
    var socialRow = document.getElementById('social-label').parentNode;
    var playerRow = document.getElementById('player-label').parentNode;

    if (avgScore < socialScore) {
      // Append player row after social row
      socialRow.parentNode.insertBefore(playerRow, socialRow.nextSibling);
    } else {
      playerRow.parentNode.insertBefore(socialRow, playerRow.nextSibling);
    }

    const butt = document.getElementById('next');
    butt.addEventListener('click', nextRound);
    if (butt) {
        butt.innerHTML = "Next Round? Round " + (parseFloat(round) + 1) + " of " + finalRound;
    }
});
