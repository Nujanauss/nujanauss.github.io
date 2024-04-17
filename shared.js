export function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || '';
}

export function getScoresSoFar() {
  const urlParams = new URLSearchParams(window.location.search);
  const scores = [];
  urlParams.forEach((value, key) => {
      if (key.startsWith('score')) {
          scores.push(parseFloat(value));
      }
  });
  return scores;
}

export function nextRound() {
  const urlParams = new URLSearchParams(window.location.search);
  let newUrl = 'game.html?';
  urlParams.forEach((value, key) => {
      newUrl += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
  });
  window.location.href = newUrl;
}