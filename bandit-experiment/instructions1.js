import { buttonToNewPage, getGameSettings } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
  const vars = await loadGameSettings();
  sessionStorage.setItem('gameSettings', JSON.stringify(vars));

  async function loadGameSettings() {
    const response = await fetch('settings.json');
    const data = await response.json();
    return data.vars;
  }

  const settings = getGameSettings();

  if (settings.binary == false) {
      document.getElementById('binary-dependent').innerHTML = 'will';
  }

  buttonToNewPage('nextButton1', 'instructions2');
});
