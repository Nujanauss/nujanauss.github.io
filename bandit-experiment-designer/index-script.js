document.addEventListener('DOMContentLoaded', async function() {
  const vars = await loadGameSettings();
  for (const [key, value] of Object.entries(vars)) {
    sessionStorage.setItem(key, value);
  }

  async function loadGameSettings() {
      const response = await fetch('settings.json');
      const data = await response.json();
      return validateVars(data.vars);
  }

  function validateVars(variables) {
      validateVar(variables, 'gridSize', 30, 2, 200);
      validateVar(variables, 'corridorWidth', 3, 1, variables.gridSize);
      validateVar(variables, 'roomFrequency', 5, 0, variables.gridSize);
      validateVar(variables, 'roomSize', 3, 1, variables.roomFrequency * 2);
      validateVar(variables, 'roomsVisitedTillReward', 2, 1, 12);
      validateVar(variables, 'initialPosX', 0, 0, variables.gridSize - 1);
      validateVar(variables, 'initialPosY', (variables.gridSize / 2), 0, variables.gridSize - 1);
      validateVar(variables, 'actionStochasticity', 0, 0, 1);
      validateVar(variables, 'greenSquareScore', 10, 1);
      validateVar(variables, 'purpleSquareScore', 1000, variables.greenSquareScore);
      validateVar(variables, 'maxNoGreenSquares', 2, 0);
      validateVar(variables, 'greenSquarePosRange', 2, 0, variables.gridSize - 1);
      validateVar(variables, 'purpleSquarePosRange', 2, 0, variables.gridSize - 1);
      return variables;
  }

    function validateVar(variables, varName, defaultValue, minValue, maxValue) {
      maxValue = maxValue !== undefined ? maxValue : Infinity;

      if (variables[varName] === undefined || variables[varName] < minValue || variables[varName] > maxValue) {
          console.error(`Invalid ${varName}! Setting to default: ${defaultValue}`);
          variables[varName] = defaultValue;
      }
    }
  
  document.getElementById('nextButton1').addEventListener('click', function() {
    window.location.href = 'instructions2.html';
  });
});
