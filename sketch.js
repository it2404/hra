let targets = [];
let score = 0;
let best = 0;
let timeLeftMs = 0;
let running = false;

let lastSpawn = 0;            // cas posledniho spawnu
let spawnInterval = 700;      // pocatecni interval mezi spawny (ms) - mensi = rychleji
let minSpawnInterval = 250;   // minimalni interval
let spawnDecayRate = 0.02;    // jak rychle se interval zkracuje (ms za ms)
let lastTime = 0;             // pro dt

function setup() {
  createCanvas(800, 500).parent("game-holder");

  textSize(18);
  textAlign(LEFT, TOP);

  // pripojeni Start tlacitka
  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.addEventListener("click", startGame);

  // nacteni best score
  best = Number(localStorage.getItem("reaction_best") || 0);
  document.getElementById("best").textContent = best;

  drawUI();
}

function draw() {
  // pozadi
  background(30, 45, 70);

  if (!running) {
    drawMenu();
    return;
  }

  // vypocet casu
  let now = millis(); // pocet milisekund od startu
  if (!lastTime) lastTime = now; // pokud neni nastaveny cas, tak se nastavi
  let deltaCas = now - lastTime;
  lastTime = now;

  // snizeni spawnInterval postupne, aby se spawn zrychloval
  spawnInterval = max(minSpawnInterval, spawnInterval - deltaCas * spawnDecayRate);
  // odecteni casu
  timeLeftMs -= deltaCas;
  if (timeLeftMs <= 0) stopGame();

  // spawn noveho tvaru, kdyz uplynul interval
  if (now - lastSpawn > spawnInterval) {
    spawnTarget();
    lastSpawn = now;
  }

  // update vsech prvku pole tvaru
  for (let x of targets) {
    x.update();
    x.draw();
  }

  // odstraneni zmizelych tvaru
  targets = targets.filter(x => !x.expired);

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
  // nastaveni z UI
  const seconds = Number(document.getElementById("timeInput").value) || 30;
  const sizeVal = Number(document.getElementById("sizeInput").value) || 45;
  if (typeof Target !== "undefined") Target.defaultSize = sizeVal;

  // reset stavu hry
  targets = [];
  score = 0;
  timeLeftMs = seconds * 1000;
  lastTime = millis();
  lastSpawn = 0;
  running = true;

  // reset spawnovaci rychlosti na pocatecni hodnotu pri startu
  spawnInterval = 700;

  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.style.display = "none";
}

function stopGame() {
  running = false;

  // ulozeni best
  if (score > best) {
    best = score;
    localStorage.setItem("reaction_best", best);
    const bestEl = document.getElementById("best");
    if (bestEl) bestEl.textContent = best;
  }

  const menu = document.getElementById("menuButtons");
  menu.innerHTML = "";

  const btn = document.createElement("button");
  btn.textContent = "Hrát znovu";
  btn.onclick = () => location.reload();

  menu.appendChild(btn);
}

function drawMenu() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(22);
  text("Reaction Game", width / 2, height / 2 - 20);
  textSize(14);
  text("Klikni na Start v panelu", width / 2, height / 2 + 10);
}

function drawUI() {
  // pouze aktualizace HTML statu (canvas uz nic nevypisuje)
  document.getElementById("score").textContent = score;
  document.getElementById("timeLeft").textContent = Math.ceil(timeLeftMs / 1000);
}

function spawnTarget() {
  // vyber typu tvaru podle pravdepodobnosti
  const margin = 40;
  const x = random(margin, width - margin);
  const y = random(margin, height - margin);
  const size = Target.defaultSize;

  let rand = random();
  // pravdepodobnosti: 25% good circle, 25% good square, 25% good star, 25% bad

  if (rand < 0.25) targets.push(new GoodCircle(x, y, size)); // vytvareni tvaru podle pravdepodobnosti

  else if (rand < 0.5) targets.push(new GoodSquare(x, y, size));

  else if (rand < 0.75) targets.push(new GoodStar(x, y, size)); 

  else targets.push(new BadCircle(x, y, size));
}
