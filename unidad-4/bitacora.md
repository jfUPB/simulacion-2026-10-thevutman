# Unidad 4

## Bitácora de proceso de aprendizaje

### Actividad 01

Al explorar el trabajo de Memo Akten, lo que más me llamó la atención fue la forma en que combina arte, tecnología y fenómenos físicos para generar experiencias visuales que parecen orgánicas y vivas. En la obra Simple Harmonic Motion, se observa cómo un concepto matemático y físico relativamente simple puede transformarse en una composición visual compleja y estética.

Algo que me pareció interesante es que el movimiento no parece completamente aleatorio, sino que sigue patrones repetitivos y oscilatorios, lo que genera una sensación de ritmo y equilibrio en la obra. Este tipo de movimiento recuerda a fenómenos naturales como el movimiento de un péndulo, las olas o las vibraciones. Es interesante ver cómo un sistema basado en reglas matemáticas puede producir resultados visualmente atractivos y casi hipnóticos.

También me llamó la atención la manera en que Memo Akten utiliza la tecnología como un medio para explorar comportamientos emergentes. En lugar de diseñar cada detalle de la imagen manualmente, el artista define un conjunto de reglas físicas y matemáticas que luego generan la obra de manera dinámica. Esto conecta directamente con lo que estamos aprendiendo en la clase sobre sistemas generativos, donde el artista diseña el sistema y el sistema produce el resultado visual.

Finalmente, esta obra me hizo pensar en cómo conceptos científicos como el movimiento armónico simple pueden convertirse en una herramienta creativa para producir arte generativo. La obra demuestra que las matemáticas y la programación no solo sirven para resolver problemas técnicos, sino también para crear experiencias visuales que transmiten ritmo, movimiento y armonía.

### Actividad 02
**Simulación de manejo de ángulos**

En la primera simulación se observa un objeto que rota continuamente alrededor del centro de la pantalla. La interacción principal consiste en modificar o observar cómo cambia el ángulo de rotación en cada frame, lo que produce un movimiento circular o rotatorio de los elementos gráficos.

En cada frame se traslada el origen del sistema de coordenadas al centro de la pantalla utilizando `translate(width/2, height/2)`. Esto se hace porque en p5.js el origen del sistema de coordenadas normalmente está en la esquina superior izquierda. Al mover el origen al centro, resulta mucho más sencillo trabajar con rotaciones, ya que los objetos rotan alrededor del centro de la pantalla en lugar de rotar alrededor de una esquina.

La relación entre el sistema de coordenadas y la función `rotate()` es directa. La función `rotate()` rota el sistema de coordenadas completo alrededor del origen actual. Esto significa que cualquier elemento dibujado después de aplicar la rotación aparecerá girado respecto a ese sistema de referencia.

En el fragmento de código:
``` js
line(-50, 0, 50, 0);
circle(50, 0, 16);
circle(-50, 0, 16);
```

los elementos parecen dibujarse en torno a la posición `(0,0)` porque el origen del sistema de coordenadas ya fue trasladado previamente al centro de la pantalla. En realidad los objetos se dibujan usando coordenadas relativas al nuevo origen.

Aunque en cada frame se ejecuta exactamente el mismo código de dibujo, los elementos rotan porque el sistema de coordenadas está siendo rotado en cada frame mediante la función `rotate()`. Es decir, no se mueve el objeto directamente, sino que se rota el sistema de referencia donde se dibuja.

**Simulación de orientación según la dirección del movimiento**

En la segunda simulación se observa cómo un objeto puede orientarse automáticamente en la dirección en la que se está moviendo. Aquí aparece claramente el marco Motion 101, donde cada objeto tiene:

- posición
- velocidad
- aceleración

El movimiento del objeto se calcula actualizando su posición con base en su velocidad, y su velocidad con base en su aceleración.

En el método `display()` aparece el siguiente fragmento de código:
``` js
let angle = this.velocity.heading();
```

La función `heading()` calcula el ángulo del vector de velocidad. Es decir, devuelve el ángulo que forma el vector con respecto al eje horizontal. Este ángulo luego se utiliza para rotar el objeto y hacer que apunte en la dirección del movimiento.

Las funciones `push()` y `pop()` se utilizan para guardar y restaurar el estado del sistema de coordenadas. `push()` guarda la transformación actual (traslación, rotación, escala) y `pop()` la restaura. Esto permite aplicar transformaciones a un objeto específico sin afectar a los demás elementos del canvas.

La función `rectMode(CENTER)` indica que el rectángulo se dibujará tomando su centro como punto de referencia, en lugar de usar la esquina superior izquierda. Esto facilita la rotación del objeto, ya que al rotarlo gira alrededor de su propio centro.

La relación entre el vector de velocidad y el ángulo de rotación es que el vector de velocidad define la dirección del movimiento. El método `heading()` calcula el ángulo de ese vector, y ese ángulo se usa con `rotate()` para alinear el objeto con la dirección en la que se mueve. De esta forma, el objeto siempre apunta hacia donde se está desplazando.

### Actividad 03

En esta actividad desarrollé una simulación de un vehículo que puede desplazarse por la pantalla utilizando las teclas de flecha. El objetivo era aplicar los conceptos de vectores, ángulos, rotación y el marco Motion 101 para que el vehículo no solo se moviera, sino que también apuntara en la dirección de su movimiento.

El proceso comenzó creando una clase para el vehículo que contiene las variables fundamentales del marco Motion 101: posición, velocidad y aceleración. En cada frame de la simulación se actualiza la velocidad sumando la aceleración, y luego se actualiza la posición sumando la velocidad.

Para controlar el vehículo utilicé las teclas de flecha del teclado. Cuando se presiona la flecha izquierda o derecha se genera una aceleración en el eje horizontal que modifica la velocidad del vehículo. Esto permite que el movimiento se sienta más natural, ya que el vehículo no cambia de posición directamente, sino que responde a cambios en la aceleración.

Un aspecto importante de la simulación fue lograr que el vehículo apuntara hacia la dirección en la que se está moviendo. Para esto utilicé la función `heading()` del vector de velocidad. Esta función calcula el ángulo del vector de velocidad y ese ángulo se utiliza con la función `rotate()` para orientar el vehículo.

Para dibujar el vehículo utilicé un triángulo, ya que esta forma permite visualizar claramente la dirección del movimiento. Antes de dibujarlo, el sistema de coordenadas se traslada a la posición del vehículo utilizando `translate()`, y luego se rota el sistema usando el ángulo calculado con `heading()`. Esto hace que el triángulo siempre apunte en la dirección de la velocidad.

Durante este ejercicio entendí mejor cómo las transformaciones del sistema de coordenadas permiten controlar la orientación de los objetos gráficos. También reforcé la relación entre los vectores de movimiento y los ángulos de rotación, ya que el ángulo del vector de velocidad determina hacia dónde apunta el vehículo.

**Código de la simulación**
``` js
let vehicle;

function setup() {
  createCanvas(640, 360);
  vehicle = new Vehicle();
}

function draw() {
  background(240);

  vehicle.update();
  vehicle.checkEdges();
  vehicle.display();
}

class Vehicle {

  constructor() {
    this.position = createVector(width/2, height/2);
    this.velocity = createVector(0,0);
    this.acceleration = createVector(0,0);
    this.topSpeed = 5;
  }

  update() {

    if (keyIsDown(LEFT_ARROW)) {
      this.acceleration.x = -0.2;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.acceleration.x = 0.2;
    } else {
      this.acceleration.x = 0;
    }

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topSpeed);
    this.position.add(this.velocity);
  }

  display() {

    let angle = this.velocity.heading();

    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    fill(120);
    stroke(0);
    strokeWeight(2);

    triangle(-15, -10, -15, 10, 15, 0);

    pop();
  }

  checkEdges() {

    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

}
```

**Link a p5.js**
- [p5.js](https://editor.p5js.org/supervejito80/sketches/NtJlhX6J3)

### Actividad 04

Al analizar la simulación Motion 101 con fuerzas, es posible identificar claramente el marco Motion 101 que hemos venido trabajando en las unidades anteriores. En este marco, cada objeto del sistema posee tres propiedades principales: posición, velocidad y aceleración. En cada frame de la simulación se actualiza la velocidad sumando la aceleración, y posteriormente se actualiza la posición sumando la velocidad.

Cuando se agregan fuerzas acumulativas, es necesario hacer una modificación importante al marco Motion 101. En lugar de definir directamente la aceleración, esta debe calcularse como la suma de todas las fuerzas que actúan sobre el objeto en ese frame. Para esto se utiliza generalmente una función como `applyForce()`, que añade cada fuerza al vector de aceleración. Una vez que se actualizan la velocidad y la posición, es necesario reiniciar la aceleración multiplicándola por cero. Esto se hace porque la aceleración solo debe representar las fuerzas del frame actual y no acumularse indefinidamente entre frames.

En la simulación también aparece un objeto llamado Attractor, que representa el elemento que ejerce una fuerza de atracción sobre los demás objetos del sistema. Este objeto suele dibujarse como un círculo en el centro de la simulación y su función principal es calcular la fuerza gravitacional o de atracción que afecta a los otros elementos. Para cambiar su color basta con modificar el valor de `fill()` dentro del método que dibuja el Attractor.

El objeto Attractor contiene además dos atributos llamados `this.dragging` y `this.rollover`. Estos atributos permitirían implementar interacción con el mouse. `dragging` indicaría si el usuario está arrastrando el attractor con el mouse, mientras que `rollover` permitiría detectar si el cursor está sobre el attractor para cambiar su color o apariencia.

Para implementar esta funcionalidad se pueden utilizar las funciones de interacción de p5.js como `mousePressed()`, `mouseReleased()` y `mouseDragged()`. Por ejemplo, cuando el mouse se presiona sobre el attractor se puede activar la variable `dragging`, y mientras el mouse se arrastra se actualiza la posición del attractor para que siga al cursor. De manera similar, se puede calcular la distancia entre el mouse y el attractor para activar la variable `rollover` cuando el cursor esté sobre él.

Este ejercicio permitió entender mejor cómo integrar el marco Motion 101 con sistemas de fuerzas, y cómo agregar interacción del usuario dentro de simulaciones físicas. Además, muestra cómo pequeños cambios en el sistema de fuerzas pueden generar comportamientos dinámicos más complejos en los elementos visuales.

### Actividad 05

En esta actividad exploré el uso de coordenadas polares como una forma alternativa de representar posiciones en el plano cuando se trabaja con ángulos. A diferencia del sistema cartesiano, donde una posición se define mediante las coordenadas (x, y), en el sistema polar una posición se define mediante un radio (r) y un ángulo (θ).

La relación entre las coordenadas polares y las coordenadas cartesianas se establece mediante funciones trigonométricas. En el código de la simulación se observa la conversión:

x = r \cos(\theta),; y = r \sin(\theta)

Esto significa que el valor r representa la distancia desde el origen hasta el punto, mientras que θ (theta) representa el ángulo con respecto al eje horizontal. En cada frame el valor de `theta` aumenta ligeramente, lo que hace que el punto se mueva describiendo un movimiento circular alrededor del origen.

Además, antes de realizar el cálculo de las posiciones, el sistema de coordenadas se traslada al centro de la pantalla utilizando `translate(width/2, height/2)`. Esto facilita visualizar el movimiento circular porque el origen se ubica en el centro del canvas.

**Primera modificación del código**

En la siguiente versión del código se utiliza:
``` js
let v = p5.Vector.fromAngle(theta);
```
La función `fromAngle()` crea un vector unitario que apunta en la dirección del ángulo `theta`. Un vector unitario tiene magnitud 1, por lo que sus componentes `x` e `y` representan solo la dirección.

Por esta razón, cuando se dibuja el círculo utilizando `circle(v.x, v.y, 48)`, el punto aparece muy cerca del origen. Esto ocurre porque el vector tiene longitud 1 y no está escalado por el valor del radio `r`.

**Segunda modificación del código**

En la siguiente modificación aparece:
``` js
let v = p5.Vector.fromAngle(theta, r);
```
En este caso, el segundo parámetro de la función `fromAngle()` indica la magnitud del vector. Esto significa que el vector ya no es unitario, sino que tiene una longitud igual a r.

Como resultado, el vector generado tiene las mismas componentes que las obtenidas con la conversión de coordenadas polares a cartesianas. Es decir, ahora `v.x` y `v.y` corresponden a las posiciones correctas del punto en el plano, lo que permite que el círculo se mueva describiendo una trayectoria circular alrededor del origen.

### Actividad 06

En esta actividad exploré el comportamiento de la función sinusoide, que es fundamental para representar movimientos periódicos y oscilatorios. Este tipo de función aparece en muchos fenómenos físicos como ondas, vibraciones, péndulos y movimiento armónico simple.

La forma general de una función sinusoide puede expresarse como:

y = A\sin(\omega t + \phi)

Donde cada parámetro tiene un significado específico:

- **A (amplitud):** determina qué tan grande es la oscilación. Entre mayor sea la amplitud, mayor será la distancia que el objeto se mueve hacia arriba y hacia abajo.
- **ω (velocidad angular):** controla qué tan rápido cambia el ángulo en el tiempo, lo que afecta la velocidad de la oscilación.
- **t (tiempo):** representa el paso del tiempo en la simulación.
- **φ (fase):** desplaza la onda horizontalmente, cambiando el punto en el que comienza la oscilación.

Otro concepto importante es el período, que representa el tiempo que tarda la onda en completar un ciclo completo de movimiento. La frecuencia está relacionada con el período, ya que indica cuántos ciclos ocurren en una unidad de tiempo.

Durante la simulación pude observar cómo cambiar cada uno de estos parámetros modifica el comportamiento de la onda. Por ejemplo, al aumentar la amplitud, el movimiento vertical se vuelve más amplio. Cuando se modifica la velocidad angular, la onda se vuelve más rápida o más lenta. Al cambiar la fase, la forma de la onda permanece igual, pero su posición inicial se desplaza horizontalmente.

Este ejercicio permitió comprender cómo una función matemática relativamente simple puede generar comportamientos dinámicos complejos en una simulación. En el contexto del arte generativo, las funciones sinusoides son muy útiles para crear movimientos suaves, rítmicos y naturales, lo que permite simular fenómenos como vibraciones, oscilaciones o patrones repetitivos en sistemas visuales.

Además, esta actividad me ayudó a entender cómo los parámetros matemáticos pueden convertirse en controles creativos, permitiendo manipular el ritmo y la forma del movimiento dentro de una composición generativa.

### Actividad 08

En esta actividad partí de una simulación de una onda creada con la función seno. En el código original la onda se dibujaba dentro de la función `setup()`, lo que hacía que la simulación se ejecutara solo una vez y la onda permaneciera estática.

Para lograr que la onda se moviera como una ola, trasladé el cálculo de la onda a la función `draw()`, que se ejecuta continuamente en cada frame. Además agregué una variable llamada `offset` que representa un desplazamiento de fase. Este valor se incrementa ligeramente en cada frame, lo que provoca que los valores de la función seno cambien continuamente.

Matemáticamente la onda puede representarse como:

*𝑦 = 𝐴sin(𝜃+𝜙)*

donde:

- **A** es la amplitud
- **θ** es el ángulo que cambia a lo largo del eje x
- **φ** es la fase que cambia con el tiempo

Al modificar la fase gradualmente en cada frame, la onda parece desplazarse horizontalmente, generando el efecto visual de una ola en movimiento.

**Código modificado**
``` js
// The Nature of Code
// Daniel Shiffman

let angle = 0;
let angleVelocity = 0.2;
let amplitude = 100;
let offset = 0; // desplazamiento de la onda

function setup() {
  createCanvas(640, 240);
}

function draw() {
  background(255);

  stroke(0);
  strokeWeight(2);
  fill(127,127);

  let a = offset;

  for (let x = 0; x <= width; x += 24) {

    let y = amplitude * sin(a);

    circle(x, y + height / 2, 48);

    a += angleVelocity;
  }

  // mover la onda en el tiempo
  offset += 0.05;
}
```
**Link**
-[Código Modificado](https://editor.p5js.org/supervejito80/sketches/zaS2R8mTT)

### Actividad 10

En esta actividad modifiqué la simulación original de un péndulo para crear un sistema compuesto por dos péndulos conectados en serie. En el sistema original solo existía un péndulo conectado a un punto fijo. Para extender la simulación agregué un segundo péndulo cuyo punto de pivote es la masa del primer péndulo.

El comportamiento del sistema sigue el mismo principio físico del péndulo simple. La aceleración angular depende de la gravedad, la longitud del brazo y el ángulo del péndulo.

Donde:

- **g** es la gravedad
- **L** es la longitud del brazo
- **θ** es el ángulo del péndulo

En el sistema modificado:

- El primer péndulo cuelga del pivote superior.
- El segundo péndulo utiliza la posición de la masa del primer péndulo como su pivote.

Esto genera un movimiento más complejo porque el segundo péndulo depende del movimiento del primero. Cuando el primer péndulo cambia de posición, el segundo también cambia su punto de referencia, lo que produce un comportamiento dinámico más interesante.

Este tipo de sistema muestra cómo sistemas físicos simples pueden generar comportamientos más complejos cuando se conectan entre sí.

**Código:**
``` js
let pendulum1;
let pendulum2;

function setup() {
  createCanvas(640, 240);

  pendulum1 = new Pendulum(width/2,0,120);
  pendulum2 = new Pendulum(width/2,120,120);
}

function draw() {
  background(255);

  pendulum1.update();
  pendulum1.show();

  // El segundo pivote depende del primero
  pendulum2.pivot = pendulum1.bob;

  pendulum2.update();
  pendulum2.show();
}

class Pendulum {

  constructor(x,y,r){
    this.pivot = createVector(x,y);
    this.bob = createVector();
    this.r = r;

    this.angle = PI/4;
    this.angleVelocity = 0;
    this.angleAcceleration = 0;

    this.damping = 0.995;
    this.ballr = 16;
  }

  update(){

    let gravity = 0.4;

    this.angleAcceleration = (-gravity/this.r) * sin(this.angle);

    this.angleVelocity += this.angleAcceleration;
    this.angle += this.angleVelocity;

    this.angleVelocity *= this.damping;
  }

  show(){

    this.bob.set(
      this.r * sin(this.angle),
      this.r * cos(this.angle)
    );

    this.bob.add(this.pivot);

    stroke(0);
    strokeWeight(2);

    line(this.pivot.x,this.pivot.y,this.bob.x,this.bob.y);

    fill(127);
    circle(this.bob.x,this.bob.y,this.ballr*2);
  }

}
```

**Link**
- [Código p5.js](https://editor.p5js.org/supervejito80/sketches/SR7vIyfG-)
## Bitácora de aplicación 

### Actividad 11

La obra representa un flujo de humo o tinta que se desplaza en un medio invisible, formando remolinos orgánicos que reaccionan a la interacción del usuario. El sistema está definido por un campo de fuerzas que cambia suavemente en el espacio mediante ruido Perlin. Las partículas siguen ese campo como si fueran transportadas por corrientes de aire.

La narrativa conceptual es la de un fluido vivo que respira: el campo de flujo se modula con una función sinusoidal que introduce una pulsación global en el movimiento. El usuario puede intervenir moviendo el mouse, generando perturbaciones que alteran las corrientes y cambian la dirección del flujo.

De esta manera, la obra combina distintos conceptos del curso. La aleatoriedad controlada se introduce mediante ruido Perlin, los vectores definen el movimiento de cada partícula, las fuerzas modifican la aceleración dentro del sistema dinámico, y la modulación sinusoidal introduce un ritmo oscilatorio en el campo de movimiento.

**Código**

``` js
let particles = [];
let t = 0;

function setup() {
  createCanvas(800, 500);
  background(10);
}

function draw() {

  // fondo semitransparente para efecto de rastro
  background(10, 20);

  for (let i = 0; i < 3; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }

  for (let p of particles) {

    // campo de flujo con ruido Perlin
    let n = noise(p.pos.x * 0.005, p.pos.y * 0.005, t);

    // Unidad 4: usar seno para hacer "respirar" el flujo
    let angle = map(n, 0, 1, -PI, PI) + sin(frameCount * 0.02);

    let force = p5.Vector.fromAngle(angle);

    force.mult(0.1);

    p.applyForce(force);

    p.update();
    p.show();
  }

  t += 0.01;
}

class Particle {

  constructor(x, y) {

    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.life = 255;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0);

    this.life -= 2;
  }

  show() {

    noStroke();

    fill(200, 200, 255, this.life);

    circle(this.pos.x, this.pos.y, 6);
  }
}
```

**Link de la obra**
- [Código p5.js](https://editor.p5js.org/supervejito80/sketches/YGMCOjv-5)


## Bitácora de reflexión

### Actividad 12

**Diagrama**

![Image]()

**Aplicación a mi perfil profesional**

Desde mi perfil profesional veo varias oportunidades de aplicar estos conocimientos, especialmente en áreas relacionadas con simulación, visualización y arte generativo.

Una de las aplicaciones más claras es el desarrollo de visualizaciones interactivas, donde sistemas generativos permiten representar información de forma dinámica y atractiva. También pueden aplicarse en videojuegos y experiencias digitales, donde conceptos como fuerzas, vectores y movimiento armónico se utilizan para simular comportamientos físicos realistas.

Además, estos conceptos son muy útiles en el campo del arte generativo y diseño interactivo, donde el artista define reglas matemáticas que generan composiciones visuales dinámicas. Este enfoque permite crear obras que evolucionan constantemente y reaccionan a la interacción del usuario.

Finalmente, el uso de simulaciones basadas en física y sistemas dinámicos también tiene aplicaciones en visualización científica y modelado de fenómenos naturales, lo que abre posibilidades para proyectos interdisciplinarios entre arte, tecnología y ciencia.
