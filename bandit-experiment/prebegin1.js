import { getUrlParameter, getGameSettings, initializeFocusTracker } from './shared.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
  const settings = getGameSettings();

  const butt = document.getElementById('prebegin1');
  butt.addEventListener('click', generate);

  let pressedOnce = false;
  let debounceTimeout;

  function generate() {
      if (butt.disabled) {
          return;
      }

      if (debounceTimeout) {
          clearTimeout(debounceTimeout);
      }

      butt.disabled = true;
      butt.classList.remove('enabled');
      butt.style.cursor = 'not-allowed';
      butt.style.color = 'grey';
      debounceTimeout = setTimeout(() => {
          if (!pressedOnce) {
              pressedOnce = true;
              setTimeout(() => {
                  document.getElementById('username-generation').style.visibility = 'visible';
              }, 700);

              setTimeout(() => {
                  butt.disabled = false;
                  butt.innerHTML = 'Next';
                  butt.classList.add('enabled');
                  butt.style.color = 'black';
                  butt.style.cursor = 'pointer';
              }, 3000);
          } else {
              window.location.href = 'prebegin2' + '?usr=lumi7el';
          }
      }, 700);
  }
});
