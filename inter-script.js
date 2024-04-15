document.addEventListener('DOMContentLoaded', function() {
    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    // Get the score from the URL
    var score = getUrlParameter('score');
    var round = getUrlParameter('round');

    // Update the score display
    const scoreDiv = document.getElementById('scorer');
    const butt = document.getElementById('rounder');
    if (scoreDiv) {
        scoreDiv.innerHTML = "You scored: " + score;
    }
    if (butt) {
        butt.innerHTML = "Next Round? Round " + round + " of 6";
    }
    
    butt.addEventListener('click', nextRound);

    function nextRound() {
      window.location.href = 'game.html?round=' + round;
    }
});