import { getUrlParameter, getGameSettings, initializeFocusTracker } from './shared.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', function() {
  const settings = getGameSettings();

  const butt = document.getElementById('prebegin2');
  butt.addEventListener('click', generate);
  
  if (!settings.includeComparison) {
    Array.from(document.getElementsByClassName('hide-on-comparison')).forEach(element => element.style.display = 'none');
    butt.innerHTML = 'Play';
    document.getElementById('play-command').style.visibility = 'visible';
    document.getElementById('comparison-text').style.display = 'none';
  } else {
    if (!settings.comparisonOnNewPage) {
      if (settings.comparisonFrequency < 2) {
        document.getElementById('comparison-text').innerHTML = 'Every move, we will show you the average score of another player who previously played with exactly the same cards as you.';
      } else {
        document.getElementById('comparison-text').innerHTML = 'Every ' + settings.comparisonFrequency + ' moves, we will show you the average score of another player who previously played with exactly the same cards as you.';
      }
    } else {
      if (settings.numberOfRounds > 1) {
        if (settings.numberOfRounds / settings.comparisonFrequencyRounds > 1.999) {
          if (settings.comparisonFrequencyRounds == 1) {
          document.getElementById('comparison-text').innerHTML = 'You will play ' + settings.numberOfRounds + ' trials in total. Every trial, we will show you the average score of another player who previously played with exactly the same cards as you.'
          } else {
            document.getElementById('comparison-text').innerHTML = 'You will play ' + settings.numberOfRounds + ' trials in total. Every ' + settings.comparisonFrequencyRounds + ' trials, we will show you the average score of another player who previously played with exactly the same cards as you.'
          }
        } else {
          document.getElementById('comparison-text').innerHTML = 'You will play ' + settings.numberOfRounds + ' trials in total. After trial ' + settings.comparisonFrequencyRounds + ' we will show you the average score of another player who previously played with exactly the same cards as you.'
        }
      }
    }
  }

  var pressedOnce = false;
  function generate() {
    if (!settings.includeComparison) {
      window.location.href = 'game?usr=lumi7el';
      return;
    }
    if (butt.disabled) {
      return;
    }
    if (!pressedOnce) {
      document.querySelector('.loader').style.display = 'block';

      pressedOnce = true;
      butt.disabled = true;
      butt.classList.remove('enabled');
      butt.style.cursor = 'not-allowed';
      butt.style.color = 'grey';
      setTimeout(() => {
        document.getElementById('comparer').style.visibility = 'visible';
        document.getElementById('comparer-name').innerHTML = 'n3ssiori';
        document.querySelector('.loader').style.display = 'none';
        var clock = document.getElementById('clock');
        var startTime = new Date();
        startTime.setHours(startTime.getHours() - 3);
        startTime.setMinutes(startTime.getMinutes() - 14);
        startTime.setSeconds(startTime.getSeconds() - 12); // Set start time to 3 hours, 14 minutes, and 12 seconds ago
        function updateClock() {
          var currentTime = new Date();
          
          var elapsedTime = currentTime - startTime; // Get the elapsed time in milliseconds
          var seconds = Math.floor(elapsedTime / 1000); // Convert milliseconds to seconds
          
          var hours = Math.floor(seconds / 3600); // Calculate hours
          seconds %= 3600;
          var minutes = Math.floor(seconds / 60); // Calculate minutes
          seconds %= 60; // Calculate remaining seconds
          
          clock.textContent = hours + ':' + minutes.toString().padStart(2, '0') + '.' + seconds.toString().padStart(2, '0');
        }
        setInterval(updateClock, 10); // Update the clock every 10 milliseconds
      }, 6530);
      
      setTimeout(() => {
        document.getElementById('play-command').style.visibility = 'visible';
        butt.disabled = false;
        butt.innerHTML = 'Play';
        butt.classList.add('enabled');
        butt.style.color = 'black';
        butt.style.cursor = 'pointer';
      }, 8000);
    } else {
      window.location.href = 'game?usr=lumi7el&cmr=n3ssiori';
    }
  }
});
