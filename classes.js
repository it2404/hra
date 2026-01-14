class Target {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.life = random(120, 240); 
    this.expired = false;
    this.points = 0;
    this.color = color(200); 
  }

  update() {
    this.life--;
    if (this.life <= 0) this.expired = true;
  }

  clicked(px, py) {
    return dist(px, py, this.x, this.y) < this.size / 2;
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

class GoodTarget extends Target {
  constructor(x, y, size) {
    super(x, y, size);
    this.points = 1;
    this.color = color(80, 200, 120);
  }
}

class BadTarget extends Target {
  constructor(x, y, size) {
    super(x, y, size);
    this.points = -1;
    this.color = color(220, 80, 80);
  }
}

Target.defaultSize = 45;
