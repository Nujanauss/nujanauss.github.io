import { getUrlParameter } from './shared.js';

document.addEventListener('DOMContentLoaded', function() {
  const butt = document.getElementById('prebegin1');
  if (butt) {
    butt.addEventListener('click', generate);
  }
  document.getElementById('trainingScore').innerHTML = getUrlParameter('s');
  var pressedOnce = false;
  function generate() {
    if (!pressedOnce) {
      pressedOnce = true;
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
      window.location.href = 'prebegin2.html'  + '?r=' + getUrlParameter('r') + '&c=' + getUrlParameter('c') + '&usr=lumi7el&cmr=n3ssiori';
    }
  }
});
