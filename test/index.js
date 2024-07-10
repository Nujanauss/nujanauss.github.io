import { buttonToNewPage, initializeFocusTracker } from './shared.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
  buttonToNewPage('first-next', '../bandit-experiment/pre-consent');
});