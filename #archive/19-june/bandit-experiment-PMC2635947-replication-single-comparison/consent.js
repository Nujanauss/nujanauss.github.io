document.addEventListener('DOMContentLoaded', async function() {
  document.getElementById('consent-given').addEventListener('click', function() {
    window.location.href = 'data-protection';
  });
  document.getElementById('consent-rescinded').addEventListener('click', function() {
    window.location.href = 'consent-rescinded';
  });
});
