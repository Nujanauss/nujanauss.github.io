document.addEventListener('DOMContentLoaded', async function() {
  async function loadGameSettings() {
    const response = await fetch('settings.json');
    const data = await response.json();
    return data.vars;
  }

  const vars = await loadGameSettings();

  sessionStorage.setItem('gameSettings', JSON.stringify(vars));

  document.getElementById('nextButton1').addEventListener('click', function() {
    window.location.href = 'instructions2.html';
  });
});
