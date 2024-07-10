import { buttonToNewPage, initializeFocusTracker } from '../../bandit-experiment/shared.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
  const vars = await loadGameSettings();
  sessionStorage.setItem('gameSettings', JSON.stringify(vars));

  async function loadGameSettings() {
    const response = await fetch('settings.json');
    const data = await response.json();
    return data.vars;
  }

  buttonToNewPage('first-next', '../../bandit-experiment/pre-consent');
});