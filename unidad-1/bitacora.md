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

## Bitácora de aplicación 


## Bitácora de reflexión