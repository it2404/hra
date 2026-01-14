let targets = [];         
let score = 0;           
let best = 0;              
let timeLeftMs = 0;      
let running = false;     
let lastSpawn = 0;         
let spawnInterval = 900;    
let lastTime = 0;           

function setup() {
  createCanvas(800, 500).parent("game-holder");

  textSize(18);
  textAlign(LEFT, TOP);

  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.addEventListener("click", startGame);

  best = Number(localStorage.getItem("reaction_best") || 0);
  const bestEl = document.getElementById("best");
  if (bestEl) bestEl.textContent = String(best);

  drawUI();
}

function draw() {
  background(30, 45, 70);

  if (!running) {
    drawMenuOrEnd();
    return;
  }

  const now = millis();
  if (!lastTime) lastTime = now;
  const dt = now - lastTime;
  lastTime = now;

  timeLeftMs -= dt;
  if (timeLeftMs <= 0) {
    timeLeftMs = 0;
    stopGame();
  }

  if (now - lastSpawn >= spawnInterval) {
    spawnTarget();
    lastSpawn = now;
  }

  for (let t of targets) {
    t.update();
    t.draw();
  }

  targets = targets.filter(t => !t.expired);

  drawUI();
}

function mousePressed() {
  if (!running) return;

  let hit = false;
  for (let i = targets.length - 1; i >= 0; i--) {
    if (targets[i].clicked(mouseX, mouseY)) {
      score += targets[i].points;   
      targets[i].expired = true;
      hit = true;
      break;
    }
  }

  if (!hit) score = max(0, score - 1);
}

function startGame() {
  const seconds = Number(document.getElementById("timeInput").value) || 30;
  const sizeVal = Number(document.getElementById("sizeInput").value) || 45;
  if (typeof Target !== "undefined") Target.defaultSize = sizeVal;

  targets = [];
  score = 0;
  timeLeftMs = seconds * 1000;
  lastSpawn = 0;
  lastTime = millis();
  running = true;

  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.style.display = "none";
}

function stopGame() {
  running = false;

  if (score > best) {
    best = score;
    localStorage.setItem("reaction_best", String(best));
    const bestEl = document.getElementById("best");
    if (bestEl) bestEl.textContent = String(best);
  }

  const menuDiv = document.getElementById("menuButtons");
  menuDiv.innerHTML = "";
  const rb = document.createElement("button");
  rb.textContent = "Hrát znovu";
  rb.onclick = () => {
    menuDiv.innerHTML = '<button id="startBtn">Start</button>';
    document.getElementById("startBtn").addEventListener("click", startGame);
    lastTime = 0;
    drawUI();
  };
  menuDiv.appendChild(rb);
}

function drawMenuOrEnd() {
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Reaction Game", width / 2, height / 2 - 40);
  textSize(14);
  text("Použij panel vpravo → Start", width / 2, height / 2 - 10);
  pop();
  drawUI();
}

function drawUI() {
  fill(255);
  textAlign(LEFT, TOP);

  const scoreEl = document.getElementById("score");
  const timeEl = document.getElementById("timeLeft");
  if (scoreEl) scoreEl.textContent = String(score);
  if (timeEl) timeEl.textContent = String(Math.ceil(timeLeftMs / 1000));
}

function spawnTarget() {
  const margin = 40;
  const x = random(margin, width - margin);
  const y = random(margin, height - margin);
  const size = Target.defaultSize || random(30, 60);
  // 70% šance na dobrý, 30% na špatný
  if (random() < 0.7) targets.push(new GoodTarget(x, y, size));
  else targets.push(new BadTarget(x, y, size));
}
