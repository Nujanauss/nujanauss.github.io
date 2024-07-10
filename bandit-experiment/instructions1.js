import { buttonToNewPage, getGameSettings, initializeFocusTracker  } from './shared.js';
import { create_participant } from './backend_integration.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
  const prolificID = 'prolificID';
  create_participant(prolificID);

  const settings = getGameSettings();

  var playerData = {
    "player": {
        "prolificID": prolificID,
    }
  };
  sessionStorage.setItem('playerData', JSON.stringify(playerData));

  if (settings.binary == false) {
      document.getElementById('binary-dependent').innerHTML = 'will';
  }

  buttonToNewPage('nextButton1', 'instructions2');
});