# Unidad 3

## Bitácora de proceso de aprendizaje
### Actividad 02

En esta actividad entendí cómo se extiende Motion 101 para que la aceleración no sea “inventada” a mano cada frame, sino calculada como el resultado de fuerzas. La idea central viene de la 2ª ley de Newton, donde la aceleración depende de la fuerza neta y la masa:

- Si asumimos masa = 1, entonces a = F y basta con sumar fuerzas directamente en la aceleración.
- Si usamos masa distinta de 1, entonces a = F / m y cada fuerza debe escalarse antes de sumarla.

Lo que más me quedó claro es que, en cada frame, la aceleración no es permanente: se usa como un “acumulador” temporal de fuerzas.

**¿Por qué se multiplica la aceleración por 0 en cada frame?**

Es necesario porque la aceleración debe representar solo las fuerzas que actúan en ese frame.
Si no se resetea `(acceleration.mult(0))`, las fuerzas se quedarían acumuladas para siempre y el objeto aceleraría cada vez más incluso si ya no se le aplican fuerzas nuevas. Es como si el sistema “recordara” fuerzas viejas, lo cual no tiene sentido físico para el modelo.

**¿Por qué se hace justo al final de `update()`?**

Porque el orden correcto es:

1. Acumular fuerzas `(applyForce(wind)`, `applyForce(gravity)`, etc.)
2. Con esa suma, actualizar velocidad y posición
3. Limpiar la aceleración para el siguiente frame

Así la aceleración funciona como “sumatoria de fuerzas del frame actual”, y en el próximo frame se vuelve a calcular desde cero.

**¿Qué problema aparece cuando usamos masa y hacemos `force.div(10)`?**

El problema es que `force` es un p5.Vector (objeto), y los objetos se pasan por referencia.
Entonces, si en `applyForce()` hago `force.div(10)`, estoy modificando el vector original que fue pasado desde afuera. Eso puede dañar el sistema porque:

- la misma fuerza podría reutilizarse en otros movers,
- o podría aplicarse varias veces y cada vez quedaría más pequeña,
- o simplemente deja de representar la fuerza real.

La solución correcta es no modificar el vector original, sino trabajar con una copia o con una operación que retorne un nuevo vector:

``` js
let f = p5.Vector.div(force, 10);
this.acceleration.add(f);
```

Con esto, la fuerza original se mantiene intacta, pero se aplica una versión escalada según la masa.

### Actividad 3

**1) Fricción**
[Link a la obra](https://editor.p5js.org/supervejito80/sketches/Kq_8laSh0)

2) Resistencia del aire

[Link a la obra](https://editor.p5js.org/supervejito80/sketches/RNm2bz44R)

3) Atracción gravitacional (planetas)

[Link a la obra](https://editor.p5js.org/supervejito80/sketches/uQ4n1fD9v)

## Bitácora de aplicación 

### Actividad 4
#### Concepto e historia

La obra cuenta la historia de un sistema nervioso: una red de nodos conectados que transmite “impulsos”. Cada nodo es como una neurona y cada conexión es como un nervio elástico. Cuando el usuario toca o arrastra un nodo, la red completa reacciona: la tensión viaja, el sistema se adapta, y aparecen ondas de movimiento como si el cuerpo estuviera respondiendo a un estímulo.

**Vínculo entre narrativa y reglas del sistema**

- **Resortes (fuerza elástica):** representan conexiones vivas. Si se estiran, “quieren volver” a su longitud natural.
- **Amortiguación / fricción (damping):** evita que la red se vuelva infinita o caótica; simula pérdida de energía real.
- **Arrastre del mouse (interacción):** el usuario actúa como un estímulo externo (un toque) que altera el equilibrio.
- **Movimiento emergente:** no se anima “a mano”; surge porque el sistema intenta recuperar estabilidad.

#### Código

``` js
let nodes = [];
let springs = [];
let grabbed = null;
let grabOffset;

function setup() {
  createCanvas(640, 360);
  background(245);

  let cols = 9;
  let rows = 5;
  let spacing = 60;

  let startX = (width - (cols - 1) * spacing) / 2;
  let startY = (height - (rows - 1) * spacing) / 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let px = startX + x * spacing + random(-6, 6);
      let py = startY + y * spacing + random(-6, 6);
      nodes.push(new Node(px, py));
    }
  }

  function idx(x, y) { return y * cols + x; }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let a = nodes[idx(x, y)];
      if (x < cols - 1) springs.push(new Spring(a, nodes[idx(x + 1, y)]));
      if (y < rows - 1) springs.push(new Spring(a, nodes[idx(x, y + 1)]));
      if (x < cols - 1 && y < rows - 1) springs.push(new Spring(a, nodes[idx(x + 1, y + 1)], 0.04));
      if (x > 0 && y < rows - 1) springs.push(new Spring(a, nodes[idx(x - 1, y + 1)], 0.04));
    }
  }
}

function draw() {
  background(245, 40);

  let center = createVector(width / 2, height / 2);

  for (let n of nodes) {
    n.applyDamping(0.04);

    let toCenter = p5.Vector.sub(center, n.position);
    toCenter.mult(0.0006);
    n.applyForce(toCenter);
  }

  for (let s of springs) s.apply();

  // Si hay nodo agarrado, lo seguimos con el mouse
  if (grabbed) {
    grabbed.position.set(mouseX + grabOffset.x, mouseY + grabOffset.y);
    grabbed.velocity.mult(0); // al agarrar, cortamos inercia para que no explote
  }

  for (let s of springs) s.show();

  for (let n of nodes) {
    n.update();
    n.wrapEdges(20);
    n.show();
  }

  noStroke();
  fill(0, 120);
  textSize(12);
  text("Arrastra un nodo = estímulo nervioso | Click rápido = impulso", 12, 18);
}

// --- Interacción ---
function mousePressed() {
  let m = createVector(mouseX, mouseY);
  let closest = null;
  let best = 99999;

  for (let n of nodes) {
    let d = p5.Vector.dist(n.position, m);
    if (d < 18 && d < best) {
      best = d;
      closest = n;
    }
  }

  if (closest) {
    grabbed = closest;
    grabOffset = p5.Vector.sub(grabbed.position, m);
  } else {
    for (let n of nodes) {
      let d = p5.Vector.dist(n.position, m);
      if (d < 120) {
        let push = p5.Vector.sub(n.position, m);
        push.normalize();
        push.mult(2.5 * (1 - d / 120));
        n.applyForce(push);
      }
    }
  }
}

function mouseReleased() {
  grabbed = null;
}

// --- Clases ---
class Node {
  constructor(x, y) {
    this.mass = 1;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  applyDamping(k) {
    let damp = this.velocity.copy().mult(-k);
    this.applyForce(damp);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  wrapEdges(margin) {
    if (this.position.x < -margin) this.position.x = width + margin;
    if (this.position.x > width + margin) this.position.x = -margin;
    if (this.position.y < -margin) this.position.y = height + margin;
    if (this.position.y > height + margin) this.position.y = -margin;
  }

  show() {
    noStroke();
    fill(20, 140);
    circle(this.position.x, this.position.y, 8);
  }
}

class Spring {
  constructor(a, b, k = 0.06) {
    this.a = a;
    this.b = b;
    this.k = k;

    this.restLength = p5.Vector.dist(a.position, b.position);
  }

  apply() {
    let force = p5.Vector.sub(this.b.position, this.a.position);
    let d = force.mag();
    if (d === 0) return;

    let stretch = d - this.restLength;
    force.normalize();
    force.mult(this.k * stretch);

    this.a.applyForce(force);
    this.b.applyForce(force.copy().mult(-1));
  }

  show() {
    stroke(0, 50);
    line(this.a.position.x, this.a.position.y, this.b.position.x, this.b.position.y);
  }
}
```

#### Enlace

- [Enlace de la Obra](https://editor.p5js.org/supervejito80/sketches/xpTShRwSe)

#### Capturas de Pantalla 
<div>
  <img width="600" height="300" alt="image" src="https://github.com/user-attachments/assets/1ef478f2-2091-4a12-b4b1-f5caa3df348e" />
  <img width="600" height="300" alt="image" src="https://github.com/user-attachments/assets/b97aa248-cf6c-4d7a-a509-9d8c36fb98be" />  
</div>

## Bitácora de reflexión

### Actividad 5
