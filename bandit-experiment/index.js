import { buttonToNewPage, initializeFocusTracker } from './shared.js';
import { create_participant, get_prolific_id } from './backend_integration.js';

initializeFocusTracker();

document.addEventListener('DOMContentLoaded', async function() {
  //const response = await create_participant(get_prolific_id());
  //if (response == null) {
  //  window.location.href = 'consent-rescinded';
  //  return;
  //}
  buttonToNewPage('first-next', 'pre-consent');
});