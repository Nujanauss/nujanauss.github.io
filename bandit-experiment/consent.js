document.addEventListener('DOMContentLoaded', async function() {
  document.getElementById('consent-given').addEventListener('click', function() {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
    window.location.href = 'instructions1';
  });
  document.getElementById('consent-rescinded').addEventListener('click', function() {
    window.location.href = 'consent-rescinded';
  });
});
