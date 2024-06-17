import { getUrlParameter, getGameSettings, initializeFocusTracker } from './shared.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
  const settings = getGameSettings();

  if (!settings.binary) {
    if (settings.stochastic) {
      document.getElementById('real-thing').innerHTML = 'Now let\'s move onto the real thing. This time there will be some reward associated with every card. However, this reward may change every move.';
    } else {
      document.getElementById('real-thing').innerHTML = 'Now let\'s move onto the real thing. This time there will be some reward associated with every card.';
    }
  } else {
    document.getElementById('real-thing').innerHTML = 'Now let\'s move onto the real thing. This time there is some chance that each card will reward you after you select it.';
  }

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
