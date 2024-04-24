document.addEventListener('DOMContentLoaded', function() {
    const mazeTaskBtn = document.getElementById('mazeTaskBtn');
    if (mazeTaskBtn) {
      let newUrlMaze = '/gridworld-game-maze/index.html';
      mazeTaskBtn.addEventListener('click',  function() { window.location.href = newUrlMaze; });
    }
    const corridorTaskBtn = document.getElementById('corridorTaskBtn');
    if (corridorTaskBtn) {
      let newUrlCorridor = '/gridworld-game-corridor/public/index.html';
      corridorTaskBtn.addEventListener('click',  function() { window.location.href = newUrlCorridor; });
    }
    const armTaskBtn = document.getElementById('armTaskBtn');
    if (armTaskBtn) {
      let newUrlArm = '/gridworld-game-arms/public/index.html';
      armTaskBtn.addEventListener('click',  function() { window.location.href = newUrlArm; });
    }
});