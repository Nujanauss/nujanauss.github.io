document.getElementById('playButton').addEventListener('click', () => {
    const settings = { timestamp: new Date().toISOString() };
    fetch('/save-settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});

document.getElementById('playButton').addEventListener('click', function() {
    window.location.href = 'game.html';
});