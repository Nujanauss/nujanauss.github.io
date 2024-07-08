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

export function initializeFocusTracker() {
  // Initialize focus object in sessionStorage if not already exists
  if (!sessionStorage.getItem('focus')) {
    const initialFocus = {};
    sessionStorage.setItem('focus', JSON.stringify(initialFocus));
  }

  // Function to update focus data in sessionStorage
  function updateFocusData(focusType) {
    const focusData = JSON.parse(sessionStorage.getItem('focus')) || {};
    const currentTime = new Date().toISOString().split('T')[1];
    const currentPage = window.location.pathname.split('/').pop(); // Get the current HTML file name
    if (!focusData[currentPage]) {
      focusData[currentPage] = {
        'in-focus': [],
        'out-focus': []
      };
    }
    focusData[currentPage][focusType].push(currentTime);
    sessionStorage.setItem('focus', JSON.stringify(focusData));
  }

  // Event listener for visibility change
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
      updateFocusData('in-focus');
    } else {
      updateFocusData('out-focus');
    }
  });
}

export function checkRefresh() {
  const pageAccessedByReload = (
  (window.performance.navigation && window.performance.navigation.type === 1) ||
    window.performance
      .getEntriesByType('navigation')
      .map((nav) => nav.type)
      .includes('reload')
  );
  if (pageAccessedByReload) {
    window.location.href = 'consent-rescinded';
  }
}