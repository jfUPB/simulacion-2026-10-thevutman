# Unidad 2

## Bitácora de proceso de aprendizaje

### Actividad 1
El trabajo que más me impactó fue el de Raven Kwok, especialmente el sketch que simula una especie de cangrejo con movimiento orgánico. Lo que más me llamó la atención fue la naturalidad del desplazamiento: no se siente como una animación rígida programada paso a paso, sino como un organismo vivo que responde a fuerzas internas.

Me gustó cómo el uso de vectores, velocidad y aceleración logra que el movimiento tenga coherencia física. No es simplemente una figura moviéndose en pantalla, sino una estructura que parece tener peso, dirección e intención. Esa sensación de “vida” generada a partir de reglas matemáticas me resultó muy poderosa.

Este trabajo me hizo pensar que los vectores no solo sirven para mover objetos, sino para construir comportamientos complejos y expresivos. Me gustaría experimentar con algo similar: crear una forma que no solo se desplace, sino que transmita carácter a través del movimiento.

### Actividad 2
**¿Cómo funciona la suma de dos vectores en p5.js?**
En p5.js, la suma de vectores no se hace con el operador `+`, sino utilizando métodos propios del objeto `p5.Vector`, como `.add()`. Cuando hacemos:
``` js
position.add(velocity);
```
lo que ocurre es que se suman componente por componente:
- position.x = position.x + velocity.x
- position.y = position.y + velocity.y
Esto significa que el vector `velocity` actúa como un desplazamiento que se acumula en `position`, permitiendo que el objeto se mueva continuamente en el espacio.

¿Por qué esta línea position = position + velocity; no funciona?
No funciona porque en JavaScript los vectores en p5.js son objetos, no números simples. El operador `+` solo funciona directamente con tipos primitivos como números o strings, pero no sabe cómo sumar objetos de tipo `p5.Vector`.
Cuando intentamos:
``` js
position = position + velocity;
```
JavaScript no entiende cómo combinar esos dos objetos vectoriales, ya que no está definida una operación matemática automática para ellos.
Por eso debemos usar métodos específicos como:
``` js
position.add(velocity);
```
o también:
``` js
position = p5.Vector.add(position, velocity);
```
que sí están diseñados para sumar vectores correctamente.

### Actividad 3
**¿Qué tuviste que hacer para hacer la conversión propuesta?**

Para este ejercicio, tomé el ejemplo del "random walker" de la Unidad 1 y lo convertí para que utilice vectores en lugar de variables separadas para las coordenadas x y y. Lo que tuve que hacer fue crear un vector usando createVector() y luego manipular las coordenadas del vector (por ejemplo, cambiando v.x y v.y) dentro de una función que lo actualiza, en vez de tratar cada componente por separado.

**Código**
``` js
let position;

function setup() {
    createCanvas(400, 400);
    position = createVector(6,9);
    console.log(position.toString());
    playingVector(position);
    console.log(position.toString());
    noLoop();
}

function playingVector(v){
    v.x = 20;
    v.y = 30;
}

function draw() {
    background(220);
    console.log("Only once");
}
```
### Actividad 4
**¿Qué resultado esperas obtener en el programa anterior?**

Esperaba que en cosola se viera como se cambian las coordenadas del vector de 6, 9 a 20, 30

**¿Qué resultado obtuviste?**

Lo que esperaba obtener que se accedia al vector por su referencia y se le cambianban sus valores

**¿Qué tipo de paso se está realizando en el código?**

Es paso por referencia

**¿Qué aprendiste?**

Nada

### Actividad 5
**1) ¿Para qué sirve el método mag()? ¿Cuál es la diferencia con magSq()? ¿Cuál es más eficiente?**
El método mag() sirve para calcular la magnitud de un vector, es decir, su longitud. La fórmula es sqrt(x² + y²) para un vector 2D (o sqrt(x² + y² + z²) en 3D).
La diferencia con magSq() es que el método magSq() devuelve el cuadrado de la magnitud, evitando el cálculo de la raíz cuadrada, lo que lo hace más eficiente en términos de procesamiento. Aunque no proporciona la longitud real, es útil cuando solo necesitamos comparar las magnitudes de diferentes vectores (sin necesidad de obtener el valor exacto).

**2) ¿Para qué sirve el método normalize()?**
El método normalize() ajusta la magnitud de un vector para que sea igual a 1, manteniendo su dirección. Es útil cuando solo nos interesa la dirección del vector, pero no su magnitud. De esta manera, el vector "normalizado" se convierte en un vector unitario.

**3) ¿Para qué sirve el método dot()?**
El método dot() calcula el producto punto entre dos vectores. Este valor nos da la proyección de un vector sobre otro y es útil para determinar el ángulo entre dos vectores. Si el producto punto es 0, los vectores son perpendiculares.

**4) El método dot() tiene una versión estática y una de instancia. ¿Cuál es la diferencia?**
La versión de instancia de dot() se usa cuando tenemos un vector específico y lo comparamos con otro, mientras que la versión estática se usa para calcular el producto punto entre dos vectores sin necesidad de tener un objeto p5.Vector previamente definido. Es decir, el estático se utiliza directamente para pasar dos vectores como parámetros.

**5) ¿Cuál es la interpretación geométrica del producto cruzado de dos vectores?**
El producto cruzado de dos vectores en 3D da como resultado un vector perpendicular a los dos vectores originales.

La magnitud de este vector es igual al área del paralelogramo formado por los dos vectores, lo que significa que indica cuán "grande" es el área generada por esos vectores.

La orientación del vector resultante se determina según la regla de la mano derecha: si enrollas los dedos de la mano derecha de un vector al otro, el pulgar te indica la dirección del vector resultante.

**6) ¿Para qué te puede servir el método dist()?**
El método dist() calcula la distancia entre dos puntos (o vectores), es decir, la longitud del segmento de línea recta entre ellos. Es útil para medir la separación entre dos posiciones en un espacio.

**7) ¿Para qué sirven los métodos normalize() y limit()?**

normalize() ajusta la magnitud de un vector a 1, pero mantiene su dirección.

limit() restringe la magnitud de un vector a un valor máximo especificado, lo cual es útil cuando quieres controlar la velocidad o la fuerza de un movimiento en un sistema.

### Actividad 6
**1) Codigo**
``` js
function setup() {
  createCanvas(200, 200);
}

function draw() {
  background(200);

  // Base (origen común)
  let v0 = createVector(100, 100);

  // Vectores desde la base
  let vRed = createVector(80, 0);  // rojo (eje X)
  let vBlue = createVector(0, 80); // azul (eje Y)

  // t animado 0→1→0
  let t = (sin(frameCount * 0.03) + 1) / 2;

  // Vector interpolado (se mueve entre rojo y azul)
  let vPurple = p5.Vector.lerp(vRed, vBlue, t);

  // 1) Flechas desde la base
  drawArrow(v0, vRed, color("red"));
  drawArrow(v0, vBlue, color("blue"));

  // 2) Flecha morada animada desde la base
  drawArrow(v0, vPurple, color(150, 0, 200)); // morado fijo

  // 3) Flecha que cierra el triángulo: de punta azul → punta roja
  // Punta roja = v0 + vRed, punta azul = v0 + vBlue
  let tipRed = p5.Vector.add(v0, vRed);
  let tipBlue = p5.Vector.add(v0, vBlue);

  // Vector “lado” = (punta roja - punta azul)
  let sideVec = p5.Vector.sub(tipRed, tipBlue);

  // Dibuja flecha desde la punta azul hacia la punta roja
  drawArrow(tipBlue, sideVec, color(0, 140, 0));
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);

  translate(base.x, base.y);

  // cuerpo
  line(0, 0, vec.x, vec.y);

  // punta
  rotate(vec.heading());
  let arrowSize = 10;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);

  pop();
}
```
**2) ¿Cómo funciona lerp()?**

El método `lerp()` realiza una interpolación lineal entre dos vectores, calculando un punto intermedio. El tercer parámetro de `lerp()` es un valor entre 0 y 1 que indica la posición relativa entre los dos vectores:

`t = 0` significa que el resultado será el primer vector (rojo en este caso).

`t = 1` significa que el resultado será el segundo vector (azul).

`t` variando suavemente entre 0 y 1 hace que la flecha morada se mueva suavemente entre estos dos vectores.

**3) ¿Cómo se dibujan las flechas usando drawArrow()?**

La función `drawArrow()` es responsable de dibujar una flecha en pantalla.

line(0, 0, vec.x, vec.y) dibuja la línea que representa el cuerpo de la flecha.

rotate(vec.heading()) rota la flecha para que apunte en la dirección de vec.

translate(vec.mag() - arrowSize, 0) ajusta la punta de la flecha para dibujarla correctamente.

triangle() dibuja la punta de la flecha.

**4) ¿Cómo se calcula el vector verde que completa el triángulo?**

El vector verde es el que conecta el final del vector rojo con el final del vector azul, completando el triángulo. Esto se calcula como la diferencia entre las posiciones finales de los dos vectores (es decir, de las punta roja y punta azul). Usamos:

`let sideVec = p5.Vector.sub(tipRed, tipBlue);`


Donde tipRed es la punta del vector rojo (rojo + base) y tipBlue es la punta del vector azul (azul + base). El resultado, sideVec, es el vector verde que completa el triángulo y se dibuja con `drawArrow()`.

### Actividad 7
**1) ¿Cuál es el concepto del marco Motion 101 y cómo se interpreta geométricamente?**

Motion 101 es un marco simple para describir el movimiento en términos de vectores. Este marco se basa en tres elementos esenciales:

Posición: La ubicación de un objeto en el espacio, representada como un vector.

Velocidad: El cambio en la posición a lo largo del tiempo, también representado como un vector.

Actualización: El proceso de agregar la velocidad a la posición para mover al objeto.

Geométricamente, la posición es un punto en el espacio, y la velocidad es un vector que indica la dirección y magnitud del movimiento. Al sumar la velocidad a la posición, el objeto se mueve en la dirección indicada por su velocidad. El movimiento puede visualizarse como un desplazamiento de un punto a lo largo de una trayectoria, determinada por la velocidad.

**2) ¿Cómo se aplica Motion 101 en el ejemplo?**

En el código del ejemplo 1.7, el marco Motion 101 se implementa de la siguiente manera:

Posición: Cada "mover" (objeto) tiene una posición inicial representada por un vector this.position, que se establece en un valor aleatorio dentro del lienzo.

Velocidad: Cada "mover" también tiene una velocidad inicial representada por el vector this.velocity, que se define aleatoriamente con valores entre -2 y 2 para ambos ejes X y Y.

Actualización: El método update() actualiza la posición del "mover" al sumar la velocidad a la posición. Esto se hace con el código this.position.add(this.velocity);, que aplica el principio de Motion 101 para mover el objeto en cada fotograma.

Comprobación de bordes: El método checkEdges() se asegura de que el "mover" se quede dentro del lienzo, reiniciando su posición si sale de los límites. Esto permite que el objeto se "envuelva" en el lienzo, creando un movimiento continuo.

Así, el marco Motion 101 se utiliza en este ejemplo para mover un objeto aleatorio dentro de un espacio, aplicando los conceptos de posición, velocidad y actualización en cada fotograma.

### Actividad 8
**1) Aceleración constante:**
Cuando un objeto tiene aceleración constante, significa que la velocidad del objeto cambia de manera uniforme en el tiempo. El objeto empieza a moverse más rápido a medida que pasa el tiempo, ya que la aceleración se suma constantemente a la velocidad en cada fotograma. Geométricamente, esto genera un movimiento en línea recta que se acelera constantemente, produciendo una curvatura creciente en el movimiento.

Observación:
Al usar aceleración constante, el objeto empieza despacio pero gradualmente va acelerando, lo que genera un movimiento que no es uniforme. En el espacio visual, el objeto se aleja cada vez más rápido del punto de inicio.

**2) Aceleración aleatoria:**
En este caso, la aceleración cambia aleatoriamente en cada fotograma. Esto hace que el objeto cambie su velocidad en direcciones impredecibles. No hay una trayectoria fija, ya que cada vez que la aceleración cambia, el objeto cambia de dirección y velocidad.

Observación:
La aceleración aleatoria genera un movimiento errático e impredecible, con saltos inesperados en todas las direcciones. El objeto no sigue una trayectoria coherente y puede cambiar su dirección rápidamente. Este tipo de aceleración genera una sensación de descontrol en el movimiento del objeto.

**3) Aceleración hacia el mouse:**
Aquí, el objeto ajusta su aceleración para moverse hacia el mouse. Esto genera un comportamiento dirigido, donde la aceleración está controlada por la distancia y dirección al mouse. El objeto tiende a acercarse al mouse, pero la aceleración hace que se mueva de manera más fluida en lugar de simplemente hacer un movimiento directo hacia el puntero.

Observación:
La aceleración hacia el mouse crea un movimiento que se adapta dinámicamente a la posición del mouse. Cuando el mouse está cerca, el objeto se mueve con menor aceleración, y cuando el mouse está más lejos, la aceleración aumenta. Esto genera un movimiento fluido y sensible al control del mouse, lo que lo hace muy interactivo.

## Bitácora de aplicación 

### Actividad 9
**1) Concepto de la obra generativa:**
La obra generativa creada utiliza la fuerza de gravedad como metáfora de atracción. En esta pieza, las partículas (que representan pequeños cuerpos) se sienten atraídas por un objeto central que se mueve según la posición del mouse. A medida que el mouse se desplaza por el lienzo, la aceleración de cada partícula cambia en función de su distancia al centro (mouse). Las partículas se mueven de manera dinámica, acercándose al centro, lo que genera una interacción constante entre el espectador y la obra.

Regla de aceleración aplicada:
La aceleración de cada partícula está determinada por la fórmula de gravedad inversa:

```
Aceleracion = 1/distacia^2
```
​
Esto significa que, a medida que las partículas se acercan al mouse, la aceleración disminuye, y cuando están más alejadas, la aceleración aumenta. Este comportamiento crea una sensación de atracción dinámica hacia el punto de interacción (el mouse), evocando la manera en que las fuerzas invisibles (como la gravedad) pueden controlar el movimiento de los cuerpos.

Decisión de diseño y exploración artística:
La elección de utilizar gravedad inversa como base para la aceleración fue una forma de explorar la interacción y control en la obra. Al mover el mouse, el usuario puede modificar el movimiento de las partículas, pero el comportamiento sigue las reglas físicas de un sistema dinámico. Esto hace que la obra sea interactiva y fluida, lo que permite que el espectador sienta que está influyendo en el entorno mientras observa el comportamiento de las partículas. La obra evoca la idea de cómo las fuerzas invisibles controlan el movimiento, y cómo la interacción con un sistema puede alterar su curso.

**Código de la aplicación:**
``` js
let particles = [];

function setup() {
    createCanvas(400, 400);
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(random(width), random(height)));
    }
}

function draw() {
    background(200);

    let center = createVector(mouseX, mouseY);

    fill(255, 0, 0);
    noStroke();
    ellipse(center.x, center.y, 20, 20);

    for (let p of particles) {
        p.update(center);
        p.show();
    }
}

class Particle {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
    }

    update(center) {
        let dir = p5.Vector.sub(center, this.position);
        let distance = dir.mag();

        dir.normalize();
        let forceMagnitude = 100 / (distance * distance); // Gravedad
        dir.mult(forceMagnitude);

        this.acceleration = dir;
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    }

    show() {
        fill(0, 0, 255, 100);
        noStroke();
        ellipse(this.position.x, this.position.y, 10, 10); // Dibujamos la partícula
    }
}
```
**Enlace al proyecto en p5.js:**

[LINK](https://editor.p5js.org/supervejito80/sketches/-kzDLXGer)

**Capturas de pantalla representativas:**

<img width="437" height="428" alt="image" src="https://github.com/user-attachments/assets/426f940d-6bb4-4802-a20e-b242aded015f" />


## Bitácora de reflexión

### Actividad 10

**1) Concepto de la obra generativa**

Mi obra generativa se inspira en las ideas de Jared Tarbell y Jeffrey Ventrella, quienes exploran patrones, formas orgánicas y estructuras generativas en su arte. En particular, la obra Clusters de Jeffrey Ventrella muestra cómo los sistemas generativos pueden crear estructuras complejas a partir de reglas simples y de movimiento. Siguiendo este enfoque, creé una obra que utiliza vectores y aceleración para generar patrones dinámicos en tiempo real, donde las partículas o "mover" siguen una dirección influenciada por el mouse.

La pieza juega con la aceleración hacia el mouse, donde cada partícula no solo sigue la dirección del puntero, sino que responde a la aceleración y la interacción en tiempo real, lo que da como resultado un comportamiento fluido y controlado. El concepto principal de esta obra es explorar la relación entre fuerzas invisibles (aceleración) y movimiento y cómo pequeñas reglas pueden generar patrones complejos y visualmente interesantes.

**2) Código de la aplicación**
``` js
class Mover {
  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.topspeed = 5;
  }

  update() {
    let mouse = createVector(mouseX, mouseY);
    
    // Paso 1: Calcular dirección
    let dir = p5.Vector.sub(mouse, this.position);

    // Paso 2: Normalizar
    dir.normalize();

    // Paso 3: Escalar
    dir.mult(0.2);  // Controlamos la intensidad de la aceleración

    // Paso 4: Aceleración
    this.acceleration = dir;

    // Actualizamos la velocidad y limitamos la velocidad máxima
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topspeed);

    // Actualizamos la posición
    this.position.add(this.velocity);
  }

  show() {
    stroke(0);
    strokeWeight(2);
    fill(127);
    circle(this.position.x, this.position.y, 48);  // Dibuja la partícula
  }
}

let movers = [];

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 5; i++) {
    movers.push(new Mover());  // Creamos múltiples "movers"
  }
}

function draw() {
  background(200);

  for (let mover of movers) {
    mover.update();  // Actualizamos la posición de cada "mover"
    mover.show();    // Mostramos cada "mover" como una partícula
  }
}
```

**3) Enlace al proyecto en el editor de p5.js**

[Link](https://editor.p5js.org/supervejito80/sketches/CVAK48gb3)

**4) Capturas de pantalla representativas de tu pieza de arte generativa**

<img width="416" height="396" alt="image" src="https://github.com/user-attachments/assets/bcbe102f-66a7-427c-86d8-72586d9b8f83" />


**5) Resumen del proceso de diseño y reflexión**

Mi obra generativa interactiva utiliza el concepto de Motion 101 de aceleración basada en la dirección hacia el mouse. La obra fue inspirada por la exploración artística de patrones generativos en el trabajo de Jeffrey Ventrella y Jared Tarbell. Al usar aceleración proporcional a la distancia del mouse, he creado un sistema en el que las partículas se mueven hacia el punto de atracción (el mouse) con un comportamiento suave y fluido.

Además, me aseguré de que el sistema fuera interactivo en tiempo real, permitiendo que el usuario influya en el movimiento de las partículas simplemente moviendo el mouse por la pantalla. Esta interactividad no solo añade una capa de control, sino que también genera una experiencia dinámica que cambia constantemente.

