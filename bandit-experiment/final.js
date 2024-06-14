import { send_complete } from './backend_integration.js';

document.addEventListener('DOMContentLoaded', async function() {
  const prolificID = JSON.parse(sessionStorage.getItem('playerData')).player.prolificID;
  send_complete(prolificID, JSON.stringify(sessionStorage));
});
