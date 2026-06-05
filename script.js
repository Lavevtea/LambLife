async function enterFullscreen() {

  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    await elem.requestFullscreen();
  }

}

const lamb        = document.getElementById("lamb");
const startBtn    = document.getElementById("startBtn");

const gameButtons = [
  ...document.querySelectorAll(".dpad-btn[data-dir]"),
  document.getElementById("feedBtn"),
  document.getElementById("loveBtn"),
  document.getElementById("playBtn"),
  document.getElementById("sleepBtn"),
].filter(Boolean);

let lambName = "Domba";

startBtn.addEventListener("click", async () => {
  await enterFullscreen();
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("nameOverlay").style.display = "flex";
  document.getElementById("nameInput").focus();
});

document.getElementById("nameOkBtn").addEventListener("click", () => {
  const val = document.getElementById("nameInput").value.trim();
  if (val.length === 0) {
  document.getElementById("nameInput").classList.add("name-error");
  document.getElementById("nameInput").style.borderColor = "#d65f5f";
  document.getElementById("nameInput").placeholder = "min 1 char!";
  return;
  }
  lambName = val.slice(0, 7);
  document.getElementById("nameOverlay").style.display = "none";
  document.getElementById("gameOverlay").style.display = "block";
  document.getElementById("world").style.display       = "block";
  document.getElementById("lambNameDisplay").textContent = lambName;
  gameButtons.forEach(btn => btn && (btn.disabled = false));
  document.querySelectorAll(".dpad-btn[data-dir]")
  .forEach(btn => btn.removeAttribute("disabled"));
  startGame();
});

document.getElementById("nameInput").addEventListener("input", () => {
  document.getElementById("nameInput").classList.remove("name-error");
  document.getElementById("nameInput").style.borderColor = "#C0D470";
  document.getElementById("nameInput").placeholder = "e.g. Fluffy";
});

// document.getElementById("nameInput").addEventListener("keydown", e => {
//   if (e.key === "Enter") document.getElementById("nameOkBtn").click();
// });


const SPEED = 100;

let animFrame = null; 
let lambX = 80;
let lambY = 60;
let keysHeld = new Set(); 

const moveFrames = [
  'assets/lamb_animation/move/move1.png',
  'assets/lamb_animation/move/move2.png',
  'assets/lamb_animation/move/move3.png',
  'assets/lamb_animation/move/move4.png'
];
let moveFrame = 0;
let moveInterval = null;

function startMoveAnim() {
  if (moveInterval) return;
  moveInterval = setInterval(() => {
    moveFrame = (moveFrame + 1) % moveFrames.length;
    document.getElementById('lambSprite').src = moveFrames[moveFrame];
  }, 100);
}

function stopMoveAnim() {
  clearInterval(moveInterval);
  moveInterval = null;
  moveFrame = 0;
}



const idleFrames = [
  'assets/lamb_animation/idle/idle1.png',
  'assets/lamb_animation/idle/idle2.png',
  'assets/lamb_animation/idle/idle3.png',
  'assets/lamb_animation/idle/idle4.png'
];
let idleFrame = 0;
let idleInterval = null;

function startIdleAnim() {
  if (idleInterval) return;
  idleInterval = setInterval(() => {
    idleFrame = (idleFrame + 1) % idleFrames.length;
    document.getElementById('lambSprite').src = idleFrames[idleFrame];
  }, 500);
}

function stopIdleAnim() {
  clearInterval(idleInterval);
  idleInterval = null;
}



const sleepFrames = [
  'assets/lamb_animation/sleep/sleep1.png',
  'assets/lamb_animation/sleep/sleep2.png'
];

let sleepFrame = 0;
let sleepInterval = null;

function startSleepAnim() {
  if (sleepInterval) return;
  sleepInterval = setInterval(() => {
    sleepFrame = (sleepFrame + 1) % sleepFrames.length;
    document.getElementById('lambSprite').src = sleepFrames[sleepFrame];
  }, 500);
}

function stopSleepAnim() {
  clearInterval(sleepInterval);
  sleepInterval = null;
  sleepFrame = 0;
  document.getElementById('lambSprite').src = idleFrames[0]; 
}

let isBusy = false;


const stats = { food: 0, happy: 0, sleep: 0, love: 0 };

function addStat(key) {
  stats[key] = Math.min(100, stats[key] + 25);
  const map = { food: 'foodFill', happy: 'happyFill', sleep: 'sleepFill', love: 'loveFill' };
  document.getElementById(map[key]).style.width = stats[key] + '%';
}


function setBusy(duration, animStart, animStop, statKey) {
  if (isBusy) return;
  isBusy = true;

  stopIdleAnim();
  stopMoveAnim();
  keysHeld.clear();
  animStart();

  gameButtons.forEach(btn => btn && (btn.disabled = true));
  document.querySelectorAll(".dpad-btn[data-dir]")
    .forEach(btn => btn.disabled = true);

  setTimeout(() => {
    animStop();
    if (statKey) addStat(statKey); 
    isBusy = false;
    gameButtons.forEach(btn => btn && (btn.disabled = false));
    document.querySelectorAll(".dpad-btn[data-dir]")
      .forEach(btn => btn.disabled = false);
    startIdleAnim();
  }, duration);
}

document.getElementById("sleepBtn").addEventListener("click", () => {
  setBusy(5000, startSleepAnim, stopSleepAnim, "sleep");
  
});

document.getElementById("feedBtn").addEventListener("click", () => {
  setBusy(3300, playFeedAnim, stopFeedAnim, "food");
});

document.getElementById("loveBtn").addEventListener("click", () => {
  setBusy(5000, playLoveAnim, stopLoveAnim, "love");
});



const feedFrames = [
  'assets/lamb_animation/feed/feed1.png',
  'assets/lamb_animation/feed/feed2.png',
  'assets/lamb_animation/feed/feed3.png',
  'assets/lamb_animation/feed/feed4.png',
  'assets/lamb_animation/feed/feed5.png',
  'assets/lamb_animation/feed/feed6.png',
  'assets/lamb_animation/feed/feed7.png'
];

let feedInterval = null;

function playFeedAnim() {
  let frame = 0;
  const sprite = document.getElementById('lambSprite');
  sprite.src = feedFrames[0];
  
  feedInterval = setInterval(() => {
    frame++;
    if (frame >= feedFrames.length) {
      clearInterval(feedInterval);
      feedInterval = null;
      return;
    }
    sprite.src = feedFrames[frame];
  }, 500);
}

function stopFeedAnim() {
  if (feedInterval) {
    clearInterval(feedInterval);
    feedInterval = null;
  }
}


let loveInterval = null;

const loveFrames = [
  'assets/lamb_animation/love/love1.png',
  'assets/lamb_animation/love/love2.png',
  'assets/lamb_animation/love/love3.png',
]

function playLoveAnim() {
  let frame = 0;
  const sprite = document.getElementById('lambSprite');
  sprite.src = loveFrames[0];

  loveInterval = setInterval(() => {
    frame = frame === 0 ? 1 : 0;
    sprite.src = loveFrames[frame];
  }, 500);
}
function stopLoveAnim() {
  if (loveInterval) {
    clearInterval(loveInterval);
    loveInterval = null;
  }
  document.getElementById('lambSprite').src = idleFrames[0];
}

let facingRight = false;

function updateFacing() {
  const sprite = document.getElementById('lambSprite');
  sprite.style.transform = facingRight ? 'scaleX(-1)' : 'scaleX(1)';
}

function moveLamb(deltaTime) {
  const screen = document.getElementById("screen");
  const maxX = screen.offsetWidth - 67;   
  const maxY = screen.offsetHeight - 77; 

  if (keysHeld.has("left"))  {lambX = Math.max(0, lambX - SPEED*deltaTime);facingRight = false;}
  if (keysHeld.has("right")) {lambX = Math.min(maxX, lambX + SPEED*deltaTime);facingRight = true;}
  if (keysHeld.has("up"))    lambY = Math.max(0, lambY - SPEED*deltaTime);
  if (keysHeld.has("down"))  lambY = Math.min(maxY, lambY + SPEED*deltaTime);

  updateFacing();
  lamb.style.left = lambX + "px";
  lamb.style.top  = lambY + "px";
}

let lastTime = 0;

function gameLoop(timestamp) {
  if (lastTime === 0) lastTime = timestamp;
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (keysHeld.size > 0) moveLamb(deltaTime);
  animFrame = requestAnimationFrame(gameLoop);
}


function startLoop() {
  if (animFrame) return;
  animFrame = requestAnimationFrame(gameLoop);
}

function stopLoop() {
  if (animFrame) {
    cancelAnimationFrame(animFrame);
    animFrame = null;
  }
}

const keyMap = {
  ArrowLeft: "left", ArrowRight: "right",
  ArrowUp: "up",     ArrowDown: "down",
  a: "left", d: "right", w: "up", s: "down"
};

document.addEventListener("keydown", e => {
  if (puzzleOpen) {
    if (e.key === 'J' || e.key === 'j') {
      closePuzzle(false);
    }
    return;
  }
  if (isBusy) return;
  if (document.activeElement.tagName === "INPUT") return;

  if (e.key === "k" || e.key === "K") {
    document.getElementById("sleepBtn").click();
    return;
  }

   if (e.key === "l" || e.key === "L") {
    document.getElementById("feedBtn").click();
    return;
   }

  if (e.key === "i" || e.key === "I") {
    document.getElementById("loveBtn").click();
    return;
   }

  if (e.key === "j" || e.key === "J") {
    document.getElementById("playBtn").click();
    return;
   }

  const dir = keyMap[e.key];
  if (!dir) return;
  e.preventDefault();
  keysHeld.add(dir);
  stopIdleAnim();
  startMoveAnim();
  startLoop();
});

document.addEventListener("keyup", e => {
  if (document.activeElement.tagName === "INPUT") return;
  const dir = keyMap[e.key];
  if (!dir) return;
  keysHeld.delete(dir);
  if (keysHeld.size === 0 && !isBusy) {stopMoveAnim(); startIdleAnim();}
});

function startMove(dir) {
  if (puzzleOpen) return;
  if (isBusy) return;
  keysHeld.add(dir);
  stopIdleAnim();
  startMoveAnim();
  startLoop();
}

function stopMove(dir) {
  keysHeld.delete(dir);
  if (keysHeld.size === 0) {stopMoveAnim(); startIdleAnim();}
}



function startCountdown() {
  let totalSeconds = 3 * 60;
  const timerEl = document.getElementById("timerDisplay");

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  timerEl.textContent = formatTime(totalSeconds);

  const interval = setInterval(() => {
    totalSeconds--;
    if (totalSeconds <= 0) {
      clearInterval(interval);
      timerEl.textContent = "0:00";
      onTimerEnd();
      return;
    }
    timerEl.textContent = formatTime(totalSeconds);
    if (totalSeconds <= 30) {
      timerEl.classList.add("urgent");
    }
  }, 1000);
}

function onTimerEnd() {
  document.getElementById("eidScreen").style.display = "flex";
}

function startGame() {
  document.body.focus();
  startLoop();
  startIdleAnim();
  // startCountdown();
}

document.querySelectorAll(".dpad-btn[data-dir]").forEach(btn => {
  btn.addEventListener("pointerdown", () => startMove(btn.dataset.dir));
  btn.addEventListener("pointerup",   () => stopMove(btn.dataset.dir));
  btn.addEventListener("pointerleave",() => stopMove(btn.dataset.dir));
});




// ============================================================
// SLIDING PUZZLE MINIGAME
// ============================================================

const PUZZLE_IMG = 'assets/puzzle_img.png';
let puzzleOpen   = false;
let puzzleTiles  = [];
let puzzleCursor = { row: 0, col: 0 };
let puzzleGrid   = 3;
let puzzleReward = 50;
let currentMode  = 'medium';

const MODES = {
  easy:   { grid: 2, reward: 25, tileSize: 110 },
  medium: { grid: 3, reward: 50,    tileSize: 80  },
  hard:   { grid: 4, reward: 100,   tileSize: 62  },
};

function switchMode(modeKey) {
  currentMode  = modeKey;
  puzzleGrid   = MODES[modeKey].grid;
  puzzleReward = MODES[modeKey].reward;
  document.querySelectorAll('.mode-sel-btn').forEach(b => {
    b.classList.toggle('active-mode', b.dataset.mode === modeKey);
  });
  shufflePuzzle(puzzleGrid);
  puzzleCursor = { row: 0, col: 0 };
  renderPuzzle();
}

function shufflePuzzle(size) {
  const total = size * size;
  let emptyIdx;
  do {
    puzzleTiles = Array.from({ length: total }, (_, i) => i);
    emptyIdx = total - 1;
    for (let i = 0; i < 300; i++) {
      const neighbors = getMovable(emptyIdx, size);
      const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
      puzzleTiles[emptyIdx] = puzzleTiles[pick];
      puzzleTiles[pick]     = total - 1;
      emptyIdx = pick;
    }
  } while (puzzleTiles.every((v, i) => v === i));
}

function getMovable(emptyIdx, size) {
  const row = Math.floor(emptyIdx / size);
  const col = emptyIdx % size;
  const n   = [];
  if (row > 0)      n.push(emptyIdx - size);
  if (row < size-1) n.push(emptyIdx + size);
  if (col > 0)      n.push(emptyIdx - 1);
  if (col < size-1) n.push(emptyIdx + 1);
  return n;
}

function renderPuzzle() {
  const tileSize = MODES[currentMode].tileSize;
  const grid     = document.getElementById('puzzleGrid');
  const emptyVal = puzzleGrid * puzzleGrid - 1;

  grid.style.gridTemplateColumns = `repeat(${puzzleGrid}, ${tileSize}px)`;
  grid.style.gridTemplateRows    = `repeat(${puzzleGrid}, ${tileSize}px)`;
  grid.innerHTML = '';

  puzzleTiles.forEach((tileNum, idx) => {
    const isEmpty = tileNum === emptyVal;
    const cell    = document.createElement('div');

    cell.className = isEmpty ? 'puzzle-tile empty' : 'puzzle-tile';
    cell.style.width  = tileSize + 'px';
    cell.style.height = tileSize + 'px';

    if (!isEmpty) {
      cell.style.backgroundPosition = `${-(tileNum % puzzleGrid) * tileSize}px ${-Math.floor(tileNum / puzzleGrid) * tileSize}px`;
      cell.style.backgroundSize     = `${puzzleGrid * tileSize}px ${puzzleGrid * tileSize}px`;
      cell.addEventListener('pointerdown', () => tryMoveTile(idx));
    }

    grid.appendChild(cell);
  });
}
  function isSolved() {
    return puzzleTiles.every((v, i) => v === i);
  }

  let puzzleIdleInterval = null;
  let puzzleLambFrame    = 0;

  function startPuzzleLambIdle() {
    if (puzzleIdleInterval) return;
    puzzleIdleInterval = setInterval(() => {
      puzzleLambFrame = (puzzleLambFrame + 1) % idleFrames.length;
      const el = document.getElementById('puzzleLambSprite');
      if (el) el.src = idleFrames[puzzleLambFrame];
    }, 500);
  }

function stopPuzzleLambIdle() {
  clearInterval(puzzleIdleInterval);
  puzzleIdleInterval = null;
  puzzleLambFrame    = 0;
}

function playPuzzleLoveAnim(cb) {
  stopPuzzleLambIdle();
  let frame = 0;
  const el  = document.getElementById('puzzleLambSprite');
  if (el) el.src = loveFrames[0];
  const iv = setInterval(() => {
    frame = frame === 0 ? 1 : 0;
    if (el) el.src = loveFrames[frame];
  }, 500);
  setTimeout(() => { clearInterval(iv); if (cb) cb(); }, 2500);
}

function openPuzzle() {
  if (isBusy) return;
  isBusy = true;
  stopIdleAnim();
  stopMoveAnim();
  keysHeld.clear();
  gameButtons.forEach(btn => btn && (btn.disabled = true));
  document.querySelectorAll('.dpad-btn[data-dir]').forEach(btn => btn.disabled = true);

  switchMode('medium');
  document.getElementById('puzzleOverlay').classList.add('active');
  puzzleOpen = true;
  startPuzzleLambIdle();
}

function closePuzzle(won) {
  if (won) {
    playPuzzleLoveAnim(() => {
      stopPuzzleLambIdle();
      document.getElementById('puzzleOverlay').classList.remove('active');
      puzzleOpen = false;
      stats.happy = Math.min(100, stats.happy + puzzleReward);
      document.getElementById('happyFill').style.width = stats.happy + '%';
      exitPuzzleState();
    });
  } else {
    stopPuzzleLambIdle();
    document.getElementById('puzzleOverlay').classList.remove('active');
    puzzleOpen = false;
    exitPuzzleState();
  }
}

function exitPuzzleState() {
  isBusy = false;
  gameButtons.forEach(btn => btn && (btn.disabled = false));
  document.querySelectorAll('.dpad-btn[data-dir]').forEach(btn => btn.disabled = false);
  document.getElementById('puzzleExitBtn').disabled = false;
  document.querySelectorAll('.mode-sel-btn').forEach(b => b.disabled = false);
  startIdleAnim();
}

function tryMoveTile(idx) {
  if (!puzzleOpen) return;
  const emptyVal = puzzleGrid * puzzleGrid - 1;
  const emptyIdx = puzzleTiles.indexOf(emptyVal);
  const cr = Math.floor(idx     / puzzleGrid), cc = idx     % puzzleGrid;
  const er = Math.floor(emptyIdx / puzzleGrid), ec = emptyIdx % puzzleGrid;
  if ((Math.abs(cr - er) + Math.abs(cc - ec)) !== 1) return;
  puzzleTiles[emptyIdx] = puzzleTiles[idx];
  puzzleTiles[idx]      = emptyVal;
  renderPuzzle();
  if (isSolved()) showLastTileAndComplete();
}

function showLastTileAndComplete() {
  document.getElementById('puzzleExitBtn').disabled = true;
  document.querySelectorAll('.mode-sel-btn').forEach(b => b.disabled = true);
  puzzleOpen = false;
  const tileSize = MODES[currentMode].tileSize;
  const emptyVal = puzzleGrid * puzzleGrid - 1;
  const grid     = document.getElementById('puzzleGrid');
  const cells    = grid.children;

  const emptyIdx = puzzleTiles.indexOf(emptyVal);
  const cell     = cells[emptyIdx];

  const col = emptyVal % puzzleGrid;
  const row = Math.floor(emptyVal / puzzleGrid);

  cell.style.transition        = 'opacity 1.5s ease';
  cell.style.opacity           = '0';
  cell.style.backgroundImage   = `url('${PUZZLE_IMG}')`;
  cell.style.backgroundSize    = `${puzzleGrid * tileSize}px ${puzzleGrid * tileSize}px`;
  cell.style.backgroundPosition= `${-col * tileSize}px ${-row * tileSize}px`;
  cell.style.backgroundRepeat  = 'no-repeat';
  cell.style.backgroundColor   = 'transparent';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cell.style.opacity = '1';
    });
  });

  setTimeout(() => closePuzzle(true), 2000);
}

document.getElementById('playBtn').addEventListener('click', () => openPuzzle());
document.getElementById('puzzleExitBtn').addEventListener('click', () => closePuzzle(false));
document.querySelectorAll('.mode-sel-btn').forEach(btn => {
  btn.addEventListener('click', () => switchMode(btn.dataset.mode));
});