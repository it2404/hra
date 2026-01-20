class Target {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    // pohyb tvaru
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);

    this.life = random(150, 260); // jak dlouho tvar vydrzi
    this.expired = false;         // oznaceni pro odstraneni
    this.points = 0;              // kolik bodu tvar dava
    this.color = color(200);
  }

  update() {
    // pohyb a odraz od okraju
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 20 || this.x > width - 20) this.vx *= -1;
    if (this.y < 20 || this.y > height - 20) this.vy *= -1;

    // zivotnost
    this.life--;
    if (this.life <= 0) this.expired = true;
  }

  clicked(px, py) {
    // zakladni kolize pro kruh - prepisu mohou mit jine pravidlo
    return dist(px, py, this.x, this.y) < this.size / 2;
  }
}

// dobry kruh
class GoodCircle extends Target {
  constructor(x, y, size) {
    super(x, y, size);
    this.points = 1;
    this.color = color(80, 200, 120);
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

// dobry ctverec
class GoodSquare extends Target {
  constructor(x, y, size) {
    super(x, y, size);
    this.points = 1;
    this.color = color(100, 180, 255);
  }

  draw() {
    noStroke();
    fill(this.color);
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size, 6);
  }
}

// dobra hvezda
class GoodStar extends Target {
  constructor(x, y, size) {
    super(x, y, size);
    this.points = 1;
    this.color = color(255, 205, 60); // zluta barva
    this.points = 1;
  }

  draw() {
    noStroke();
    fill(this.color);
    // vykresleni padesatiprocentni hvezdy (5 hrotu)
    push();
    translate(this.x, this.y);
    beginShape();
    let rOuter = this.size * 0.5;
    let rInner = rOuter * 0.5;
    for (let i = 0; i < 10; i++) {
      let angle = PI/5 * i;
      let r = (i % 2 === 0) ? rOuter : rInner;
      let sx = cos(angle) * r;
      let sy = sin(angle) * r;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    pop();
  }

  // prepis kolize pro hvezdu
  clicked(px, py) {
    return dist(px, py, this.x, this.y) < this.size * 0.45;
  }
}

// spatny kruh
class BadCircle extends Target {
  constructor(x, y, size) {
    super(x, y, size);
    this.points = -1;
    this.color = color(220, 80, 80);
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

// vychozi velikost tvaru
Target.defaultSize = 45;
