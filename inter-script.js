import { getScoresSoFar, nextRound } from './shared.js';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const round = urlParams.get('round');
    const finalRound = urlParams.get('rounds');
    const nxtRound = parseFloat(round) + 1;
    const scores = getScoresSoFar();
    const latestScore = scores.pop();

    const scoreDiv = document.getElementById('scorer');
    const butt = document.getElementById('rounder');
    if (scoreDiv) {
        scoreDiv.innerHTML = "You scored: " + latestScore;
    }
    if (butt) {
        butt.innerHTML = "Next Round? Round " + nxtRound + " of " + finalRound;
        butt.addEventListener('click', nextRound);
    }
});