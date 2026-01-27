# Unidad 1

## Bitácora de proceso de aprendizaje

### Actividad 01 — La aleatoriedad en el arte generativo

**Pregunta:** Piensa y describe en una sola frase y en tus propias palabras cómo la aleatoriedad influye en el arte generativo.
**Respuesta:** La aleatoriedad es clave porque le da un valor agregado al arte generativo: hace que cada ejecución sea distinta, logrando que cada usuario viva una experiencia única y no repetitiva.

### Actividad 02 — Caminatas aleatorias

**Antes de ejecutar el código**
Antes de ejecutar el ejemplo A Traditional Random Walk, pensaba que se trataría de un punto que aparecería en posiciones completamente aleatorias dentro del canvas, sin una relación clara entre una posición y la siguiente.

**Después de ejecutar el código**
Al ejecutar el código, ocurrió algo diferente a lo que esperaba. En lugar de puntos aislados, se fue formando un camino continuo que avanzaba paso a paso, dejando un rastro visible. Cada ejecución generó un recorrido distinto, pero siempre manteniendo la lógica de una caminata.

**¿Ocurrió lo que esperabas?**
No ocurrió exactamente lo que esperaba. Fue una sorpresa positiva, ya que permitió entender que la aleatoriedad no implica desorden total, sino decisiones aleatorias dentro de reglas definidas. Esto me hizo pensar en cómo funcionan muchos juegos y simulaciones, donde la aleatoriedad crea recorridos únicos, similares al rastro de alguien caminando.


### Actividad 03 — Distribuciones de probabilidad

**Diferencia entre distribución uniforme y no uniforme**
La distribución uniforme asigna la misma probabilidad a todos los resultados posibles dentro de un rango, mientras que la distribución no uniforme asigna diferentes probabilidades a distintos resultados, haciendo que algunos eventos sean más probables que otros.

``` js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let walker;

function setup() {
  createCanvas(640, 240);
  walker = new Walker();
  background(255);
}

function draw() {
  walker.step();
  walker.show();
}

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    stroke(0);
    point(this.x, this.y);
  }

  step() {
    const choice = random(1);
    if (choice <= 0.5) {
      this.x++;
    } else if (choice > 0.5 && choice <= 0.6) {
      this.x--;
    } else if (choice > 0.6 && choice <= 0.7) {
      this.y++;
    } else {
      this.y--;
    }
  }
}
```

En el código anterior, la distribución no uniforme se refleja en la función `step()`, donde el valor aleatorio `choice` determina el movimiento del caminante. Hay un 50% de probabilidad de moverse a la derecha, un 10% de moverse a la izquierda, un 10% de moverse hacia abajo y un 30% de moverse hacia arriba. Esto crea un patrón de movimiento que favorece ciertas direcciones sobre otras, demostrando cómo una distribución no uniforme puede influir en el comportamiento del sistema.

### Actividad 04 — Distribución Normal (visualización en p5.js)

- **Código (p5.js)**
``` js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

function setup() {
  createCanvas(640, 240);
  background(255);
}

function draw() {
  //{!1} A normal distribution with mean 320 and standard deviation 60
  let x = randomGaussian(320, 20);
  let y = randomGaussian(120, 20);
  
  noStroke();
  fill(0, 10);
  circle(x, y, 16);
}
```
- [actividad 4](https://editor.p5js.org/supervejito80/sketches/T5ZeRjmRR)
- <img width="404" height="264" alt="image" src="https://github.com/user-attachments/assets/bd6c8e9d-fe11-48df-90a5-e9d7ab7e6a7f" />

### Actividad 05 — Distribución personalizada: Lévy flight

**¿Por qué usé Lévy flight?**
Usé Lévy flight porque, a diferencia de una caminata aleatoria “normal” (pasos pequeños constantes), esta técnica introduce saltos grandes poco frecuentes. Eso permite simular un movimiento más realista y “orgánico”, donde la mayoría del tiempo el sistema explora localmente, pero de vez en cuando se desplaza lejos para explorar nuevas zonas.

**¿Qué resultados esperaba obtener?**
Esperaba ver un rastro que normalmente se construye paso a paso cerca de una zona, pero que ocasionalmente haga un “teletransporte” a otra parte del canvas. En otras palabras: muchos movimientos cortos + pocos saltos largos, generando patrones más interesantes que una caminata uniforme.

- **Código (p5.js)**
``` js
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let walker;

function setup() {
  createCanvas(640, 240);
  walker = new Walker();
  background(255);
}

function draw() {
  walker.levyJump();
  walker.step();
  walker.show();
}

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    stroke(0);
    point(this.x, this.y);
  }

  step() {
    const choice = floor(random(4));
    if (choice == 0) {
      this.x++;
    } else if (choice == 1) {
      this.x--;
    } else if (choice == 2) {
      this.y++;
    } else {
      this.y--;
    }
  }
  
  levyJump() {
    const jump = random(1)
    if (jump < 0.001){
      this.x = random(640)
      this.y = random(240)
    }
  }
}
```
- [Actividad 5](https://editor.p5js.org/supervejito80/sketches/UX-oajJc3)
- <img width="811" height="299" alt="image" src="https://github.com/user-attachments/assets/4773b2ce-8ebb-4636-875f-08f529a2b9dc" />

### Actividad 06 — Ruido Perlin (visualización alternativa)

**Concepto**
El ruido Perlin genera valores “aleatorios” pero suaves y continuos: si cambias el input poquito (por ejemplo, el tiempo o la posición), el resultado cambia poquito. Por eso se usa para simular naturaleza (nubes, fuego, agua, montañas), porque no se ve “saltado” como el random normal.

**Resultados esperados**
Esperaba ver una textura continua donde las zonas claras y oscuras se conectan de forma gradual, y que al aumentar el tiempo la textura se mueva lentamente sin cambios bruscos, como una animación orgánica.

**Código (p5.js)**
```
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

let t = 0;

function setup() {
  createCanvas(360, 240);
  noStroke();
}

function draw() {
  background(255);

  let cell = 6;

  for (let x = 0; x < width; x += cell) {
    for (let y = 0; y < height; y += cell) {
      let nx = x * 0.02;
      let ny = y * 0.02;

      let n = noise(nx, ny, t);

      let bright = n * 255;
      fill(bright);
      rect(x, y, cell, cell);
    }
  }

  t += 0.01;
}
```
- [Actividad 6](https://editor.p5js.org/supervejito80/sketches/DFNodTUyt)
- <img width="443" height="294" alt="image" src="https://github.com/user-attachments/assets/7e880473-441f-4a77-a01a-6e805d282b69" />


## Bitácora de aplicación 

### Actividad 07 — Creación de obra generativa

**¿Qué es una obra generativa?**
Una obra generativa es una pieza creada mediante un sistema (generalmente un algoritmo) que produce resultados visuales o sonoros que cambian en cada ejecución. En vez de diseñar un resultado fijo, se diseñan reglas y variables (como aleatoriedad, ruido y distribuciones) para que la obra se “construya” en tiempo real y pueda generar variaciones únicas, especialmente cuando incluye interacción con el usuario.

- **Código (p5.js)**
``` js
let particles = [];
let t = 0;
let levyMode = true;

function setup() {
  createCanvas(640, 360);
  background(255);

  // Crear partículas
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  // Fondo con alfa para dejar rastro
  background(255, 12);

  // Centro interactivo (mouse)
  let cx = mouseX;
  let cy = mouseY;

  for (let p of particles) {
    // Campo de flujo suave con Perlin
    let angle = noise(p.x * 0.01, p.y * 0.01, t) * TWO_PI * 2;
    let vx = cos(angle);
    let vy = sin(angle);

    // Sesgo no uniforme hacia el mouse (empuja suavemente)
    let dx = cx - p.x;
    let dy = cy - p.y;
    let d = sqrt(dx * dx + dy * dy) + 0.0001;
    dx /= d;
    dy /= d;

    // Mezcla: viento (Perlin) + atracción al mouse
    let mix = 0.35; // cuánto influye el mouse
    p.vx = lerp(vx, dx, mix);
    p.vy = lerp(vy, dy, mix);

    // Movimiento tipo random walk (pasos cortos)
    p.step();

    // Lévy flight (saltos raros)
    if (levyMode) p.levyJump();

    p.update();
    p.show();
  }

  t += 0.01;
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    background(255);
    for (let p of particles) {
      p.x = random(width);
      p.y = random(height);
    }
  }
  if (keyCode === 32) { // SPACE
    console.log("l")
    levyMode = !levyMode;
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }

  step() {
    // paso corto (random walk controlado por el campo)
    let stepSize = 1.6;
    this.x += this.vx * stepSize + random(-0.4, 0.4);
    this.y += this.vy * stepSize + random(-0.4, 0.4);
  }

  levyJump() {
    // salto raro (probabilidad baja)
    if (random(1) < 0.001) {
      // salto grande pero con dirección influida por el flujo actual
      let jumpSize = random(40, 160);
      this.x += this.vx * jumpSize;
      this.y += this.vy * jumpSize;
      console.log("jump")
    }
  }

  update() {
    // envolver bordes
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  show() {
    stroke(0, 35);
    point(this.x, this.y);
  }
}
```
- [Actividad 7](https://editor.p5js.org/supervejito80/sketches/eJQRO_hg3)
- <img width="801" height="436" alt="image" src="https://github.com/user-attachments/assets/7102fdd7-b138-49ca-9b09-1a52e7aaaf49" />

## Bitácora de reflexión

### Actividad 08 — Reflexión sobre la aleatoriedad en la simulación y el arte generativo

**1) Diferencia entre random() y Ruido Perlin (noise())**
La aleatoriedad de random() genera valores completamente independientes entre sí, por lo que visualmente produce cambios bruscos y poco continuos. En cambio, el Ruido Perlin (noise()) genera una aleatoriedad suave y correlacionada, donde los valores cercanos tienden a ser parecidos. Usaría random() para decisiones puntuales o eventos impredecibles, y Ruido Perlin para simular fenómenos naturales como movimiento, viento, terrenos o transiciones orgánicas.

**2) ¿Qué es una distribución de probabilidad y diferencia visual entre uniforme y normal?**
Una distribución de probabilidad define qué tan probable es que ocurran ciertos valores dentro de un conjunto de posibilidades. En una caminata aleatoria con distribución uniforme, todas las direcciones tienen la misma probabilidad, lo que produce un movimiento balanceado y sin preferencia clara. En una distribución normal, los valores se concentran alrededor de un punto central, generando visualmente zonas más densas y un comportamiento más estructurado.

**3) Papel de la aleatoriedad en el arte generativo**
La aleatoriedad cumple varios roles en el arte generativo. Primero, permite que cada ejecución de la obra sea única, evitando resultados repetitivos. Segundo, introduce sorpresa y exploración dentro de reglas definidas, combinando control del artista con comportamientos emergentes del sistema.

**4) Concepto de aleatoriedad usado en la obra final (Actividad 07)**
En mi obra final utilicé Ruido Perlin para generar un campo de movimiento suave que guiara a las partículas. Esta elección fue adecuada porque buscaba un efecto orgánico y continuo, donde el movimiento pareciera natural y fluido, en lugar de caótico o abrupto, reforzando la sensación de corrientes o fuerzas invisibles.

**5) ¿Qué es una caminata (walk) y qué caracteriza a un Lévy flight?**
Una caminata es un modelo de simulación donde un agente se desplaza paso a paso tomando decisiones basadas en reglas y aleatoriedad. La característica principal de una caminata tipo Lévy flight es que combina muchos movimientos cortos con saltos largos poco frecuentes, lo que genera patrones más complejos y realistas de exploración del espacio.
