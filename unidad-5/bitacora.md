# Unidad 5
## Bitácora de proceso de aprendizaje


## Bitácora de aplicación 

### Actividad 5

#### Concepto

La pieza generativa representa el ciclo de vida de una idea. Una idea nace de forma clara y estructurada, luego se expande y se conecta con otras, pero a medida que interactúa con su entorno se distorsiona, fragmenta y finalmente desaparece. La obra busca transmitir cómo las ideas pierden su forma original con el tiempo hasta disolverse en el olvido.

#### Bocetos

**Boceto 1:**
Una partícula central (idea) que genera pequeñas partículas a su alrededor conectadas por líneas, mostrando una estructura organizada.

**Boceto 2:**
La estructura comienza a romperse, las conexiones desaparecen y las partículas se dispersan formando un patrón caótico antes de desaparecer.

#### Mapa de decisiones
**Tipos de partículas**

Se implementaron dos tipos de partículas:

- **IdeaParticle:** representa la idea inicial, con movimiento más estable y conexiones visibles.
- **ChaosParticle:** representa la distorsión de la idea, con movimiento más caótico y comportamiento más impredecible.

Esto permite mostrar la transformación del sistema mediante herencia y polimorfismo.

**Ciclo de vida**

Cada partícula nace, se transforma y muere:

- **Nacimiento:** al hacer click se genera una idea.
- **Transformación:** la idea se fragmenta en múltiples partículas caóticas.
- **Muerte:** las partículas se desvanecen progresivamente (no desaparecen de forma instantánea).

La explosión final representa la pérdida total de coherencia de la idea.

**Fuerzas**

Se utilizaron dos tipos de fuerzas:

- **Ruido Perlin (noise):** genera un campo de flujo que simula la distorsión de la idea.
- **Fuerza elástica (resortes):** conecta partículas y representa la coherencia inicial de la idea.

Cuando las conexiones se rompen, se evidencia el paso del orden al caos.

**Interacción**

El usuario interactúa mediante el mouse:

- **Click:** genera una nueva idea.
- **Mantener presionado:** intensifica el sistema, representando la sobrecarga o saturación de ideas.

La interacción no es solo técnica, sino que representa la acción de generar o forzar ideas.

**Visualización**
- Las partículas cambian de color según su estado (orden → caos).
- Se usan transparencias para representar el paso del tiempo.
- Se implementan rastros (trails) para simular humo o memoria residual.
- El glow representa la intensidad de la idea en sus primeras etapas.
#### Implementación

**sketch**
``` js
let particles = [];
let springs = [];
let t = 0;

function setup() {
  createCanvas(800, 500);
}

function draw() {

  // trails suaves
  background(10, 10, 20, 15);

  // intensidad con click
  let intensity = mouseIsPressed ? 4 : 1;

  // SPRINGS
  for (let s of springs) {
    s.update();
    s.show();
  }

  // PARTICLES
  for (let p of particles) {
    
    let center = createVector(width/2, height/2);
    let toCenter = p5.Vector.sub(center, p.pos);

    toCenter.mult(0.0005); // fuerza suave

    p.applyForce(toCenter);

    let n = noise(p.pos.x * 0.005, p.pos.y * 0.005, t);
    let angle = map(n, 0, 1, -PI, PI) + sin(frameCount * 0.02);

    let flow = p5.Vector.fromAngle(angle);
    flow.mult(0.2 * intensity);

    p.applyForce(flow);

    p.update();
    p.show();
  }

  particles = particles.filter(p => !p.isDead());
  springs = springs.filter(s => !s.isDead());

  t += 0.01;
}

function mousePressed() {
  for (let i = 0; i < 3; i++) {
    particles.push(new IdeaParticle(mouseX, mouseY));
  }
}
```

**Particle.js**
``` js
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.life = 255;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.life -= 1.5;
  }

  isDead() {
    return this.life < 0;
  }
}
```

**IdeaParticle.js**
``` js
class IdeaParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.age = 0;
  }

  update() {
    super.update();
    this.age++;

    if (this.age > 50 && random(1) < 0.07) {
      let child = new ChaosParticle(this.pos.x, this.pos.y);
      particles.push(child);

      let s = new Spring(this, child);
      springs.push(s);
    }

    // explosión final
    if (this.life < 140 && !this.exploded) {
      this.exploded = true;

      for (let i = 0; i < 20; i++) {
        let c = new ChaosParticle(this.pos.x, this.pos.y);
        c.vel = p5.Vector.random2D().mult(random(0.5, 2));
        particles.push(c);
      }
    }
  }

  show() {

    let glowSize = map(this.life, 255, 0, 25, 5);

    // glow
    fill(100, 200, 255, 40);
    noStroke();
```

**ChaosParticle.js**
``` js
class ChaosParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.life = 200;
  }

  update() {
    super.update();
    this.vel.add(p5.Vector.random2D().mult(0.4));
  }

  show() {

    let glow = map(this.life, 200, 0, 20, 2);

    // glow
    fill(255, 100, 200, 30);
    circle(this.pos.x, this.pos.y, glow * 2);

    // núcleo
    fill(255, 120, 200, this.life);
    circle(this.pos.x, this.pos.y, 4);
  }
}
```

**Spring.js**
``` js
class Spring {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.restLength = 30;
    this.k = 0.01;
    this.life = 200;
  }

  update() {

    let force = p5.Vector.sub(this.b.pos, this.a.pos);
    let d = force.mag();

    let stretch = d - this.restLength;

    if (abs(stretch) > 40) {
      this.life = 0;
    }

    force.normalize();
    force.mult(-1 * this.k * stretch);

    this.a.applyForce(force);
    this.b.applyForce(p5.Vector.mult(force, -1));

    this.life--;
  }

  show() {

    stroke(180, 150, 255, this.life);
    strokeWeight(1.5);
    line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
  }

  isDead() {
    return this.life < 0;
  }
}
```
#### Capturas
**Idea recién creada (orden)**
- <img width="864" height="554" alt="image" src="https://github.com/user-attachments/assets/06facdd0-5388-4fef-827f-5dc57c6e77e1" />
**Transformación (conexiones + fragmentación)**
- <img width="856" height="548" alt="image" src="https://github.com/user-attachments/assets/8c9e07de-2487-4a20-a8ca-4ae5beca6cc5" />
**Caos y disolución**
- <img width="856" height="544" alt="image" src="https://github.com/user-attachments/assets/31d76ee4-af0e-4439-904b-fe08e752bf31" />

#### Explicación general

El sistema está construido como un sistema de partículas donde cada elemento tiene un ciclo de vida. La combinación de fuerzas, ruido y conexiones permite representar visualmente la transformación de una idea desde su nacimiento hasta su desaparición.

La obra no busca simular un fenómeno físico real, sino usar herramientas de simulación para representar un proceso conceptual: la pérdida de claridad de una idea a medida que se propaga.

## Bitácora de reflexión
