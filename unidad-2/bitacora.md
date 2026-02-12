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
**¿Para qué sirve el método mag()? Nota que hay otro método llamado magSq(). ¿Cuál es la diferencia entre ambos? ¿Cuál es más eficiente?**
`mag()` es para encontrar la magnitud del vector (o sea cuanto mide). `magSq()` calcula la misma magnitud pero sin calcular la raiz cuadrada y eso sirve para...
**¿Para qué sirve el método normalize()?**
Creo que es para encontrar la direccion del vector haciendo su magnitud 1 o no se
**Te encuentras con un periodista en la calle y te pregunta ¿Para qué sirve el método dot()? ¿Qué le responderías en un frase?**
Proyectar un vector sobre otro? 🤨
**El método dot() tiene una versión estática y una de instancia. ¿Cuál es la diferencia entre ambas?**
**Ahora el mismo periodista curioso de antes te pregunta si le puedes dar una intuición geométrica acerca del producto cruz. Entonces te pregunta ¿Cuál es la interpretación geométrica del producto cruz de dos vectores? Tu respuesta debe incluir qué pasa con la orientación y la magnitud del vector resultante.**


## Bitácora de aplicación 



## Bitácora de reflexión

