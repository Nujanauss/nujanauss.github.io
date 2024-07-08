import { send_complete, initializeFocusTracker } from './backend_integration.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
  const prolificID = JSON.parse(sessionStorage.getItem('playerData')).player.prolificID;
  send_complete(prolificID, JSON.stringify(sessionStorage));
});
