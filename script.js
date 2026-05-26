const lamb        = document.getElementById("lamb");
const startBtn    = document.getElementById("startBtn");

const gameButtons = [
  ...document.querySelectorAll(".dpad-btn[data-dir]"),
  document.getElementById("feedBtn"),
  document.getElementById("petBtn"),
  document.getElementById("playBtn"),
  document.getElementById("sleepBtn"),
  document.getElementById("feedMini"),
  document.getElementById("petMini"),
];

startBtn.addEventListener("click", () => {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("hud").style.display         = "flex";
  document.getElementById("world").style.display       = "block";
  gameButtons.forEach(btn => btn.disabled = false);
  startGame();
});

const STEP = 16;
const TICK = 150;

let lambX = 80;
let lambY = 60;
let keysHeld = new Set();
let moveLoop = null;

function moveLamb() {
  const world = document.getElementById("world");
  const maxX = world.offsetWidth - 40;
  const maxY = world.offsetHeight - 40;

  if (keysHeld.has("left"))  lambX = Math.max(0, lambX - STEP);
  if (keysHeld.has("right")) lambX = Math.min(maxX, lambX + STEP);
  if (keysHeld.has("up"))    lambY = Math.max(0, lambY - STEP);
  if (keysHeld.has("down"))  lambY = Math.min(maxY, lambY + STEP);

  lamb.style.left = lambX + "px";
  lamb.style.top  = lambY + "px";
}

function startLoop() {
  if (moveLoop) return;
  moveLamb(); // instant first step
  moveLoop = setInterval(moveLamb, TICK);
}

function stopLoop() {
  if (keysHeld.size === 0) {
    clearInterval(moveLoop);
    moveLoop = null;
  }
}

const keyMap = {
  ArrowLeft: "left", ArrowRight: "right",
  ArrowUp: "up",     ArrowDown: "down",
  a: "left", d: "right", w: "up", s: "down"
};

document.addEventListener("keydown", e => {
  const dir = keyMap[e.key];
  if (!dir) return;
  e.preventDefault(); // stop page scrolling on arrows
  keysHeld.add(dir);
  startLoop();
});

document.addEventListener("keyup", e => {
  const dir = keyMap[e.key];
  if (!dir) return;
  keysHeld.delete(dir);
  stopLoop();
});

// D-pad buttons (still single direction, touch doesn't do diagonal)
function startMove(dir) {
  keysHeld.add(dir);
  startLoop();
}

function stopMove(dir) {
  keysHeld.delete(dir);
  stopLoop();
}

document.querySelectorAll(".dpad-btn[data-dir]").forEach(btn => {
  btn.addEventListener("pointerdown", () => startMove(btn.dataset.dir));
  btn.addEventListener("pointerup",   () => stopMove(btn.dataset.dir));
  btn.addEventListener("pointerleave",() => stopMove(btn.dataset.dir));
});