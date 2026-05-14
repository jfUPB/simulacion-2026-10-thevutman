let particles = [];
let smoke = [];
let flowScale = 0.004;

let song;
let fft;
let amp;

let mode = 0;
let t = 0;

const PALETTES = [
  [150, 200, 255],
  [255, 80, 200],
  [255, 180, 0]
];

function preload() {
  song = loadSound("sixdays.mp3");
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.mouseClicked(togglePlay);

  fft = new p5.FFT();
  amp = new p5.Amplitude();

  song.disconnect(); 
  song.connect(fft);       
  song.connect();  

  for (let i = 0; i < 500; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {

  background(0, 15);

  fft.analyze();

  let level = amp.getLevel();
  let bass = fft.getEnergy(20, 120);
  let mid = fft.getEnergy(120, 400);
  let treble = fft.getEnergy(400, 2000);


  let intensity = map(level, 0, 0.3, 0.5, 3);
  let chaos = map(bass, 0, 255, 0, 2);

  let col = PALETTES[mode];

  if (mid > 200) drawRearLights(mid);

  if (mid > 200 && frameCount % 3 === 0) {
    for (let i = 0; i < 3; i++) {
        let x = random(width);
        let y = random(height);

        smoke.push(new Smoke(x, y));
    }
  }

  if (bass > 245) {
    for (let i = 0; i < 3; i++) {

        let y = random(height);

        let w = random(width * 0.3, width);

        noStroke();

        // glow
        fill(255, 200, 100, 20);
        rect(0, y, w, 20);

        // luz fuerte
        fill(255, 220, 120, 80);
        rect(0, y, w, 4);
    }
  }




  for (let p of particles) {

    let n = noise(p.pos.x * flowScale, p.pos.y * flowScale, t);
    let angle = map(n, 0, 1, -PI, PI);

    angle += chaos;

    let force = p5.Vector.fromAngle(angle);
    force.mult(0.3 * intensity);

    p.applyForce(force);

    if (bass > 200) {
        let center = createVector(width / 2, height / 2);
        let dir = p5.Vector.sub(center, p.pos);

        let distance = dir.mag();
        dir.normalize();

        let strength = map(distance, 0, width, 0.2, 0.01);
        dir.mult(strength);

        p.applyForce(dir);
    }

    if (bass < 180) {
        let center = createVector(width / 2, height / 2);
        let dir = p5.Vector.sub(p.pos, center);

        dir.normalize();
        dir.mult(0.05);

        p.applyForce(dir);
    }

    // interacción mouse tipo Claude
    p.mouseFlow(mouseX, mouseY, bass);

    p.update();
    p.edges();
    p.show(col, level, treble);
  }

  for (let i = smoke.length - 1; i >= 0; i--) {
    let s = smoke[i];

    s.vel.y -= bass * 0.0005;

    s.update();
    s.show();

    if (s.isDead()) {
        smoke.splice(i, 1);
    }
  }

  t += 0.01;
}

function drawRearLights(mid) {

  let intensity = map(mid, 0, 255, 30, 180);
  let pulse = sin(frameCount * 0.1) * 5;

 
  push();
  translate(width / 2, height / 2);

  let spacing = 90;
  let radius = 25;
 
  for (let i = 4; i < 8; i += 2) {

    spacing = 90 * i;

    for (let j = -0.5; j <= 0.5; j += 1) {

        let x = j * spacing;

        // glow grande
        noStroke();
        fill(255, 0, 0, intensity * 0.02);
        circle(x, 0, radius * 3 + pulse);

        // glow medio
        fill(255, 0, 0, intensity * 0.04);
        circle(x, 0, radius * 2 + pulse);

        // núcleo
        fill(255, 50, 50, intensity * 0.05);
        circle(x, 0, radius + pulse);
    }
  }

  pop();
}

// ==============================
// Clase Particle
// ==============================

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.prev = this.pos.copy();
  }

  applyForce(f) {
    this.acc.add(f);
  }

  mouseFlow(mx, my, bass) {
    let d = dist(this.pos.x, this.pos.y, mx, my);
    let radius = 200 + bass;

    if (d < radius && d > 1) {

      let strength = map(d, 0, radius, 1, 0);

      let angle = atan2(this.pos.y - my, this.pos.x - mx) + HALF_PI;

      let v = p5.Vector.fromAngle(angle);
      v.mult(strength * 4);

      this.acc.add(v);
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show(col, level, treble) {

    let speed = this.vel.mag();

    let alpha = map(speed, 0, 6, 40, 200) + map(treble,0,255,0,120);

    let glow = map(speed, 0, 6, 2, 10);

    // glow
    stroke(col[0], col[1], col[2], 20);
    strokeWeight(glow);
    line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);

    // línea principal
    stroke(col[0], col[1], col[2], alpha);
    strokeWeight(1.2);
    line(this.prev.x, this.prev.y, this.pos.x, this.pos.y);

    this.prev = this.pos.copy();
  }
}

// ==============================
// Clase Smoke
// ==============================

class Smoke {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.2, 0.2), random(-0.5, -0.1));
    this.life = 255;
    this.size = random(10, 30);
  }

  update() {
    // subir
    this.vel.y -= 0.003;

    // ruido leve (flow)
    let n = noise(this.pos.x * 0.01, this.pos.y * 0.01);
    let angle = map(n, 0, 1, -PI/4, PI/4);

    let drift = p5.Vector.fromAngle(angle);
    drift.mult(0.1);

    this.vel.add(drift);

    this.pos.add(this.vel);

    this.life -= 2;
  }

  show() {
    noStroke();
    fill(180, 180, 220, this.life * 0.08); // 🔥 mucho más sutil
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  isDead() {
    return this.life < 0;
  }
}

// ==============================
// Interacción
// ==============================

function togglePlay() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.loop();
  }
}

function keyPressed() {

  if (key === '1') mode = 0;
  if (key === '2') mode = 1;
  if (key === '3') mode = 2;

  if (key === '4') {
    for (let p of particles) {
      p.vel.mult(2); // modo clímax
    }
  }

  if (key === ' ') {
    background(0); // reset visual
  }

  if (key === 'f' || key === 'F') {
    fullscreen(!fullscreen());
  }
}