import { getGameSettings, buttonToNewPage } from './shared.js';

document.addEventListener('DOMContentLoaded', async function() {
    var para1 = document.getElementById('one');
    var para2 = document.querySelector('#two .blue-coloured');
    var para3 = document.getElementById('three');
    const settings = getGameSettings();

    if (settings.numberOfRounds < 2) {
      para1.innerHTML = 'You will have a set number of moves to make. Once you run out of moves, the experiment is over.';
      if (settings.stochastic == true) {
        if (settings.binary == false) {
          para2.innerHTML = 'After every move, each card will slightly change how much it rewards you.';
        } else {
          para2.innerHTML = 'After every move, the chance that a card will reward you will slightly change.';
        }
      } else {
        if (settings.binary == false) {
          para2.innerHTML = 'Each card will provide a fixed reward, which is the same every move.';
        } else {
          para2.innerHTML = 'Each card has a fixed chance of rewarding you. And this chance is the same in every move.';
        }
      }
    } else {
      para1.innerHTML = 'You will have ' + settings.numberOfRounds + ' trials to maximise your score. In each trial, you will have ' + settings.moves + ' moves. Once you run out of moves, the trial is over.';
      if (settings.stochastic == true) {
        if (settings.binary == false) {
          if (settings.rewardsChangeAcrossRounds == false) {
            para2.innerHTML = 'After every move, each card will slightly change how much it rewards you. However, these changes are the same in every trial.';
          } else {
            para2.innerHTML = 'After every move, each card will slightly change how much it rewards you.';
          }
        } else {
          para2.innerHTML = 'After every move, the chance that a card will reward you will slightly change.';
        }
      } else {
        if (settings.binary == false) {
          para2.innerHTML = 'Each card will provide a fixed reward, which is the same in every trial.';
        } else {
          para2.innerHTML = 'Each card has a fixed chance of rewarding you. And this chance is the same in every trial.';
        }
      }
    }
    buttonToNewPage('nextButton2', 'instructions3');
});