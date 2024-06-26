import { getGameSettings, buttonToNewPage, initializeFocusTracker } from './shared.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
    var para1 = document.getElementById('one');
    var para2 = document.querySelector('#two .blue-coloured');
    var para3 = document.getElementById('three');
    const settings = getGameSettings();

    if (settings.numberOfRounds < 2) {
      para1.innerHTML = 'You will have a set number of trials to make. Once you run out of trials, the experiment is over.';
      if (settings.stochastic == true) {
        if (settings.binary == false) {
          para2.innerHTML = 'After every trial, each card will change how much it rewards you.';
        } else {
          para2.innerHTML = 'After every trial, the chance that a card will reward you will change.';
        }
      } else {
        if (settings.binary == false) {
          para2.innerHTML = 'Each card will provide a fixed reward, which is the same every trial.';
        } else {
          para2.innerHTML = 'Each card has a fixed chance of rewarding you. And this chance is the same in every trial.';
        }
      }
    } else {
      para1.innerHTML = 'You will have ' + settings.numberOfRounds + ' rounds to maximise your score. In each round, you will have ' + settings.moves + ' trials. Once you run out of trials, the round is over.';
      if (settings.stochastic == true) {
        if (settings.binary == false) {
          if (settings.rewardsChangeAcrossRounds == false) {
            para2.innerHTML = 'After every trial, each card will change how much it rewards you. However, these changes are the same in every round.';
          } else {
            para2.innerHTML = 'After every trial, each card will change how much it rewards you.';
          }
        } else {
          para2.innerHTML = 'After every trial, the chance that a card will reward you will change.';
        }
      } else {
        if (settings.binary == false) {
          para2.innerHTML = 'Each card will provide a fixed reward, which is the same in every round.';
        } else {
          para2.innerHTML = 'Each card has a fixed chance of rewarding you. And this chance is the same in every round.';
        }
      }
    }
    buttonToNewPage('nextButton2', 'instructions3');
    buttonToNewPage('backButton2', 'instructions1');
});