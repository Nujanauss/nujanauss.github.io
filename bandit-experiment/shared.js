export function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || '';
}

export function getScoresSoFar() {
  const urlParams = new URLSearchParams(window.location.search);
  const scores = [];
  urlParams.forEach((value, key) => {
      if (key.startsWith('score')) {
          scores.push(parseFloat(value));
      }
  });
  return scores;
}

export function getComparersScoresSoFar() {
  const urlParams = new URLSearchParams(window.location.search);
  const scores = [];
  urlParams.forEach((value, key) => {
      if (key.startsWith('n3ssiori')) {
          scores.push(parseFloat(value));
      }
  });
  return scores;
}

export function getGameSettings() {
    const settings = sessionStorage.getItem('gameSettings');
    return settings ? JSON.parse(settings) : {};
}

export function nextRound() {
  const urlParams = new URLSearchParams(window.location.search);
  let round = urlParams.get('round');
  round = parseInt(round) + 1; // Convert to integer and increment by one
  urlParams.set('round', round); // Update the 'round' parameter with the new value
  let newUrl = 'game?';
  urlParams.forEach((value, key) => {
      newUrl += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });
  window.location.href = newUrl;
}

export function buttonToNewPage(buttonId, newPageHTML) {
  document.getElementById(buttonId).addEventListener('click', function() {
    addToInstructionTimings(buttonId, new Date().toISOString().split('T')[1]);
    window.location.href = newPageHTML;
  });
}

function addToInstructionTimings(buttonId, timestamp) {
  let instructionTimings = JSON.parse(sessionStorage.getItem('instructionTimings'));

  if (!instructionTimings) {
    instructionTimings = {
      instruction: {}
    };
  }

  instructionTimings.instruction[buttonId] = {
    time: timestamp
  };

  sessionStorage.setItem('instructionTimings', JSON.stringify(instructionTimings));
}
