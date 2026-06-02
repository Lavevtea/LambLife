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
  document.getElementById("petBtn"),
  document.getElementById("playBtn"),
  document.getElementById("sleepBtn"),
].filter(Boolean);

let lambName = "Domba";

startBtn.addEventListener("click", async () => {
  await enterFullscreen();
  document.getElementById("startScreen").style.display = "none";
  // tampilkan name overlay dulu
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


const SPEED = 2;

let animFrame = null; 
let lambX = 80;
let lambY = 60;
let keysHeld = new Set(); 

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

function setBusy(duration, animStart, animStop) {
  if (isBusy) return;
  isBusy = true;

  stopIdleAnim();
  keysHeld.clear();
  animStart();

  gameButtons.forEach(btn => btn && (btn.disabled = true));
  document.querySelectorAll(".dpad-btn[data-dir]")
    .forEach(btn => btn.disabled = true);

  setTimeout(() => {
    animStop();
    isBusy = false;
    gameButtons.forEach(btn => btn && (btn.disabled = false));
    document.querySelectorAll(".dpad-btn[data-dir]")
      .forEach(btn => btn.disabled = false);
    startIdleAnim();
  }, duration);
}

document.getElementById("sleepBtn").addEventListener("click", () => {
  setBusy(5000, startSleepAnim, stopSleepAnim);
});






function moveLamb() {
  const screen = document.getElementById("screen");
  const maxX = screen.offsetWidth - 64;   
  const maxY = screen.offsetHeight - 64; 

  if (keysHeld.has("left"))  lambX = Math.max(0, lambX - SPEED); 
  if (keysHeld.has("right")) lambX = Math.min(maxX, lambX + SPEED);
  if (keysHeld.has("up"))    lambY = Math.max(0, lambY - SPEED);
  if (keysHeld.has("down"))  lambY = Math.min(maxY, lambY + SPEED);

  lamb.style.left = lambX + "px";
  lamb.style.top  = lambY + "px";
}

function gameLoop() {
  if (keysHeld.size > 0) moveLamb();
  animFrame = requestAnimationFrame(gameLoop);
}


function startLoop() {
  if (animFrame) return;
  animFrame = requestAnimationFrame(gameLoop);
}

function stopLoop() {

}

const keyMap = {
  ArrowLeft: "left", ArrowRight: "right",
  ArrowUp: "up",     ArrowDown: "down",
  a: "left", d: "right", w: "up", s: "down"
};

document.addEventListener("keydown", e => {
  if (isBusy) return;
  if (document.activeElement.tagName === "INPUT") return;

  if (e.key === "k" || e.key === "K") {
    document.getElementById("sleepBtn").click();
    return;
  }

  const dir = keyMap[e.key];
  if (!dir) return;
  e.preventDefault();
  keysHeld.add(dir);
  stopIdleAnim();
  startLoop();
});

document.addEventListener("keyup", e => {
  if (document.activeElement.tagName === "INPUT") return;
  const dir = keyMap[e.key];
  if (!dir) return;
  keysHeld.delete(dir);
  if (keysHeld.size === 0 && !isBusy) startIdleAnim();
  stopLoop();
});

// D-pad buttons (still single direction, touch doesn't do diagonal)
function startMove(dir) {
  if (isBusy) return;
  keysHeld.add(dir);
  stopIdleAnim();
  startLoop();
}

function stopMove(dir) {
  keysHeld.delete(dir);
  if (keysHeld.size === 0) startIdleAnim();
  stopLoop();
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
  startLoop();
  startIdleAnim();
  startCountdown();
}

document.querySelectorAll(".dpad-btn[data-dir]").forEach(btn => {
  btn.addEventListener("pointerdown", () => startMove(btn.dataset.dir));
  btn.addEventListener("pointerup",   () => stopMove(btn.dataset.dir));
  btn.addEventListener("pointerleave",() => stopMove(btn.dataset.dir));
});