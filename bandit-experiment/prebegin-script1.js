import { getUrlParameter, getGameSettings } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
  const settings = getGameSettings();

  const butt = document.getElementById('prebegin1');
  if (butt) {
    butt.addEventListener('click', generate);
  }
  var noMovesText = document.getElementById('noOfMoves');
  if (settings.numberOfRounds > 1) {
    noMovesText.innerHTML = settings.moves + " moves per trial.";
  } else {
    noMovesText.innerHTML = settings.moves + " moves in total.";
  }

  var pressedOnce = false;
  function generate() {
    if (butt.disabled) {
      return;
    }
    if (!pressedOnce) {
      pressedOnce = true;
      butt.disabled = true;
      document.getElementById('username-generation').style.visibility = 'visible';
      butt.classList.remove('enabled');
      butt.style.cursor = 'not-allowed';
      butt.style.color = 'grey';
      
      setTimeout(() => {
        butt.disabled = false;
        butt.innerHTML = 'Next';
        butt.classList.add('enabled');
        butt.style.color = 'black';
        butt.style.cursor = 'pointer';
      }, 3000);
    } else {
      window.location.href = 'prebegin2.html'  + '?usr=lumi7el';
    }
  }
});
