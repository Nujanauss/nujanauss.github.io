import { getScoresSoFar, nextRound } from './shared.js';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const round = urlParams.get('round');
    const finalRound = JSON.parse(sessionStorage.getItem('gameSettings')).numberOfRounds;
    const nxtRound = parseInt(round, 10) + 1;
    const scores = getScoresSoFar();
    const latestScore = scores.pop();

    const scoreDiv = document.getElementById('scorer');
    const butt = document.getElementById('rounder');
    if (scoreDiv) {
        scoreDiv.innerHTML = "You scored: " + latestScore;
    }
    if (butt) {
      const rnd = parseInt(round, 10) + 1;
      butt.innerHTML = "Next Round? Round " + rnd + " of " + finalRound;
      butt.addEventListener('click', nextRound);
    }
});