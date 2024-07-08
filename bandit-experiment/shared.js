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
  document.addEventListener('DOMContentLoaded', () => {
    console.log("here");
    const pathArray = window.location.pathname.split('/');
    console.log(pathArray);
    const experimentName = pathArray[1];
    console.log(experimentName);
    
    // Check if the page was refreshed
    const refreshed = localStorage.getItem('refreshed');
    console.log(`Refreshed: ${refreshed}`);
    
    if (refreshed === 'true') {
        // Redirect to another page if the page was refreshed
        window.location.href = './consent-rescinded.html';
        return;
    }

    // Set refreshed flag to true
    localStorage.setItem('refreshed', 'true');
  });

  window.addEventListener('beforeunload', () => {
    // Set a flag in sessionStorage to indicate that the page is being unloaded
    sessionStorage.setItem('is_unloading', 'true');
  });

  window.addEventListener('load', () => {
    // Check if the page was being unloaded
    if (sessionStorage.getItem('is_unloading') === 'true') {
      sessionStorage.removeItem('is_unloading');
    } else {
      // The page was not being unloaded, hence it was a refresh
      localStorage.setItem('refreshed', 'false');
    }
  });
}

export function checkRefresh2() {
  document.addEventListener('DOMContentLoaded', () => {
    const refreshed = localStorage.getItem('refreshed');
    if (refreshed === 'true') {
      window.location.href = './consent-rescinded.html';
      return;
    }
  });

  window.addEventListener('keydown', (event) => {
    // Check for F5 (keyCode 116) or Ctrl+R (Ctrl key + R keyCode 82)
    if (event.keyCode === 116 || (event.ctrlKey && event.keyCode === 82)) {
      localStorage.setItem('refreshed', 'true');
    }
  });

  window.addEventListener('beforeunload', () => {
    // Set a flag in sessionStorage to indicate that the page is being unloaded
    sessionStorage.setItem('is_unloading', 'true');
  });

  window.addEventListener('load', () => {
    // Check if the page was being unloaded
    if (sessionStorage.getItem('is_unloading') === 'true') {
      sessionStorage.removeItem('is_unloading');
    } else {
      // The page was not being unloaded, hence it was a refresh
      localStorage.setItem('refreshed', 'false');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Reset the refresh flag when the tab is brought back into view
      localStorage.setItem('refreshed', 'false');
    }
  });

  // Function to detect if the refresh button is clicked
  function detectRefreshButtonClick() {
    const beforeRefreshUrl = window.location.href;
    window.addEventListener('unload', () => {
      setTimeout(() => {
        const afterRefreshUrl = window.location.href;
        if (beforeRefreshUrl === afterRefreshUrl) {
          localStorage.setItem('refreshed', 'true');
        }
      }, 0);
    });
  }

  detectRefreshButtonClick();
}