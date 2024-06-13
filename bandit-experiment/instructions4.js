import { buttonToNewPage, getGameSettings } from './shared.js';

const settings = getGameSettings();

if (settings.stochastic) {
  document.getElementById('how-much-to-score').innerHTML = 'During the training round, we will not restrict the number of moves you have. Your task is to achieve a score above 500 by clicking on the the cards.'
}
buttonToNewPage('trainingButton', 'training');
