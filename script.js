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


function moveLamb() {
  const screen = document.getElementById("screen");
  const maxX = screen.offsetWidth - 64;   // 64 = lebar sprite
  const maxY = screen.offsetHeight - 64;  // 64 = tinggi sprite

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