import { initializeFocusTracker } from './shared.js';
import { send_complete } from './backend_integration.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
  const prolificID = JSON.parse(sessionStorage.getItem('playerData')).player.prolificID;
  var data = {};
  Object.keys(sessionStorage).forEach(function(key) {
    data[key] = JSON.parse(sessionStorage.getItem(key));
  });
  send_complete(prolificID, JSON.stringify(data, null, 2));
});
