# Unidad 5
## Bitácora de proceso de aprendizaje


## Bitácora de aplicación 

### Actividad 5

#### Concepto

La pieza generativa representa el ciclo de vida de una idea. Una idea nace de forma clara y estructurada, luego se expande y se conecta con otras, pero a medida que interactúa con su entorno se distorsiona, fragmenta y finalmente desaparece. La obra busca transmitir cómo las ideas pierden su forma original con el tiempo hasta disolverse en el olvido.

#### Bocetos

**Boceto 1:**
- <img width="400" height="600" alt="image" src="https://github.com/user-attachments/assets/d3dd82ba-eec2-4c38-a02f-91561ff2569e" />


**Boceto 2:**
- <img width="400" height="600" alt="image" src="https://github.com/user-attachments/assets/73a6f1c6-2546-42e0-bb58-f9483f4f3356" />


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
**Link**
- [Código en p5.js](https://editor.p5js.org/supervejito80/sketches/F2-wCHtHe)
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

### Actividad 06
**Parte 1 — Principios fundamentales**
1. Una partícula es una entidad con estado

Una partícula no es solo un punto en pantalla, sino que tiene información propia como posición, velocidad, aceleración y tiempo de vida. Este estado define cómo se comporta en cada momento dentro del sistema.

2. Una partícula tiene ciclo de vida

Cada partícula nace, evoluciona y muere. Este ciclo no solo es técnico, sino que también puede comunicar una idea o proceso dentro de la simulación.

3. Un sistema de partículas gestiona colecciones dinámicas de elementos

Un sistema de partículas no maneja una sola entidad, sino múltiples partículas que aparecen y desaparecen constantemente, lo que lo convierte en un sistema dinámico.

4. La creación y eliminación de partículas no es un detalle técnico menor

Es una parte fundamental del modelo, ya que define el comportamiento del sistema en el tiempo y también afecta el rendimiento del programa.

5. Debe haber separación entre la lógica de una partícula y la del sistema

Cada partícula debe encargarse de su propio comportamiento, mientras que el sistema gestiona la colección. Esto permite que el código sea más organizado y flexible.

6. Un emisor o particle system es una abstracción importante

El emisor es el encargado de crear partículas y controlar su flujo. Esto permite encapsular la lógica y reutilizarla en diferentes contextos.

7. Pueden existir sistemas de sistemas

Un sistema puede contener múltiples emisores, y cada emisor puede contener múltiples partículas, lo que permite construir estructuras más complejas.

8. Puede haber heterogeneidad usando herencia y polimorfismo

No todas las partículas tienen que comportarse igual. Se pueden crear diferentes tipos de partículas que compartan una base común pero tengan comportamientos distintos.

9. Las partículas pueden responder a fuerzas globales y locales

Las partículas pueden ser afectadas por fuerzas generales como la gravedad o fuerzas específicas como un repulsor, lo que permite crear comportamientos más complejos.

10. La representación visual puede variar sin cambiar el algoritmo

El comportamiento del sistema puede mantenerse igual aunque cambie la forma en que se visualiza, lo que permite experimentar con diferentes estilos visuales.

**Parte 2 — Transferencia a otra herramienta**

Si quisiera recrear esta pieza en una herramienta como Unity, muchos de los conceptos principales se mantendrían iguales. Por ejemplo, el uso de partículas, fuerzas, vectores y ciclos de vida seguiría siendo el mismo, ya que estos son conceptos independientes de la herramienta.

Lo que cambiaría sería la forma de implementación. En lugar de usar p5.js, se utilizarían componentes propios de Unity como sistemas de partículas, físicas integradas y scripts en C#. También cambiaría la forma en que se manejan los gráficos y la interacción.

Sin embargo, el diseño conceptual de la obra, como el ciclo de vida de las partículas, la transformación de la idea y la interacción del usuario, se mantendría intacto. Esto demuestra que los principios aprendidos no dependen de una herramienta específica, sino que son aplicables en diferentes contextos tecnológicos.
