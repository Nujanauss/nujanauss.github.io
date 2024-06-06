import { getUrlParameter } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
  const vars = await loadGameSettings();
  const butt = document.getElementById('prebegin1');
  if (butt) {
    butt.addEventListener('click', generate);
  }
  document.getElementById('trainingScore').innerHTML = getUrlParameter('s');
  document.getElementById('noOfMoves').innerHTML = sessionStorage.getItem('moves');

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

  async function loadGameSettings() {
    const response = await fetch('settings.json');
    const data = await response.json();
    return data.vars;
  }
});
