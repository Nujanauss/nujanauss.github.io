document.addEventListener('DOMContentLoaded', async function() {
  document.getElementById('consent-given').addEventListener('click', function() {
    window.location.href = 'instructions1.html';
  });
  document.getElementById('consent-rescinded').addEventListener('click', function() {
    window.location.href = 'consent-rescinded.html';
  });
});