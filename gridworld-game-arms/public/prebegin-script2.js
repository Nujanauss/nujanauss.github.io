import { getUrlParameter } from './shared.js';

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('begin').addEventListener('click', function() {
    window.location.href = 'game.html';
  });

  document.getElementById('comparer').innerHTML = getUrlParameter('cmr');

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
});
